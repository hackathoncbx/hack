module.exports = {
  relations: function(models) {
    this.hasMany(models.helpstep, { onDelete: 'CASCADE', hooks: true });
  },

  model: function(sequelize) {
    const Model = sequelize.define('help', {
      category: {
        type: sequelize.constructor.STRING,
        field: 'category'
      }
    });

    return Model;
  }
};