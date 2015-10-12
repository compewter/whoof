var http = require('http');

var express = require('express');
var clientApp = express();
var adminApp = express();


var clientServer = http.createServer(clientApp);
var ioClient = require('./clientApp/sockets').listen(clientServer);

clientApp.use( express.static(__dirname + '/../client/clientApp') );
clientServer.listen( process.env.PORT || 8080 );


//It seems odd to me that we generally have our admin pages available from the internet. 
//Thus, the admin app will be available on a different port.
var adminServer = http.createServer(adminApp);
var ioAdmin = require('./adminApp/sockets').listen(adminServer);

adminApp.use( express.static(__dirname + '/../client/adminApp/') );
adminApp.use( express.static(__dirname + '/../bower_components/') );
adminServer.listen( 1337 );


module.exports.clientApp = clientApp;
module.exports.ioClient = ioClient;
module.exports.adminApp  = adminApp;
