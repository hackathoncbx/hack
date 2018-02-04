const router = require('express').Router();

module.exports = (route, app, sequelize) => {
  router.get('/', function(_req, res) {
    sequelize.models.help.findAll({
      include: [
        { model: sequelize.models.helpstep, required: false }
      ]
    }).then((helps) => {
      res.send(JSON.stringify(helps));
    });
  });

  app.use(route, router);
};
