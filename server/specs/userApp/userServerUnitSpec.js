// require('../../server');
var userSockets = require('../../userApp/sockets');
var io = require('socket.io/node_modules/socket.io-client');
var chai = require('chai');
var assert = chai.assert;
var should = chai.should();
var expect = chai.expect;

var IP = '127.0.0.1';
var ADMINPORT = '1337';
var USERPORT = '8080';
var ADMINSOCKET = 'http://' + IP + ':' + ADMINPORT;
var USERSOCKET = 'http://' + IP + ':' + USERPORT;

describe('user server unit tests', function () {
  var ioClient;
  
  before(function () {
    ioAdmin = io.connect(ADMINSOCKET, {forceNew: true});
    ioClient = io.connect(USERSOCKET, {forceNew: true});
  });

  after(function () {
    ioAdmin.disconnect();
    ioClient.disconnect();
  });


  it('buildNewUser should construct a user object',function (done) {
    var socket = {
      _id: 0,
      id: 1,
      handshake: {
        address: ":1234",
        headers: {
          'user-agent': "(agent)"
        },
        time: new Date()
      }
    }
    var newUser = userSockets.buildNewUser(socket);

    expect(newUser.id).to.equal(socket._id);
    expect(newUser.socketId).to.equal(socket.id);
    expect(newUser.ip).to.equal('1234');
    expect(newUser.agent).to.equal('agent');
    expect(typeof newUser.connectedAt).to.equal('object');
    done();
  });

  it('sockets should contain the connected client', function (done) {
    expect(userSockets.sockets.length).to.equal(1);
    done();
  });

  it('disconnect should remove the disconnecting user from sockets',function (done) {
    ioClient.disconnect();

    ioAdmin.on('userLeft', function(){
      expect(userSockets.sockets.length).to.equal(0);
      done();
    });
  });
});