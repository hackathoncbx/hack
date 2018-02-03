module.exports = function(sequelize, options) {
  return sequelize.models.firstResponder.bulkCreate([
    { token: 'pew', x: 5, y: 6, phoneNumber: '555-555-5555' }
  ], options);
};
