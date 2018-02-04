module.exports = {
  model: function(sequelize) {
    const Model = sequelize.define('helpsteps', {
      category: {
        type: sequelize.constructor.STRING,
        field: 'category'
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