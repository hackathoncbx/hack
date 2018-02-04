const sequelize = require('./config/database');
const _each = require('lodash/each');

const data = require('require-all')(__dirname + '/models');

const models = {};

_each(data, function(modelValue, modelName) {
  models[modelName] = modelValue.model(sequelize);
});

_each(data, function(modelValue, modelName) {
  if (modelValue.relations) modelValue.relations.call(models[modelName], sequelize.models);
});

module.exports = sequelize;
