module.exports = {
  model: function(sequelize) {
    const Model = sequelize.define('alert', {
      taken: {
        type: sequelize.constructor.BOOLEAN,
        field: 'status'
      }
    });

    return Model;
  }
};