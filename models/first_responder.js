module.exports = {
  relations: function(models) {
    this.hasMany(models.alertFirstResponder, { onDelete: 'CASCADE', hooks: true });
  },

  model: function(sequelize) {
    const Model = sequelize.define('firstResponder', {
      token: {
        type: sequelize.constructor.STRING,
        field: 'token'
      },
      phoneNumber: {
        type: sequelize.constructor.STRING,
        field: 'phoneNumber'
      },
      latitude: {
        type: sequelize.constructor.DOUBLE,
        field: 'latitude'
      },
      longitude: {
        type: sequelize.constructor.DOUBLE,
        field: 'longitude'
      }
    });

    return Model;
  }
};