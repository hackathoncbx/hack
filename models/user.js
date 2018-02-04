module.exports = {
  model: function(sequelize) {
    const Model = sequelize.define('user', {
      token: {
        type: sequelize.constructor.STRING,
        field: 'token'
      },
      firstName: {
        type: sequelize.constructor.STRING,
        field: 'firstName'
      },
      lastName: {
        type: sequelize.constructor.STRING,
        field: 'lastName'
      },
      bloodType: {
        type: sequelize.constructor.STRING,
        field: 'bloodType'
      },
      allergies: {
        type: sequelize.constructor.STRING,
        field: 'allergies'
      },
      sexe: {
        type: sequelize.constructor.STRING,
        field: 'sexe'
      },
      phoneNumber: {
        type: sequelize.constructor.STRING,
        field: 'phoneNumber'
      }
    });

    return Model;
  }
};