const _ = require('lodash');
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
require('express-ws')(app);

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
    require('./routes/warnings')('/warnings', app, sequelize);
  });

app.ws('/', function(ws, req) {
  createSession(req, ws);
});

app.listen(3000);

module.exports = app;

////////////////

function createSession(req, socket) {
  req.session.user = {
    id: _.max(global.sessions, 'id'),
    position: {
      x: req.query.x,
      y: req.query.y
    },
    socket: socket
  };

  global.sessions.push(req.session);

  req.session.save();
}
