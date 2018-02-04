module.exports = {
  relations: function(models) {
    this.hasMany(models.alertFirstResponder, { onDelete: 'CASCADE', hooks: true });
  },

  model: function(sequelize) {
    const Model = sequelize.define('alert', {
      taken: {
        type: sequelize.constructor.BOOLEAN,
        field: 'status'
      },
      category: {
        type: sequelize.constructor.STRING,
        field: 'category'
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