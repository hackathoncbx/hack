module.exports = function(sequelize, options) {
  return sequelize.models.helpsteps.bulkCreate([
    { category: 'Arrêt cardiaque', step: 1, data: '- Victime allongée sur le dos, par terre, on se place à genoux auprès de la victime.' },
    { category: 'Arrêt cardiaque', step: 2, data: '- On place le talon d\'une main au centre de la poitrine, strictement sur la ligne médiane, jamais sur les côtés et l\'autre main au-dessus de la première et on appuie de 4 à 5 cm bras tendus, coudes non fléchis.' },
    { category: 'Arrêt cardiaque', step: 3, data: '- On relâche immédiatement la pression pour que la paroi remonte (décompression). La poitrine doit reprendre sa dimension initiale après chaque compression.' },
    { category: 'Arrêt cardiaque', step: 4, data: '- On réalise le geste 100 fois par minute selon le rythme de la chanson "Staying alive" des Bee Gees.' },
  ], options);
};
