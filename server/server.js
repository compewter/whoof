var express = require('express');

var clientApp = express();
clientApp.use( express.static(__dirname + '/../client/clientApp') );
clientApp.listen( process.env.PORT || 8080 );


//It seems odd to me that we have our admin pages available from the internet. 
//The admin app will be available on a different port.
var adminApp = express();
adminApp.use( express.static(__dirname + '/../client/adminApp/') );
adminApp.listen( 1337 );


module.exports.clientApp = clientApp;
module.exports.adminApp  = adminApp;
