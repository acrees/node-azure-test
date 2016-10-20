var express = require('express');
var appInsights = require('applicationinsights');
appInsights.setup().start();

process.on('uncaughtException', function (err) {
  var cli = appInsights.getClient();
  cli.trackException(err);
  console.log('Fatal error; exiting');
  process.exit(1);
});

var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/sync', function (req, res) {
  throw new Error('Oops, a sync error!');
});

app.get('/async', function (req, res) {
  process.nextTick(function () {
    throw new Error('Oops, an async error!');
  });
});

app.use(function (err, req, res, next) {
  var cli = appInsights.getClient();
  cli.trackException(err);
  res.status(500);
  res.send('Oops, there was an error');
});

var port = process.env.PORT || 8080;
app.listen(port, function () {
  console.log('Listening on port ' + port);
});
