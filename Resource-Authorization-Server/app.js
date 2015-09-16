'use strict';

var express = require('express');
var expressSession = require('express-session');
var http = require('http');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var cors = require('cors');
var csrf = require('csurf');
var expressPartials = require('express-partials');
var favicon = require('serve-favicon');
var auth = require('./config/auth');
var oauth2 = require('./config/oauth2');
var UserRoute = require('./routes/UserRoute');
var ClientRoute = require('./routes/ClientRoute');
var UserRestRoute = require('./routes/UserRestRoute');

var app = express();
var csrfProtection = csrf({
  cookie: true
});

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(__dirname + '/public/imgs/favicon.ico'));
app.use(expressPartials());
app.use(cors());
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

mongoose.connect('mongodb://localhost/BelajarOAuth2', function(err, res) {
  if (err) {
    console.log('koneksi mongodb gagal bung', err);
  } else {
    console.log('koneksi mongodb berhasil bung');
  }
});

app.post('/oauth/authorization', passport.authenticate('local', {
  failureRedirect: '/oauth/authorization'
}), function(req, res) {
  res.redirect('/authorization?response_type=' + req.body.responseType + '&client_id=' + req.body.clientId + '&redirect_uri=' + req.body.redirectUri)
});

app.post('/oauth2/token', oauth2.token);

app.get('/authorization', oauth2.authorization);
app.post('/decision', oauth2.decision);

app.get('/restricted', passport.authenticate('accessToken', {
  session: false
}), function(req, res) {
  res.send("Yay, you successfully accessed the restricted resource!");
});

app.use('/api', UserRestRoute);

app.use(csrfProtection)

app.get('/client/registration', csrfProtection, function(req, res) {
  res.render('ClientRegistration', {
    csrfToken: req.csrfToken()
  });
})
app.post('/client/registration', ClientRoute.registerClient)

app.get('/registration', csrfProtection, function(req, res) {
  res.render('UserRegistration', {
    csrfToken: req.csrfToken()
  });
})
app.post('/registration', UserRoute.registerUser)

app.get('/oauth/authorization', csrfProtection, function(req, res) {
  res.render('login', {
    clientId: req.query.clientId,
    redirectUri: req.query.redirectUri,
    responseType: req.query.responseType,
    csrfToken: req.csrfToken()
  });
});

app.use(function(err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err)

  // handle CSRF token errors here
  res.status(403)
  res.send('form tampered with')
})

var server = http.createServer(app);
server.listen(app.get('port'), function() {
  console.log('Server jalan pada port ' + app.get('port'));
});
