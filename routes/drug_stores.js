const localizable = require("../models/localizable");
const _map = require('lodash/map');
const router = require('express').Router();

module.exports = (route, app, sequelize) => {
  router.get('/', function(_req, res) {
    sequelize.models.drugStore.findAll().then((drugStores) => {
      const data = _map(drugStores, (drugStore) => {
        return Object.assign({}, localizable.serialize(drugStore));
      });

      res.send(JSON.stringify(data));
    });
  });

  app.use(route, router);
};
