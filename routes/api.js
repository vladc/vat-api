var express = require('express');
var router = express.Router();
var request = require('superagent');

var vatRates;

var getRates = function() {
  request
    .get('http://jsonvat.com')
    .end(function(err,res){
      vatRates = res.body.rates;
    });
};

getRates();

setInterval(function(){
   getRates();
}, 60000 * 120);

router.get('/vat/:ip', function(req,res){
  var ip = req.params.ip,
      country,
      countryCode,
      result,
      rate = null,
      success = false,
      tries = 0;

    // get the location from an API, retry 3 times when unsuccesful
     request
     .get('http://ip-api.com/json/' + ip + '?fields=16387' )
     .end(function(err, r){
       if(err){
         console.log(err);

       } else if(r.body.status === "success") {

         result = r.body;
         success = true;

        vatRates.forEach(function(obj){
          if(obj.country_code === result.countryCode){
            rate = obj.periods[0].rates;
          }
        });


        var answer = {
         successful:success,
         rates:rate,
         countryCode:result.countryCode,
         country:result.country};

        res.json(answer);

       }
    });

});

module.exports = router;
