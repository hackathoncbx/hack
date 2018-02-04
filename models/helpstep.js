module.exports = {
  relations: function(models) {
    this.belongsTo(models.help);
  },

  model: function(sequelize) {
    const Model = sequelize.define('helpstep', {
      step: {
        type: sequelize.constructor.INTEGER,
        field: 'step'
      },
      data: {
        type: sequelize.constructor.STRING(500),
        field: 'data'
      }
    });
    return Model;
  }
};