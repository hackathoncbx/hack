module.exports = function(sequelize, options) {
  return sequelize.models.user.bulkCreate([
    { token: 'pew' },
    { token: 'paw' },
    { token: 'mew' },
    { token: 'maw' }
  ], options);
};
