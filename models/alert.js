module.exports = {
  relations: function(models) {
    this.hasMany(models.alertFirstResponder, { onDelete: 'CASCADE', hooks: true });
  },

  model: function(sequelize) {
    const Model = sequelize.define('alert', {
      taken: {
        type: sequelize.constructor.BOOLEAN,
        field: 'status'
      }
    });

    return Model;
  }
};