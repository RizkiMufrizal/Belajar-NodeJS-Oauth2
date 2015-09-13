'use strict';

var User = require('../models/User');
var express = require('express');
var passport = require('passport');
var router = express.Router();

router.get('/user', passport.authenticate('accessToken', {
  session: false
}), function(req, res) {

  User.findPaginated({}, function(err, result) {
    if (err) return res.json(err);

    res.json(result);

  }, req.query.jumlah, req.query.page);

});

module.exports = router;
