const sequelize = require('./init_database');

sequelize.query('SET FOREIGN_KEY_CHECKS = 0').then(function() {
  console.log('Structure...');
  return sequelize.sync({ force: true });
}).then(function() {
  console.log('Seed...');
  require('./database/seed')(sequelize).then(function() {
    console.log('Done');
    process.exit();
  });
});