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
      var ioAdmin;

      beforeEach(function () {
        ioAdmin = io.connect(ADMINSOCKET, {forceNew: true});
        ioClient1 = io.connect(CLIENTSOCKET, {forceNew: true});
        ioClient2 = io.connect(CLIENTSOCKET, {forceNew: true});
      });

      afterEach(function () {
        ioAdmin.disconnect();
      });


      it('should accept socket connections', function (done) {

        ioAdmin.on('connect', function () {
          done();
        });

      });

      it('should respond to requests for all attacks', function (done) {

        ioAdmin.on('connect', function () {
          ioAdmin.emit('getAttacks');
        });

        ioAdmin.on('attacks', function(attacks){
          expect(attacks.length).to.not.equal(0);
          done();
        });
      });


      it('should respond to requests for all active clients', function (done) {

        ioAdmin.on('connect', function () {
          //we need to make sure both clients and an admin have connected before running this test
          ioClient1.on('connect', function(){

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
      
      it('should execute an attack module on a given target', function (done) {

      });
    });
  });

  describe('client app', function () {

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