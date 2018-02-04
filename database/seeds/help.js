module.exports = function(sequelize, options) {
    return sequelize.models.help.bulkCreate([
        { category: 'Arrêt Cardiaque', data: `- Victime allongée sur le dos, par terre, on se place à genoux auprès de la victime.
- On place le talon d'une main au centre de la poitrine, strictement sur la ligne médiane, jamais sur les côtés et l'autre main au-dessus de la première et on appuie de 4 à 5 cm bras tendus, coudes non fléchis.
- On relâche immédiatement la pression pour que la paroi remonte (décompression). La poitrine doit reprendre sa dimension initiale après chaque compression.
- On réalise le geste 100 fois par minute selon le rythme de la chanson "Staying alive" des Bee Gees.` },
        { category: '', data: '' },
        { category: '', data: '' },
        { category: '', data: '' },
        { category: '', data: '' },
        { category: '', data: '' }
    ], options);
};
