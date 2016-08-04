var chai = require('chai');
var assert = chai.assert;
var should = chai.should();
var expect = chai.expect;

var env = require('../../../../.env.json');

var client = require('webdriverio').remote({
  user: env.SAUCE_USERNAME,
  key:  env.SAUCE_ACCESS_KEY,
  desiredCapabilities: {
    browserName: 'chrome'
  }
});

describe('user browser functional tests', function(){
  it('should load the user page', function(done){
    client
      .init()
      .url('http://localhost:8080')
      .getTitle()
      .then(function(title){
        expect(title).to.equal('http://localhost:8080/');
        done();
      })
      .end();
  });
});