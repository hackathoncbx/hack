const _each = require('lodash/each');
const router = require('express').Router();

module.exports = (route, app, sequelize) => {
  router.post('/', function(req, res) {
    const data = JSON.stringify({
      x: req.body.position.x,
      y: req.body.position.y
    });

    const ids = Object.keys(global.sockets);

    sequelize.models.firstResponder.findAll({ where: { id: ids } }).then((responders) => {
      _each(responders, (responder) => {
        global.sockets[responder.id].send(data);
      });

      const token = req.body.token;
      res.send(`Client token is: ${ token }`);
    });
  });

  app.use(route, router);
};
