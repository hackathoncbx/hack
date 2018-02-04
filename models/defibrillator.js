const localizable = require('./localizable');

module.exports = {
  model: function(sequelize) {
    const Model = sequelize.define('defibrillator', Object.assign({}, localizable.model(sequelize), {
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
    }));

    return Model;
  }
};
