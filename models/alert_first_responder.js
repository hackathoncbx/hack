module.exports = {
  model: function(sequelize) {
    const Model = sequelize.define('alertFirstResponder', {}, {
      tableName: 'alertsFirstResponders'
    });

    return Model;
  }
};
