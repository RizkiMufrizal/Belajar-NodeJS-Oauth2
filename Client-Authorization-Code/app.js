var request = require('request');
var express = require('express');
var app = express();

var url = 'http://localhost:3000/oauth2/token';
var headers = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0',
  'Content-Type': 'application/x-www-form-urlencoded'
};
var form = {
  code: '7c40a23439b40ccd5690638f73068187cd6ab2f0',
  grant_type: 'authorization_code',
  redirect_uri: '1'
};

app.get('/', function(req, res) {
  request.post({
    url: url,
    form: form,
    headers: headers
  }, function(e, r, body) {
    res.send('Hello World!' + r + body);
  });
});

var server = app.listen(8080, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
