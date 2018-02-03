const express = require('express');
const router = express.Router();

module.exports = router;

module.exports = (route, app) => {
  router.get('/', function(_req, res) {
    const data = [{ id: 3 }, { id: 4 }];
    res.send(JSON.stringify(data));
  });

  app.use(route, router);
};
