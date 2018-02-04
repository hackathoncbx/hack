module.exports = function(sequelize, options) {
  return sequelize.models.help.bulkCreate([
    { category: 'Arrêt cardiaque' },
    { category: 'Noyade' },
    { category: 'Brulures' },
    { category: 'Membre cassé' }
  ], options);
};
