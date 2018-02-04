const _each = require('lodash/each');
const router = require('express').Router();

module.exports = (route, app, sequelize) => {
  router.post('/', function(req, res) {
    const data = JSON.stringify({
      x: req.body.position.x,
      y: req.body.position.y
    });

    const gen = radiusGenerator();

    pokeNearReponders(gen, data);

    const token = req.body.token;
    res.send(`Client token is: ${ token }`);
  });

  app.use(route, router);

  ////////////////

  function pokeNearReponders(distanceGenerator, data) {
    const ids = Object.keys(global.sockets);

    const generatedDistance = distanceGenerator.next();

    if (generatedDistance.done) return [];

    return sequelize.models.firstResponder.findAll({ where: { id: ids } }).then((responders) => {
      if (responders && responders.length) {
        setTimeout(() => {
          pokeNearReponders(distanceGenerator, data);
        }, 1000 * 20);
        return responders;
      } else {
        return pokeNearReponders(distanceGenerator, data);
      }
    }).then((responders) => {
      _each(responders, (responder) => {
        global.sockets[responder.id].send(data);
      });
    });
  }

  function* radiusGenerator() {
    yield 10;
    yield 15;
    yield 20;
  }
};
