module.exports = {
  model: function(sequelize) {
    return {
      longitude: {
        type: sequelize.constructor.DOUBLE,
        field: 'longitude'
      },
      latitude: {
        type: sequelize.constructor.DOUBLE,
        field: 'latitude'
      },
      name: {
        type: sequelize.constructor.STRING,
        field: 'name'
      }
    };
  },

  serialize: function(data) {
    return {
      coordinates: { latitude: data.latitude, longitude: data.longitude },
      name: data.name
    };
  }
};
