module.exports = {
    model: function(sequelize) {
        const Model = sequelize.define('help', {
            category: {
                type: sequelize.constructor.STRING,
                field: 'category'
            },
            data: {
                type: sequelize.constructor.STRING,
                field: 'data'
            }
        });

        return Model;
    }
};