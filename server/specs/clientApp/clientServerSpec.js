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

describe('client server tests', function () {

  describe('client server API', function () {

    it('should respond to get requests for the client app', function (done) {
      request(CLIENTSOCKET, function (err, res, body) {
        expect(err).to.be.null;
        expect(body).to.have.string('<!DOCTYPE html>');
        done();
      });
    });

  });

  describe('client socket functions', function () {
    var ioAdmin,
        ioClient1,
        ioClient2,
        attacks;

    before(function () {
      ioAdmin = io.connect(ADMINSOCKET, {forceNew: true});
      ioClient1 = io.connect(CLIENTSOCKET, {forceNew: true});
    });

    after(function () {
      ioAdmin.disconnect();
      ioClient1.disconnect();
      ioClient2.disconnect();
    });

    it('should accept socket connections', function (done) {
      
      ioClient1.on('connect', function () {
        done();
      });
    });

    it('should notify the admins when a user connects', function (done) {
      ioClient2 = io.connect(CLIENTSOCKET, {forceNew: true});

      ioAdmin.on('newUser', function(){
        done();
      });
    });

    it('should notify the admins when a user disconnects', function (done) {
      ioClient2.disconnect();

      ioAdmin.on('userLeft', function(){
        done();
      });
    });

    it('should relay a result back to the admins', function (done) {
      ioClient1.emit('result',{});

      ioAdmin.on('result', function(){
        done();
      });
    });

  });

});