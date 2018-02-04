const _ = require('lodash');
const router = require('express').Router();
const distance = require('google-distance');
const nodemailer = require('nodemailer');

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
      pokeNearReponders(gen, data, ids, 0).then((number) => {
        if (!number) {
          getFirstResponders([], gen.next().value, data.x, data.y).then((responders) => {
            if (responders && responders.length) {
              sendSms(responders);
              _.each(responders, (responder) => {
                sendSms(responder.phoneNumber + responder.provider, 'stuff');
              });
            }
          });
        }
      });

      const token = req.body.token;
      res.send(`Client token is: ${ token }, alert id is : ${ alert.id }`);
    });
  });

  app.use(route, router);

  ////////////////

  function pokeNearReponders(distanceGenerator, data, ids, numberSent) {
    const generatedDistance = distanceGenerator.next();

    if (generatedDistance.done || !ids.length) return Promise.resolve(numberSent);

    return getFirstResponders(ids, generatedDistance.value, data.x, data.y).then((responders) => {
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
    yield 30;
    yield 40;
    yield 50;
  }

  function getFirstResponders(ids, maxDistance, x, y) {
    const query = ids.length ? { where: { id: ids } } : {};
    return sequelize.models.firstResponder.findAll(query).then((responders) => {
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
