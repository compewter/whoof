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

describe('server tests', function(){
  
  describe('admin app', function(){
    
    before(function () {
      adminServer.listen(ADMINPORT);
    });

    after(function () {
      adminServer.close();
    });

    describe('admin server API', function(){

      it('should respond to get requests for the admin app', function(done){
        request(ADMINSOCKET, function(err, res, body){
          expect(err).to.be.null;
          expect(body).to.have.string('<!DOCTYPE html>');
          done();
        });
      });

    });
  });

  describe('client app', function(){

    before(function () {
      clientServer.listen(CLIENTPORT);
    });

    after(function () {
      clientServer.close();
    });

    describe('client server API', function(){

      it('should respond to get requests for the client app', function(done){
        request(CLIENTSOCKET, function(err, res, body){
          expect(err).to.be.null;
          expect(body).to.have.string('<!DOCTYPE html>');
          done();
        });
      });

    });
  });
  

});