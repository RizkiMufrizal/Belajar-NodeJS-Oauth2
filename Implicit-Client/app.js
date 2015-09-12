'use strict';

'use strict';

var express = require('express');
var expressSession = require('express-session');
var http = require('http');
var bodyParser = require('body-parser');
var path = require('path');
var expressPartials = require('express-partials');
var favicon = require('serve-favicon');

var app = express();

app.set('port', process.env.PORT || 3001);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(__dirname + '/public/imgs/favicon.ico'));
app.use(expressPartials());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(expressSession({
  resave: true,
  saveUninitialized: true,
  secret: 'uwotm8'
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

app.get('/', function(req, res) {
  res.send('Hello World!');
});

var server = http.createServer(app);
server.listen(app.get('port'), function() {
  console.log('Server jalan pada port ' + app.get('port'));
});
