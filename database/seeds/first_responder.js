module.exports = function(sequelize, options) {
  return sequelize.models.firstResponder.bulkCreate([
    { token: 'pew', x: 46.5555495, y: -72.7408941, phoneNumber: '555-555-5555' },
    { token: 'paw', x: 46.5174791, y: -72.7443578, phoneNumber: '555-555-5555' }
  ], options);
};
