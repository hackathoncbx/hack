const _map = require('lodash/map');
const _filter = require('lodash/filter');
const path = require('path');
const pointsOfInteretsPath = path.join(__dirname, 'points_of_interets_4326.geojson');
const pointsOfInterets = JSON.parse(require('fs').readFileSync(pointsOfInteretsPath, 'utf8'));

module.exports = function(sequelize, options) {
  const drugStores = _filter(pointsOfInterets.features, (r) => { return r.properties.fclass == 'pharmacy'; });
  const hospitals = _filter(pointsOfInterets.features, (r) => { return r.properties.fclass == 'hospital'; });

  return sequelize.models.drugStore.bulkCreate(_map(drugStores, (drugStore) => {
    return {
      longitude: drugStore.geometry.coordinates[0],
      latitude: drugStore.geometry.coordinates[1],
      name: drugStore.properties.name
    };
  }), options).then(() => {
    return sequelize.models.hospital.bulkCreate(_map(hospitals, (hospital) => {
      return {
        longitude: hospital.geometry.coordinates[0],
        latitude: hospital.geometry.coordinates[1],
        name: hospital.properties.name
      };
    }), options);
  });
};
