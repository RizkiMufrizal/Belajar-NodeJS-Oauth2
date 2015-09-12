'use strict';

var oauth2orize = require('oauth2orize');
var passport = require('passport');
var crypto = require('crypto');
var bcrypt = require('bcrypt');
var Client = require('../models/Client');
var AccessToken = require('../models/AccessToken');
var uuid = require('./uuid');

var server = oauth2orize.createServer();

server.serializeClient(function(client, done) {
  return done(null, client.clientId);
});

server.deserializeClient(function(id, done) {
  Client.find({ //cek lagi
    clientId: id
  }, function(err, client) {
    if (err) return done(err);

    return done(null, client);
  });
});

//Implicit grant
server.grant(oauth2orize.grant.token(function(client, user, ares, done) {
  var token = uuid.uid(256);
  var tokenHash = crypto.createHash('sha1').update(token).digest('hex')
  var tokenExpired = new Date(new Date().getTime() + (3600 * 1000))

  var accessToken = new AccessToken({
    token: tokenHash,
    tokenExpired: tokenExpired,
    userId: user.username,
    clientId: client.clienId
  });

  accessToken.save(function(err) {
    if (err) return done(err)
    return done(null, token, {
      expires_in: tokenExpired.toISOString()
    });
  });
}));

// user authorization endpoint
exports.authorization = [
  function(req, res, next) {
    if (req.user) next();
    else res.redirect('/oauth/authorization');
  },
  server.authorization(function(clientId, redirectURI, done) {
    Client.findOne({
      clientId: clientId
    }, function(err, client) {
      if (err) return done(err)

      return done(null, client, redirectURI);
    })
  }),
  function(req, res) {
    res.render('decision', {
      transactionID: req.oauth2.transactionID,
      user: req.user,
      client: req.oauth2.client
    });
  }
];

// user decision endpoint
exports.decision = [
  function(req, res, next) {
    if (req.user) next();
    else res.redirect('/oauth/authorization');
  },
  server.decision()
];