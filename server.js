const http          = require('http'),
      socketio      = require('socket.io'),
      express       = require('express'),
      victimSession = require("express-session")({
        secret: "my-secret",
        resave: true,
        saveUninitialized: true
      }),
      victimIoSession = require("express-socket.io-session")


/*
  Configure Victim Sockets
*/
const victimApp     = express(),
      victimServer  = http.createServer(victimApp),
      ioVictim      = socketio.listen(victimServer)

ioVictim.use(victimIoSession(victimSession))
require('./routes/victim/sockets').configure(ioVictim)

process.env.VICTIM_PORT = process.env.VICTIM_PORT || 8080
victimApp.use(victimSession)
victimApp.use(express.static(__dirname + '/public'))
victimServer.listen( process.env.VICTIM_PORT)
console.log(`Victim socket server listening on :${process.env.VICTIM_PORT}`)



/*
  Configure Admin Sockets
*/
const adminApp = express(),
      adminServer = http.createServer(adminApp),
      ioAdmin = socketio.listen(adminServer)

require('./routes/admin/sockets').configure(ioAdmin)

// adminApp.use( express.static(__dirname + '/../client/public') )
process.env.ADMIN_PORT = process.env.ADMIN_PORT || 1337
adminServer.listen( process.env.ADMIN_PORT )
console.log(`Admin socket server listening on :${process.env.ADMIN_PORT}`)




module.exports.victimServer = victimServer
module.exports.ioVictim     = ioVictim
module.exports.adminServer  = adminServer
module.exports.ioAdmin      = ioAdmin