var request = require('request');
var io = require('socket.io/node_modules/socket.io-client');
var http = require('http');

var chai = require('chai');
var assert = chai.assert;
var should = chai.should();
var expect = chai.expect;

var adminServer = require('../server').adminServer;
var clientServer = require('../server').clientServer;

var IP = '127.0.0.1';
var ADMINPORT = '1337';
var CLIENTPORT = '8080';
var ADMINSOCKET = 'http://' + IP + ':' + ADMINPORT;
var CLIENTSOCKET = 'http://' + IP + ':' + CLIENTPORT;

describe('server tests', function () {
  
  describe('admin app', function () {

    before(function () {
      adminServer.listen(ADMINPORT);
    });

    after(function () {
      adminServer.close();
    });

    describe('admin server API', function () {

      it('should respond to get requests for the admin app', function(done){
        request(ADMINSOCKET, function(err, res, body){
          expect(err).to.be.null;
          expect(body).to.have.string('<!DOCTYPE html>');
          done();
        });
      });

    });

    describe('admin socket functions', function () {

      it('should accept socket connections', function (done) {
        ioAdmin = io.connect(ADMINSOCKET, {forceNew: true});

        ioAdmin.on('connect', function () {
          done();
          ioAdmin.disconnect();
        });

      });

      it('should accept requests for all active clients', function (done) {
        ioAdmin = io.connect(ADMINSOCKET, {forceNew: true});

        ioAdmin.on('connect', function () {
          //we need to make sure both clients and an admin have connected before running this test
          ioClient1 = io.connect(CLIENTSOCKET, {forceNew: true});
          ioClient1.on('connect', function(){

            ioClient2 = io.connect(CLIENTSOCKET, {forceNew: true});
            ioClient1.on('connect', function(){

              ioAdmin.emit('getUsers');
            });
          })
        });

        var clientCount = 0;
        var lastUser = ''

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

    });
  });

  describe('client app', function () {

    before(function () {
      clientServer.listen(CLIENTPORT);
    });

    after(function () {
      clientServer.close();
    });

    describe('client server API', function () {

      it('should respond to get requests for the client app', function(done){
        request(CLIENTSOCKET, function(err, res, body){
          expect(err).to.be.null;
          expect(body).to.have.string('<!DOCTYPE html>');
          done();
        });
      });

    });

    describe('client socket functions', function () {


    });
  });
  
});