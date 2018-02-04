const _map = require('lodash/map');
const path = require('path');
const defibrillatorsPath = path.join(__dirname, "defibrillators.geojson");
const defibrillators = JSON.parse(require('fs').readFileSync(defibrillatorsPath, 'utf8'));

module.exports = function(sequelize, options) {
  return sequelize.models.defibrillator.bulkCreate(_map(defibrillators.features, (defibrillator) => {
    return {
      longitude: defibrillator.geometry.coordinates[0],
      latitude: defibrillator.geometry.coordinates[1],
      name: defibrillator.properties.name,
      model: defibrillator.properties.model,
      source: defibrillator.properties.source,
      address: defibrillator.properties.address
    };
  }), options);
};
