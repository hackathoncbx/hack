const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const sequelize = new Sequelize('hackathon', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  operatorsAliases: Op,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = sequelize;
