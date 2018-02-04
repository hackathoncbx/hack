const _map = require('lodash/map');
const path = require('path');
const defibrillatorsPath = path.join(__dirname, "defibrillators.geojson");
const defibrillators = JSON.parse(require('fs').readFileSync(defibrillatorsPath, 'utf8'));

module.exports = function(sequelize, options) {
  return sequelize.models.defibrillator.bulkCreate(_map(defibrillators.features, (defibrillator) => {
    return {
      long: defibrillator.geometry.coordinates[0],
      lat: defibrillator.geometry.coordinates[1],
      building: defibrillator.properties.building,
      model: defibrillator.properties.model,
      source: defibrillator.properties.source,
      address: defibrillator.properties.address
    };
  }), options);
};
