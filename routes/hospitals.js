const localizable = require('../models/localizable');
const _map = require('lodash/map');
const router = require('express').Router();

module.exports = (route, app, sequelize) => {
  router.get('/', function(_req, res) {
    sequelize.models.hospital.findAll().then((hospotals) => {
      const data = _map(hospotals, (hospotal) => {
        return Object.assign({}, localizable.serialize(hospotal));
      });

      res.send(JSON.stringify(data));
    });
  });

  app.use(route, router);
};
