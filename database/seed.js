module.exports = function(sequelize, options) {
  const seeds = ['first_responder', 'defibrillators', 'help', 'helpstep', 'drug_stores_and_hospitals', 'user'];

  return seeds.reduce(function(cur, next) {
    return cur.then(function() {
      return require('./seeds/' + next)(sequelize, options);
    });
  }, Promise.resolve());
};
