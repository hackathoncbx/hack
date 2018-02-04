module.exports = function(sequelize, options) {
  const p1 = sequelize.models.help.findOne({ where: { category: 'Arrêt cardiaque' } }).then((help) => {
    return sequelize.models.helpstep.bulkCreate([
      { categoryId: help.id, step: 1, data: 'Victime allongée sur le dos, par terre, on se place à genoux auprès de la victime.' },
      { categoryId: help.id, step: 2, data: 'On place le talon d\'une main au centre de la poitrine, strictement sur la ligne médiane, jamais sur les côtés et l\'autre main au-dessus de la première et on appuie de 4 à 5 cm bras tendus, coudes non fléchis.' },
      { categoryId: help.id, step: 3, data: 'On relâche immédiatement la pression pour que la paroi remonte (décompression). La poitrine doit reprendre sa dimension initiale après chaque compression.' },
      { categoryId: help.id, step: 4, data: 'On réalise le geste 100 fois par minute selon le rythme de la chanson "Staying alive" des Bee Gees.' }
    ], options);
  });
  const p2 = sequelize.models.help.findOne({ where: { category: 'Brulures' } }).then((help) => {
    return sequelize.models.helpstep.bulkCreate([
      { categoryId: help.id, step: 1, data: 'Contrôler les fonctions respiratoires, hémodynamiques (la brûlure provoque une forte déshydratation) et neurologiques.' },
      { categoryId: help.id, step: 2, data: 'Si la brûlure est superficielle et peu étendue, enlever les vêtements immédiatement.' },
      { categoryId: help.id, step: 3, data: 'Refroidir la brûlure en plaçant la plaie 20 minutes sous une eau à 20 degrés et à 20 cm du robinet. Le débit doit être faible.' },
      { categoryId: help.id, step: 4, data: 'Protéger le brûlé des chocs thermiques. Une fois la brûlure refroidie, la personne doit être réchauffée' }
    ], options);
  });
  const p3 = sequelize.models.help.findOne({ where: { category: 'Noyade' } }).then((help) => {
    return sequelize.models.helpstep.bulkCreate([
      { categoryId: help.id, step: 1, data: 'Essayez de sortir la personne de l\'eau sans se mettre en danger.' },
      { categoryId: help.id, step: 2, data: 'Si la personne est en arrêt cardiorespiratoire, faites un massage cardiaque et un bouche-à-bouche (après avoir nettoyé ce qui peut l’obstruer). Avant le bouche-à-bouche, appuyez fortement sur l’abdomen du noyé, couché sur le dos, afin d’expulser hors des poumons l’eau qui pourrait s’y trouver. ' },
      { categoryId: help.id, step: 3, data: 'Si la personne est inconsciente, mais respire normalement, placez-la en position latérale de sécurité.' },
      { categoryId: help.id, step: 4, data: 'Recouvrez toujours un noyé afin de lutter contre l\'hypothermie.' }
    ], options);
  });
  const p4 = sequelize.models.help.findOne({ where: { category: 'Membre cassé' } }).then((help) => {
    return sequelize.models.helpstep.bulkCreate([
      { categoryId: help.id, step: 1, data: 'En cas d\'entorse, suivre le principe RGCE: ' },
      { categoryId: help.id, step: 2, data: 'Repos: Ne pas bouger le membre blessé.' },
      { categoryId: help.id, step: 3, data: 'Glace: Appliquer de la glace sur le membre.' },
      { categoryId: help.id, step: 4, data: 'Compression: Immobiliser le membre.' },
      { categoryId: help.id, step: 5, data: 'Élévation: Maintenir le membre en position surélevée.' }
    ], options);
  });
  return Promise.all([p1, p2, p3, p4]);
};
