module.exports = {
  model: function(sequelize) {
    const Model = sequelize.define('firstResponder', {
      name: {
        type: sequelize.constructor.STRING,
        field: 'phoneNumber'
      },
      maxLifePoint: {
        type: sequelize.constructor.DECIMAL,
        field: 'x'
      },
      capacity: {
        type: sequelize.constructor.DECIMAL,
        field: 'y'
      }
    });

    return Model;
  }
};