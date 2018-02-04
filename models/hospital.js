const localizable = require('./localizable');

module.exports = {
  model: function(sequelize) {
    const Model = sequelize.define('hospital', Object.assign({}, localizable.model(sequelize)));

    return Model;
  }
};
