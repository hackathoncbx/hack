const sequelize = require('./config/database');
const _ = require('lodash');

const data = require('require-all')(__dirname + '/models');

const models = {};

_.each(data, function(modelValue, modelName) {
  models[modelName] = modelValue.model(sequelize);
});

_.each(data, function(modelValue, modelName) {
  if (modelValue.relations) modelValue.relations.call(models[modelName], sequelize.models);
});

module.exports = sequelize;
