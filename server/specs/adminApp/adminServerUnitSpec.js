// require('../../server');
var adminSockets = require('../../adminApp/sockets');
var io = require('socket.io/node_modules/socket.io-client');
var chai = require('chai');
var assert = chai.assert;
var should = chai.should();
var expect = chai.expect;

var IP = '127.0.0.1';
var ADMINPORT = '1337';
var CLIENTPORT = '8080';
var ADMINSOCKET = 'http://' + IP + ':' + ADMINPORT;
var CLIENTSOCKET = 'http://' + IP + ':' + CLIENTPORT;

describe('admin server unit tests', function () {
  var ioClient;

  before(function () {
    ioAdmin = io.connect(ADMINSOCKET, {forceNew: true});
    ioClient = io.connect(CLIENTSOCKET, {forceNew: true});
  });

  after(function () {
    ioAdmin.disconnect();
    ioClient.disconnect();
  });

  it('emit should broadcast to all admins', function (done) {
    adminSockets.emit('testEvent', {test:"test data"});

    ioAdmin.on('testEvent', function(data){
      expect(data.test).to.equal('test data');
      done();
    });
  });

  it('getAttacks should send attacks to admins', function (done) {
    adminSockets.getAttacks();

    ioAdmin.on('attacks', function(){
      done();
    });
  });

  it('attackUser should send attack instructions to targeted user', function (done) {
    var attack = {
      attack: "test",
      userSocket: ioClient.id
    };

    adminSockets.attackUser(attack);

    ioClient.on('execute', function(){
      done();
    });
  });

  it('getUsers should send users to admins', function (done) {
    adminSockets.getUsers();

    ioAdmin.on('newUser', function(){
      done();
    });
  });
});