var request = require('superagent');
var chai = require('chai');

var expect = chai.expect;

describe("advanced VAT api", function () {

  it("should accept a json object", function (done) {
    request
      .post('/api/check')
      .send({ ip: '62.178.4.127', evidence: ['AT','DE','UK'] })
      .end(function(err, res){
        expect(err).to.be.null;
        
        done();
      });
  });

  it("should return a json object", function (done) {
    request
      .post('/api/check')
      .send({ ip: '62.178.4.127', evidence: ['AT','DE','UK'] })
      .end(function(err, res){
        expect(err).to.be.null;
        expect(res.body).to.be.an('object');

        done();
      });
  });

  it("should return validated:true when 2 or more pieces of information match", function (done) {
    request
      .post('/api/check')
      .send({ ip: '62.178.4.127', evidence: ['AT','DE','UK'] })
      .end(function(err, res){
        expect(err).to.be.null;
        expect(res.body.validated).to.be(true);

        done();
      });
  });

  it("should return the rates and official country code when validated:true", function (done) {
    request
      .post('/api/check')
      .send({ ip: '62.178.4.127', evidence: ['DE','DE','UK'] })
      .end(function(err, res){
        expect(err).to.be.null;
        expect(res.body.validated).to.be(true);
        expect(res.body.countryCode).to.be('DE');
        expect(res.body.country).to.be('Germany');
        expect(res.body.rates).to.be.an('object');

        done();
      });
  });

  it("should return validated:false and the vat and country code based on the ip if validated false", function (done) {
    request
      .post('/api/check')
      .send({ ip: '62.178.4.127', evidence: ['DE','LU','UK'] })
      .end(function(err, res){
        expect(err).to.be.null;
        expect(res.body.validated).to.be(false);
        expect(res.body.countryCode).to.be('AT');
        expect(res.body.country).to.be('Austria');
        expect(res.body.rates).to.be.an('object');

        done();
      });
  });

  it("should work with lowercase codes", function () {
    request
      .post('/api/check')
      .send({ ip: '62.178.4.127', evidence: ['de','de','uk'] })
      .end(function(err, res){
        expect(err).to.be.null;
        expect(res.body.validated).to.be(true);
        expect(res.body.countryCode).to.be('DE');
        expect(res.body.country).to.be('Germany');
        expect(res.body.rates).to.be.an('object');

        done();
      });
  });

  it("should work with country names", function () {
    request
      .post('/api/check')
      .send({ ip: '62.178.4.127', evidence: ['germany','germany','england'] })
      .end(function(err, res){
        expect(err).to.be.null;
        expect(res.body.validated).to.be(true);
        expect(res.body.countryCode).to.be('DE');
        expect(res.body.country).to.be('Germany');
        expect(res.body.rates).to.be.an('object');

        done();
      });
  });

});
