var request = require('superagent');
var chai = require('chai');

var expect = chai.expect;

describe("advanced VAT api", function () {

  it("should accept a json object", function (done) {
    request
      .post('http://localhost:3000/api/vat')
      .send({ ip: '62.178.4.127', evidence: ['AT','DE','UK'] })
      .end(function(err, res){
        expect(err).to.be.null;

        done();
      });
  });

  it("should return a json object", function (done) {
    request
      .post('http://localhost:3000/api/vat')
      .send({ ip: '62.178.4.127', evidence: ['AT','DE','UK'] })
      .end(function(err, res){
        expect(err).to.be.null;
        expect(res.body).to.be.an('object');

        done();
      });
  });

  it("should return validated:true when 2 or more pieces of information match", function (done) {
    request
      .post('http://localhost:3000/api/vat')
      .send({ ip: '62.178.4.127', evidence: ['AT','DE','UK'] })
      .end(function(err, res){
        expect(err).to.be.null;
        expect(res.body.validated).to.equal(true);
        expect(res.body.errors).to.be.empty;
        done();
      });
  });

  it("should return the rates and official country code when validated:true", function (done) {
    request
      .post('http://localhost:3000/api/vat')
      .send({ ip: '62.178.4.127', evidence: ['DE','DE','UK'] })
      .end(function(err, res){
        expect(err).to.be.null;
        expect(res.body.validated).to.equal(true);
        expect(res.body.countryCode).to.equal('DE');
        expect(res.body.country).to.equal('Germany');
        expect(res.body.rates).to.be.an('object');
        expect(res.body.errors).to.be.empty;

        done();
      });
  });

  it("should return validated:false and the vat and country code based on the ip if validated false", function (done) {
    request
      .post('http://localhost:3000/api/vat')
      .send({ ip: '62.178.4.127', evidence: ['DE','LU','UK'] })
      .end(function(err, res){
        expect(err).to.be.null;
        expect(res.body.validated).to.equal(false);
        expect(res.body.countryCode).to.equal('AT');
        expect(res.body.country).to.equal('Austria');
        expect(res.body.rates).to.be.an('object');

        done();
      });
  });

  it("should return the VAT rate based on the IP if the no evidence is provided", function (done) {
    request
      .post('http://localhost:3000/api/vat')
      .send({ ip: '62.178.4.127'})
      .end(function(err, res){
        expect(err).to.be.null;
        expect(res.body.validated).to.equal(false);
        expect(res.body.countryCode).to.equal('AT');
        expect(res.body.country).to.equal('Austria');
        expect(res.body.rates.standard).to.be.equal(20);

        done();
      });
  });

  it("should work with lowercase codes", function (done) {
    request
      .post('http://localhost:3000/api/vat')
      .send({ ip: '62.178.4.127', evidence: ['de','de','uk'] })
      .end(function(err, res){
        expect(err).to.be.null;
        expect(res.body.validated).to.equal(true);
        expect(res.body.countryCode).to.equal('DE');
        expect(res.body.country).to.equal('Germany');
        expect(res.body.rates.standard).to.equal(19);

        done();
      });
  });

  it('should return an error for countries outside the EU',function(done){
    request
      .post('http://localhost:3000/api/vat')
      .send({ ip: '67.132.30.211', evidence: ['de','lu','uk'] })
      .end(function(err,res){
        expect(err).to.be.exist;
        done();
      });
  });

  // it("should work with country names", function () {
  //   request
  //     .post('http://localhost:3000/api/vat')
  //     .send({ ip: '62.178.4.127', evidence: ['germany','germany','england'] })
  //     .end(function(err, res){
  //       expect(err).to.be.null;
  //       expect(res.body.validated).to.be(true);
  //       expect(res.body.countryCode).to.be('DE');
  //       expect(res.body.country).to.be('Germany');
  //       expect(res.body.rates).to.be.an('object');
  //
  //       done();
  //     });
  // });

});
