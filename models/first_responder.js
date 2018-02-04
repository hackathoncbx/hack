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
        type: sequelize.constructor.DOUBLE,
        field: 'x'
      },
      y: {
        type: sequelize.constructor.DOUBLE,
        field: 'y'
      }
    });

    return Model;
  }
};