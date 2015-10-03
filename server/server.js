var express = require('express');
var http = require('http');
var clientApp = express();
var adminApp = express();

var clientServer = http.createServer(clientApp);
var ioClient = require('socket.io').listen(clientServer); 
var socketInstructions = require('./sockets');

clientApp.use( express.static(__dirname + '/../client/clientApp') );
clientServer.listen( process.env.PORT || 8080 );

ioClient.on('connection', socketInstructions.connection);

//It seems odd to me that we have our admin pages available from the internet. 
//The admin app will be available on a different port.
adminApp.use( express.static(__dirname + '/../client/adminApp/') );
adminApp.listen( 1337 );

module.exports.clientApp = clientApp;
module.exports.adminApp  = adminApp;
