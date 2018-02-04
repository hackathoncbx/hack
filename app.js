const _each = require('lodash/each');
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
require('express-ws')(app);

global.sockets = {};

app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'pew paw'
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const sequelize = require('./init_database');

sequelize
  .authenticate()
  .then(() => {
    app.all('*', (_req, res, next) => {
      res.setHeader('Content-Type', 'application/json');
      next(); // pass control to the next handler
    });

    require('./routes/alerts')('/alerts', app, sequelize);
    require('./routes/defibrillators')('/defibrillators', app, sequelize);
    require('./routes/users')('/users', app, sequelize);
  });

app.ws('/', function(ws, req) {
  initFirstResponder(req, ws);

  ws.on('message', function(msg) {
    updateLocation(req, JSON.parse(msg));

    const data = JSON.parse(msg);
    if (data.location) {
      updateLocation(req, data.location);
    } else if (data.takeAlert) {
      takeAlert(data.takeAlert, req);
    }
  });

  ws.on('close', function() {
    delete global.sockets[req.session.responderId];
  });
});

app.listen(3000);

module.exports = app;

////////////////

function initFirstResponder(req, socket) {
  sequelize.models.firstResponder.findOne({ where: { token: req.query.token } }).then((responder) => {
    if (responder) {
      return responder.update({
        x: req.query.x,
        y: req.query.y
      });
    } else {
      return sequelize.models.firstResponder.create({
        x: req.query.x,
        y: req.query.y,
        token: req.query.token
      });
    }
  }).then((responder) => {
    addSocket(responder, socket, req);
  });
}

function addSocket(firstResponder, socket, req) {
  req.session.responderId = firstResponder.id;
  global.sockets[firstResponder.id] = socket;
}

function updateLocation(req, data) {
  sequelize.models.firstResponder.update({
    x: data.x,
    y: data.y
  }, {
    where: {
      id: req.session.responderId
    }
  });
}

function takeAlert(data, req) {
  sequelize.models.alert.update({
    taken: true
  }, {
    where: { id: data.id }
  }).then(() => {
    return sequelize.models.alertFirstResponder.findAll({ where: { alertId: data.id } });
  }).then((alertsFirstResponders) => {
    _each(alertsFirstResponders, (alertFirstResponder) => {
      if (req.session.responderId == alertFirstResponder.responderId) return;
      global.sockets[alertFirstResponder.responderId].send(JSON.stringify({ type: 'alertCancelled', data: { id: data.id } }));
    });
  });
}

//Email mailing service
const nodemailer = require('nodemailer');
//sendEmail('numeroDeTelephonne@com.com', 'Contenu du message');

function sendEmail(sendTo, message) {
  const transport = nodemailer.createTransport({
    service: 'outlook',
    auth: {
      user: 'hackathonshawinigan@outlook.com',
      pass: 'myPassword123'
    }
  });
  const mailOptions = {
    from: 'hackathonshawinigan@outlook.com',
    to: sendTo,
    subject: 'Important Alert',
    text: message
  };
  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent ' + info.response);
    }
  });
}
