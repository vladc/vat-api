var request = require('superagent');
var chai = require('chai');

var expect = chai.expect;


describe('vat rest api', function(){

  it('should return 20 for Austrian IPs',function(done){
    request.get("http://localhost:3000/vat/62.178.4.127")
      .end(function(err,res){
        expect(err).to.be.null;
        expect(res.body.rates.standard).to.equal(20);
        done();
      });
  });

  it('should return the country code AT for Austrian IPs',function(done){
    request.get("http://localhost:3000/vat/62.178.4.127")
      .end(function(err,res){
        expect(err).to.be.null;
        expect(res.body.countryCode).to.equal("AT");
        done();
      });
  });

    it('should return the country Austria for Austrian IPs',function(done){
      request.get("http://localhost:3000/vat/62.178.4.127")
        .end(function(err,res){
          expect(err).to.be.null;
          expect(res.body.country).to.equal("Austria");
          done();
        });
    });

    it('should return 23 for Irish IPs',function(done){
      request.get("http://localhost:3000/vat/54.154.87.28")
        .end(function(err,res){
          expect(err).to.be.null;
          expect(res.body.rates.standard).to.equal(23);
          done();
        });
    });

    it('should return null for countries outside the EU',function(done){
      request.get("http://localhost:3000/vat/67.132.30.211")
        .end(function(err,res){
          expect(err).to.be.null;
          expect(res.body.rates).to.be.null;
          done();
        });
    });

});