var request = require('superagent');

var vatRates;

request
.get('http://jsonvat.com')
.end(function(err,res){
  vatRates = res.body.rates;
});

module.exports.vatRates = vatRates;
