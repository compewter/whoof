var express = require('express');
var router = require('./router');

var app = express();


app.use( express.static(__dirname + '/../client/') );


app.listen( process.env.PORT || 1337 );

module.exports = app;
