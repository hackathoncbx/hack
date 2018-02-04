module.exports = function(sequelize, options) {
  return sequelize.models.help.bulkCreate([
    { id: 1, category: 'Arrêt cardiaque' },
    { id: 2, category: 'Noyade' },
    { id: 3, category: 'Brulures' },
    { id: 4, category: 'Membre cassé' }
  ], options);
};
