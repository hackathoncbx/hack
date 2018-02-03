const _ = require('lodash');
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

global.sessions = [];

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

    require('./routes/users')('/users', app, sequelize);
  });

app.listen(3000);

const usersSockets = {};
const webSocketServer = new (require('ws')).Server({ port: 5000 });
webSocketServer.on('connection', (socket, req) => {
  createSession(req);
  usersSockets[req.session.id] = socket;

  socket.on('message', function(message) {

  });
});

module.exports = app;

////////////////

function createSession(req) {
  req.session.user = {
    id: _.max(global.sessions, 'id'),
    position: {
      x: req.body.position.x,
      y: req.body.position.y
    }
  };

  global.sessions.push(req.session.user);
}
