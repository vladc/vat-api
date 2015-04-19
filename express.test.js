var superagent = require('superagent');
var chai = require('chai');

var expect = chai.expect;

var vatRates;

superagent
.get('http://jsonvat.com')
.end(function(err,res){
  vatRates = res.body.rates;
});

describe('vat rest api', function(){

  it('should return 20 for Austrian IPs',function(done){
    superagent.get("http://localhost:3000/62.178.4.127")
      .end(function(err,res){
        expect(err).to.be.null;
        expect(res.body.rate).to.equal(20);
        done();
      });
  });

    it('should return 23 for Irish IPs',function(done){
      superagent.get("http://localhost:3000/54.154.87.28")
        .end(function(err,res){
          expect(err).to.be.null;
          expect(res.body.rate).to.equal(23);
          done();
        });
    });

    it('should return null for countries outside the EU',function(done){
      superagent.get("http://localhost:3000/67.132.30.211")
        .end(function(err,res){
          expect(err).to.be.null;
          expect(res.body.rate).to.be.null;
          done();
        });
    });

});
