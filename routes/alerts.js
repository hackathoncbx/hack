const express = require('express');
const router = express.Router();

module.exports = (route, app) => {
  router.post('/', function(_req, res) {
    const token = _req.body.token;
    res.send(`Client token is: ${ token }`);
  });

  app.use(route, router);
};