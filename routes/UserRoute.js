'use strict';

var bcrypt = require('bcrypt');
var User = require('../models/User');

exports.registerUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  bcrypt.hash(password, 11, function(err, hash) {

    if (err) return res.send(err);

    var user = new User({
      username: username,
      password: hash
    });

    user.save(function(err, user) {
      if (err) res.send(err);

      res.send(user);
    })

  });

}
