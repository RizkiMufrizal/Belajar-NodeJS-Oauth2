'use strict';

var Client = require('../models/Client');
var uuid = require('../config/uuid');

exports.registerClient = function(req, res) {

  var name = req.body.name;
  var clientId = uuid.uid(8);
  var clientSecret = uuid.uid(20);

  var client = new Client({
    name: name,
    clientId: clientId,
    clientSecret: clientSecret
  });

  client.save(function(err) {
    res.send({
      name: name,
      clientId: clientId,
      clientSecret: clientSecret
    }, 201);
  });

}
