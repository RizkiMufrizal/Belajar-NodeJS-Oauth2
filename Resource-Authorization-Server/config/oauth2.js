'use strict';

var oauth2orize = require('oauth2orize');
var passport = require('passport');
var crypto = require('crypto');
var bcrypt = require('bcrypt');
var _ = require('underscore')._;
var Client = require('../models/Client');
var AccessToken = require('../models/AccessToken');
var AuthCode = require('../models/AuthCode');
var uuid = require('./uuid');

var server = oauth2orize.createServer();
var algorithm = 'aes-256-ctr';
var password = 'administrator';

function encrypt(text) {
  var cipher = crypto.createCipher(algorithm, password)
  var crypted = cipher.update(text, 'utf8', 'hex')
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(text) {
  var decipher = crypto.createDecipher(algorithm, password)
  var dec = decipher.update(text, 'hex', 'utf8')
  dec += decipher.final('utf8');
  return dec;
}

server.serializeClient(function(client, done) {
  return done(null, client.clientId);
});

server.deserializeClient(function(id, done) {
  Client.find({
    clientId: id
  }, function(err, client) {
    if (err) return done(err);

    return done(null, client);
  });
});

//Implicit grant
server.grant(oauth2orize.grant.token(function(client, user, ares, done) {

  var token = uuid.uid(256);
  var tokenHash = encrypt(token);
  var tokenExpired = new Date(new Date().getTime() + (3600 * 1000));

  var clientId = {};

  _.each(client, function(c) {
    clientId = c.clientId;
  });

  AccessToken.findOne({
    clientId: clientId
  }, function(err, accessToken) {
    if (err) return done(err);

    if (accessToken) {
      accessToken.token = token;
      accessToken.tokenExpired = tokenExpired;
      accessToken.save();

      return done(null, token, {
        expires_in: tokenExpired.toISOString(),
        access_token: tokenHash
      });

    } else {

      console.log(clientId);

      var accessToken = new AccessToken({
        token: token,
        tokenExpired: tokenExpired,
        userId: user.username,
        clientId: clientId
      });

      accessToken.save(function(err) {
        if (err) return done(err)
        return done(null, token, {
          expires_in: tokenExpired.toISOString(),
          access_token: tokenHash
        });
      });
    }
  });

}));

//authorization code
server.grant(oauth2orize.grant.code(function(client, redirectUri, user, ares, done) {

  var code = uuid.uid(20);
  var codeHash = encrypt(code);
  var clientId = {};

  _.each(client, function(c) {
    clientId = c.clientId;
  });

  var authCode = new AuthCode({
    code: code,
    userId: user.username,
    clientId: clientId
  });

  authCode.save(function(err) {
    if (err) return done(err);
    return done(null, codeHash);
  });

}));

//get access token for authorization code
server.exchange(oauth2orize.exchange.code(function(client, code, redirectUri, done) {

  var codeDecrypt = decrypt(code);

  AuthCode.findOne({
    code: codeDecrypt
  }, function(err, authCode) {
    if (authCode) {

      console.log('berhasil');

      var token = uuid.uid(256);
      var tokenHash = encrypt(token);

      var refreshToken = uuid.uid(256);
      var refreshTokenHash = encrypt(refreshToken);

      var tokenExpired = new Date(new Date().getTime() + (3600 * 1000));

      console.log(authCode.clientId);

      AccessToken.findOne({
        clientId: authCode.clientId
      }, function(err, accessToken) {
        if (err) return done(err);

        var accessToken = new AccessToken({
          token: token,
          refreshToken: refreshToken,
          tokenExpired: tokenExpired,
          userId: authCode.userId,
          clientId: authCode.clientId
        });

        accessToken.save(function(err, accessToken) {
          if (err) return done(err)
          done(null, tokenHash, refreshTokenHash, authCode.userId);
        });

      });
    }
  });
}));

exports.token = [
  server.token(),
  server.errorHandler()
];

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
