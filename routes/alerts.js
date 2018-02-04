const _each = require('lodash/each');
const router = require('express').Router();
const distance = require('google-distance');

module.exports = (route, app, sequelize) => {
  router.post('/', function(req, res) {
    sequelize.models.alert.create().then((alert) => {
      const data = {
        x: req.body.position.x,
        y: req.body.position.y,
        alertId: alert.id
      };

      const gen = radiusGenerator();

      pokeNearReponders(gen, data);

      const token = req.body.token;
      res.send(`Client token is: ${ token }`);
    });
  });

  app.use(route, router);

  ////////////////

  function pokeNearReponders(distanceGenerator, data) {
    const ids = Object.keys(global.sockets);

    const generatedDistance = distanceGenerator.next();

    if (generatedDistance.done) return [];

    return getFirstResponders(ids, generatedDistance.value, data.x, data.y).then((responders) => {
      if (responders && responders.length) {
        setTimeout(() => {
          sequelize.models.alert.findOne({ where: { id: data.alertId } }).then((alert) => {
            if (!alert.resolved) pokeNearReponders(distanceGenerator, data);
          });
        }, 1000 * 20);
        return responders;
      } else {
        return pokeNearReponders(distanceGenerator, data);
      }
    }).then((responders) => {
      _each(responders, (responder) => {
        global.sockets[responder.id].send(JSON.stringify(data));
      });
    });
  }

  function* radiusGenerator() {
    yield 10;
    yield 15;
    yield 20;
  }

  function getFirstResponders(ids, maxDistance, x, y) {
    return sequelize.models.firstResponder.findAll({ where: { id: ids } }).then((responders) => {
      const usersArray = [];
      const promises = [];
      _each(responders, (responder) => {
        const promise = new Promise(function(resolve, reject) {
          distance.get({
            origin: `${x}, ${y}`,
            destination: `${responder.x}, ${responder.y}`
          }, (error, data) => {
            if (error) return reject();
            const distanceToPoint = data.distance.substring(0, data.distance.length - 3);
            if (distanceToPoint < maxDistance) {
              usersArray.push(responder);
            }

            resolve();
          });
        });

        promises.push(promise);
      });

      return Promise.all(promises).then(() => {
        return usersArray;
      });
    });
  }
};
