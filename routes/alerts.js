const _ = require('lodash');
const express = require('express');
const router = express.Router();

module.exports = (route, app, sequelize) => {
  router.post('/', function(req, res) {
    const data = JSON.stringify({
      x: req.body.position.x,
      y: req.body.position.y
    });

    sequelize.models.firstResponder.findAll().then((responders) => {
      _.each(responders, (responder) => {
        global.sockets[responder.id] && global.sockets[responder.id].send(data);
      });

      const token = req.body.token;
      res.send(`Client token is: ${ token }`);
    });
  });

  app.use(route, router);
};
