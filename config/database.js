const Sequelize = require('sequelize');
const Op = Sequelize.Op;

let env;
try { env = require('../.env.json'); } catch (e) { env = {}; }

const sequelize = new Sequelize(env.database || 'hackathon', env.user || 'root', env.password || '', {
  host: env.host || 'localhost',
  dialect: 'mysql',
  operatorsAliases: Op,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
    port: env.port || 3306
  }
});

module.exports = sequelize;
