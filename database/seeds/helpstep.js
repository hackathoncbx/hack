module.exports = function(sequelize, options) {
  return sequelize.models.help.findOne({ where: { category: 'Arrêt cardiaque' } }).then((help) => {
    return sequelize.models.helpstep.bulkCreate([
      { categoryId: help.id, step: 1, data: 'Victime allongée sur le dos, par terre, on se place à genoux auprès de la victime.' },
      { categoryId: help.id, step: 2, data: 'On place le talon d\'une main au centre de la poitrine, strictement sur la ligne médiane, jamais sur les côtés et l\'autre main au-dessus de la première et on appuie de 4 à 5 cm bras tendus, coudes non fléchis.' },
      { categoryId: help.id, step: 3, data: 'On relâche immédiatement la pression pour que la paroi remonte (décompression). La poitrine doit reprendre sa dimension initiale après chaque compression.' },
      { categoryId: help.id, step: 4, data: 'On réalise le geste 100 fois par minute selon le rythme de la chanson "Staying alive" des Bee Gees.' },
    ], options);
  });
};
