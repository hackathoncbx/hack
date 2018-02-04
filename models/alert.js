module.exports = {
  model: function(sequelize) {
    const Model = sequelize.define('alert', {
      resolved: {
        type: sequelize.constructor.BOOLEAN,
        field: 'status'
      }
    });

    return Model;
  }
};