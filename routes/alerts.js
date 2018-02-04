const _ = require('lodash');
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

      const ids = _.map(Object.keys(global.sockets), _.parseInt);
      pokeNearReponders(gen, data, ids);

      const token = req.body.token;
      res.send(`Client token is: ${ token }, alert id is : ${ alert.id }`);
    });
  });

  app.use(route, router);

  ////////////////

  function pokeNearReponders(distanceGenerator, data, ids) {
    const generatedDistance = distanceGenerator.next();

    if (generatedDistance.done || !ids.length) return [];

    return getFirstResponders(ids, generatedDistance.value, data.x, data.y).then((responders) => {
      if (responders && responders.length) {
        return responders;
      } else {
        return pokeNearReponders(distanceGenerator, data, ids);
      }
    }).then((responders) => {
      return send(responders, data);
    }).then((responders) => {
      setTimeout(() => {
        const diffIds = _.difference(ids, _.map(responders, (responder) => { return responder.id; }));
        sequelize.models.alert.findOne({ where: { id: data.alertId } }).then((alert) => {
          if (!alert.taken) pokeNearReponders(distanceGenerator, data, diffIds);
        });
      }, 1000 * 10);
    });
  }

  function* radiusGenerator() {
    yield 10;
    yield 15;
    yield 20;
    yield 30;
    yield 40;
    yield 50;
  }

  function getFirstResponders(ids, maxDistance, x, y) {
    return sequelize.models.firstResponder.findAll({ where: { id: ids } }).then((responders) => {
      const usersArray = [];
      const promises = [];
      _.each(responders, (responder) => {
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

  function send(responders, data) {
    const alertFirstResponders = _.map(responders, function(responder) {
      return { alertId: data.alertId, firstResponderId: responder.id };
    });

    return sequelize.models.alertFirstResponder.bulkCreate(alertFirstResponders).then(() => {
      _.each(responders, (responder) => {
        global.sockets[responder.id].send(JSON.stringify({ type: 'newAlert', data: data }));
      });

      return responders;
    });
  }
};
