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
