module.exports = function(sequelize, options) {
    return sequelize.models.help.bulkCreate([
        { category: '', data: '' },
        { category: '', data: '' },
        { category: '', data: '' },
        { category: '', data: '' },
        { category: '', data: '' },
        { category: '', data: '' }
    ], options);
};
