const router = require('express').Router();

module.exports = (route, app, sequelize) => {
  router.get('/', function(_req, res) {
    const data = [{ id: 3 }, { id: 4 }];
    res.send(JSON.stringify(data));
  });

  router.get('/:token', (req, res) => {
    sequelize.models.user.findOne({ where: { token: req.params.token } }).then((user) => {
      res.json(user);
    });
  });

  router.post('/:token', (req, res) => {
    sequelize.models.user.create({
      token: req.params.token,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      bloodType: req.body.bloodType,
      allergies: req.body.allergies,
      sexe: req.body.sexe,
      phoneNumber: req.body.phoneNumber
    }).then(() => {
      res.send();
    });
  });

  router.put('/:token', (req, res) => {
    sequelize.models.user.update(req.body, {
      where: { token: req.params.token }
    }).then(() => {
      res.send();
    });
  });

  app.use(route, router);
};
