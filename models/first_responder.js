module.exports = {
  model: function(sequelize) {
    const Model = sequelize.define('firstResponder', {
      token: {
        type: sequelize.constructor.STRING,
        field: 'token'
      },
      name: {
        type: sequelize.constructor.STRING,
        field: 'phoneNumber'
      },
      x: {
        type: sequelize.constructor.DECIMAL,
        field: 'x'
      },
      y: {
        type: sequelize.constructor.DECIMAL,
        field: 'y'
      }
    });

    return Model;
  }
};