var request = require('request');
var io = require('socket.io/node_modules/socket.io-client');
var http = require('http');

var chai = require('chai');
var assert = chai.assert;
var should = chai.should();
var expect = chai.expect;

var adminServer = require('../../server').adminServer;
var clientServer = require('../../server').clientServer;

var IP = '127.0.0.1';
var ADMINPORT = '1337';
var CLIENTPORT = '8080';
var ADMINSOCKET = 'http://' + IP + ':' + ADMINPORT;
var CLIENTSOCKET = 'http://' + IP + ':' + CLIENTPORT;

describe('admin server feature tests', function () {

  describe('admin server API', function () {

    it('should respond to get requests for the admin app', function (done) {
      request(ADMINSOCKET, function (err, res, body) {
        expect(err).to.be.null;
        expect(body).to.have.string('<!DOCTYPE html>');
        done();
      });
    });

  });

  describe('admin socket functions', function () {
    var ioAdmin,
        ioClient1,
        ioClient2,
        attacks;

    before(function () {
      ioAdmin = io.connect(ADMINSOCKET, {forceNew: true});
      ioClient1 = io.connect(CLIENTSOCKET, {forceNew: true});
      ioClient2 = io.connect(CLIENTSOCKET, {forceNew: true});
    });

    after(function () {
      ioAdmin.disconnect();
      ioClient1.disconnect();
      ioClient2.disconnect();
    });


    it('should accept socket connections', function (done) {

      ioAdmin.on('connect', function () {
        done();
      });

    });

    it('should respond to requests for all attacks', function (done) {

      ioAdmin.emit('getAttacks');

      ioAdmin.on('attacks', function (res) {
        expect(res.length).to.not.equal(0);
        attacks = res;
        done();
      });
    });


    it('should respond to requests for all active clients', function (done) {
      var clientCount = 0;
      var lastUser = ''

      ioAdmin.emit('getUsers');

      ioAdmin.on('newUser', function (user) {
        //verify each user is unique
        expect(user).to.not.equal(lastUser);
        lastUser = user;
        clientCount++;
        if(clientCount === 2){
          done();
        }
      });
      
    });
    
    it('should execute an attack module on a given target', function (done) {

      var attack = attacks[0];

      ioAdmin.emit('attackUser', { 
        userSocket: ioClient1.id, 
        attack: attack.name
      });

      ioClient1.on('execute', function(instructions){
        expect(instructions.func).to.have.string("var attack = ");
        done();
      });

    });
  });
});