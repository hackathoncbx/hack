module.exports = {
  model: function(sequelize) {
    const Model = sequelize.define('defibrillator', {
      long: {
        type: sequelize.constructor.DECIMAL,
        field: 'longitude'
      },
      lat: {
        type: sequelize.constructor.DECIMAL,
        field: 'lat'
      },
      building: {
        type: sequelize.constructor.STRING,
        field: 'building'
      },
      model: {
        type: sequelize.constructor.STRING,
        field: 'model'
      },
      source: {
        type: sequelize.constructor.STRING,
        field: 'source'
      },
      address: {
        type: sequelize.constructor.STRING,
        field: 'address'
      }
    });

    return Model;
  }
};
