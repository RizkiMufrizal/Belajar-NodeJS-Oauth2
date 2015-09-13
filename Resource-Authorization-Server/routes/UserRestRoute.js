'use strict';

var User = require('../models/User');
var express = require('express');
var passport = require('passport');
var router = express.Router();

router.get('/user', passport.authenticate('accessToken', {
  session: false
}), function(req, res) {

  User.find({}).skip((req.query.page - 1) * req.query.jumlah)
    .limit(req.query.jumlah)
    .exec(function(err, users) {
      if (err) return res.json(err);

      res.json(users);
    });

});

module.exports = router;
