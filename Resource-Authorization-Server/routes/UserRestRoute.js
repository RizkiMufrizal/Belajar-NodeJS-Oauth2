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

router.delete('/user/:id', function(req, res) {
  console.log(req.params.id);
  User.remove({
    _id: req.params.id
  }, function(err) {
    if (err) return res.send(err);

    return res.json({
      success: true,
      info: 'data dihapus'
    });
  })
});

module.exports = router;
