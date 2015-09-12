'use strict';

var express = require('express');
var expressSession = require('express-session');
var http = require('http');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var auth = require('./config/auth');
var oauth2 = require('./config/oauth2');
var UserRoute = require('./routes/UserRoute');
var ClientRoute = require('./routes/ClientRoute');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(expressSession({
  resave: true,
  saveUninitialized: true,
  secret: 'uwotm8'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

mongoose.connect('mongodb://localhost/BelajarExpressJS', function(err, res) {
  if (err) {
    console.log('koneksi mongodb gagal bung', err);
  } else {
    console.log('koneksi mongodb berhasil bung');
  }
});

app.get('/client/registration', function(req, res) {
  res.render('ClientRegistration')
})
app.post('/client/registration', ClientRoute.registerClient)

app.get('/registration', function(req, res) {
  res.render('UserRegistration')
})
app.post('/registration', UserRoute.registerUser)

app.get('/oauth/authorization', function(req, res) {
  res.render('login', {
    clientId: req.query.clientId,
    redirectUri: req.query.redirectUri,
    responseType: req.query.responseType
  });
});
app.post('/oauth/authorization', passport.authenticate('local', {
  failureRedirect: '/oauth/authorization'
}), function(req, res) {
  res.redirect('/authorization?response_type=' + req.body.responseType + '&client_id=' + req.body.clientId + '&redirect_uri=' + req.body.redirectUri)
});

app.get('/authorization', oauth2.authorization);
app.post('/decision', oauth2.decision);

app.get('/restricted', passport.authenticate('accessToken', {
  session: false
}), function(req, res) {
  res.send("Yay, you successfully accessed the restricted resource!");
});

var server = http.createServer(app);
server.listen(app.get('port'), function() {
  console.log('Server jalan pada port ' + app.get('port'));
});