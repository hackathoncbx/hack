module.exports = {
  relations: function(models) {
    this.belongsTo(models.help);
  },

  model: function(sequelize) {
    const Model = sequelize.define('helpstep', {
      categoryId: {
        type: sequelize.constructor.INTEGER,
        field: 'categoryId'
      },
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