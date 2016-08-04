const http = require('http')

const express = require('express')
const userApp = express()
const adminApp = express()

const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const config = require('../webpack.config')
const compiler = webpack(config)

const models = require("../db/models")

const clientServer = http.createServer(userApp)
const ioClient = require('./userApp/sockets').listen(clientServer)

userApp.use( express.static(__dirname + '/../client/userApp') )
clientServer.listen( process.env.PORT || 8080 )

console.log("Client server listening on :8080")


//It seems odd to me that we generally have our admin pages available from the internet. 
//Thus, the admin app will be available on a different port.
const adminServer = http.createServer(adminApp)
const ioAdmin = require('./adminApp/sockets').listen(adminServer)

adminApp.use( express.static(__dirname + '/../client/adminApp/public') )
adminApp.use( express.static(__dirname + '/../bower_components/') )
adminApp.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
adminApp.use(webpackHotMiddleware(compiler))
adminServer.listen( 1337 )

console.log("Admin server listening on :1337")


module.exports.clientServer = clientServer
module.exports.ioClient = ioClient
module.exports.adminServer  = adminServer
module.exports.ioAdmin = ioAdmin