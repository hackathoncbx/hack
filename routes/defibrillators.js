const _map = require('lodash/map');
const router = require('express').Router();

module.exports = (route, app, sequelize) => {
  router.get('/', function(_req, res) {
    sequelize.models.defibrillator.findAll().then((defibrillators) => {
      const data = _map(defibrillators, (defibrillator) => {
        defibrillator.coordinates = [defibrillator.long, defibrillator.lat];
        return {
          coordinates: [defibrillator.long, defibrillator.lat],
          building: defibrillator.building,
          model: defibrillator.model,
          source: defibrillator.source,
          address: defibrillator.address
        };
      });

      res.send(JSON.stringify(data));
    });
  });

  app.use(route, router);
};
