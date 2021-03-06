'use strict';

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;
var ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var bcrypt = require('bcrypt');
var crypto = require('crypto');
var User = require('../models/User');
var Client = require('../models/Client');
var AccessToken = require('../models/AccessToken');

var algorithm = 'aes-256-ctr';
var password = 'administrator';
function decrypt(text) {
  var decipher = crypto.createDecipher(algorithm, password)
  var dec = decipher.update(text, 'hex', 'utf8')
  dec += decipher.final('utf8');
  return dec;
}

/**
* LocalStrategy
*/
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({
      username: username
    }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      bcrypt.compare(password, user.password, function(err, res) {
        if (!res) return done(null, false);
        return done(null, user);
      });
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.username);
})

passport.deserializeUser(function(id, done) {
  User.findOne({
    username: id
  }, function(err, user) {
    done(err, user);
  });
});

passport.use("clientBasic", new BasicStrategy(
  function(clientId, clientSecret, done) {
    Client.findOne({
      clientId: clientId
    }, function(err, client) {
      if (err) return done(err);
      if (!client) return done(null, false);

      if (client.clientSecret == clientSecret) return done(null, client);
      else return done(null, false);
    });
  }
));

passport.use("clientPassword", new ClientPasswordStrategy(
  function(clientId, clientSecret, done) {
    Client.findOne({
      clientId: clientId
    }, function(err, client) {
      if (err) return done(err);
      if (!client) return done(null, false);

      if (client.clientSecret == clientSecret) return done(null, client);
      else return done(null, false);
    });
  }
));

passport.use("accessToken", new BearerStrategy(
  function(accessToken, done) {
    var tokenDecrypt = decrypt(accessToken);
    AccessToken.findOne({
      token: tokenDecrypt
    }, function(err, token) {
      if (err) return done(err)
      if (!token) return done(null, false)
      if (new Date() > token.tokenExpired) {
        AccessToken.remove({
          token: accessTokenHash
        }, function(err) {
          done(err)
        })
      } else {
        User.findOne({
          username: token.userId
        }, function(err, user) {
          if (err) return done(err)
          if (!user) return done(null, false)
          // no use of scopes for no
          var info = {
            scope: '*'
          }
          done(null, user, info);
        });
      }
    });
  }
));
