const _ = require('lodash');
const router = require('express').Router();
const distance = require('google-distance');
const nodemailer = require('nodemailer');

module.exports = (route, app, sequelize) => {
  router.put('/:id', (req, res) => {
    sequelize.models.alert.update({
      category: req.body.category
    }, {
      where: { id: req.params.id }
    }).then(() => {
      return sequelize.models.alert.findOne({ where: { id: req.params.id } });
    }).then((alert) => {
      const data = { type: 'alertUpdated', data: { id: alert.id, category: alert.category } };

      if (alert.firstResponderId) {
        const socket = global.sockets[alert.firstResponderId];
        if (socket) socket.send(JSON.stringify(data));
      } else {
        sequelize.models.alertFirstResponder.findAll({ where: { alertId: alert.id } }).then((alertsFirstResponders) => {
          _.each(alertsFirstResponders, (alertFirstResponder) => {
            const socket = global.sockets[alertFirstResponder.firstResponderId];
            if (socket) socket.send(JSON.stringify(data));
          });
        });
      }

      res.json({});
    });
  });

  router.post('/', function(req, res) {
    req.body.position = req.body.position || {};
    const latitude = req.body.position.latitude;
    const longitude = req.body.position.longitude;
    const token = req.body.token;

    sequelize.models.alert.create({ token: token, latitude: latitude, longitude: longitude }).then((alert) => {
      const data = {
        longitude: longitude,
        latitude: latitude,
        alertId: alert.id
      };

      const gen = radiusGenerator();

      const ids = _.map(Object.keys(global.sockets), _.parseInt);
      pokeNearReponders(gen, data, ids, 0).then((number) => {
        if (!number) {
          // getFirstResponders([], gen.next().value, data.x, data.y).then((responders) => {
          //   if (responders && responders.length) {
          //     _.each(responders, (responder) => {
          //       sendSms(responder.phoneNumber + responder.provider, 'stuff');
          //     });
          //   }
          // });
        }
      });

      res.json({ token: token, id: alert.id });
    });
  });

  app.use(route, router);

  ////////////////

  function pokeNearReponders(distanceGenerator, data, ids, numberSent) {
    const generatedDistance = distanceGenerator.next();

    if (generatedDistance.done || !ids.length) return Promise.resolve(numberSent);

    return getFirstResponders(ids, generatedDistance.value, data.latitude, data.longitude).then((responders) => {
      if (responders && responders.length) {
        return responders;
      } else {
        return pokeNearReponders(distanceGenerator, data, ids, numberSent);
      }
    }).then((responders) => {
      return send(responders, data);
    }).then((responders) => {
      return new Promise(function(resolve) {
        setTimeout(() => {
          const diffIds = _.difference(ids, _.map(responders, (responder) => { return responder.id; }));
          sequelize.models.alert.findOne({ where: { id: data.alertId } }).then((alert) => {
            if (!alert.taken) {
              pokeNearReponders(distanceGenerator, data, diffIds, numberSent + responders.length).then((number) => {
                resolve(number);
              });
            }
          });
        }, 1000 * 10);
      });
    });
  }

  function* radiusGenerator() {
    yield 10;
    yield 15;
    yield 20;
  }

  function getFirstResponders(ids, maxDistance, latitude, longitude) {
    const query = ids.length ? { where: { id: ids } } : {};
    return sequelize.models.firstResponder.findAll(query).then((responders) => {
      const usersArray = [];
      const promises = [];
      _.each(responders, (responder) => {
        const promise = new Promise(function(resolve, reject) {
          distance.get({
            origin: `${latitude}, ${longitude}`,
            destination: `${responder.latitude}, ${responder.longitude}`
          }, (error, data) => {
            console.log('1 :: ', error);
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
      }).catch((error) => {
        console.log('2 :: ', error);
      });
    }).catch((error) => {
      console.log('3 :: ', error);
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

  function sendSms(sendTo, message) {
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
};
