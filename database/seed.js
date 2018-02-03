module.exports = function(sequelize, options) {
  const seeds = ["first_responder"];

  return seeds.reduce(function(cur, next) {
    return cur.then(function() {
      return require('./seeds/' + next)(sequelize, options);
    });
  }, Promise.resolve());
};
