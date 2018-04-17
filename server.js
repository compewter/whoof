const http = require('http')

const express = require('express')

const victimApp = express()
const victimServer = http.createServer(victimApp)
const ioVictim = require('./routes/victim/sockets').listen(victimServer)

process.env.VICTIM_PORT = process.env.VICTIM_PORT || 8080
victimApp.use(express.static(__dirname + '/public'))
victimServer.listen( process.env.VICTIM_PORT)
console.log(`Victim socket server listening on :${process.env.VICTIM_PORT}`)


const adminApp = express()
const adminServer = http.createServer(adminApp)
const ioAdmin = require('./routes/admin/sockets').listen(adminServer)

// adminApp.use( express.static(__dirname + '/../client/public') )
process.env.ADMIN_PORT = process.env.ADMIN_PORT || 1337
adminServer.listen( process.env.ADMIN_PORT )
console.log(`Admin socket server listening on :${process.env.ADMIN_PORT}`)


module.exports.victimServer = victimServer
module.exports.ioVictim = ioVictim
module.exports.adminServer  = adminServer
module.exports.ioAdmin = ioAdmin