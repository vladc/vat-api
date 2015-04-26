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

/*
The basic API for checking the VAT rate based on an IP address.

*/

router.get('/vat/:ip', function(req,res){
  var ip = req.params.ip,
      country,
      countryCode,
      result,
      errors = [],
      rate,
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

        if(!rate){
          res.status(404).send('Country outside the EU');
        } else {
          var answer = {
           successful:success,
           rates:rate,
           countryCode:result.countryCode,
           country:result.country,
           errors:errors[0] ? errors : false};

          res.json(answer);
        }

       }
    });

});

/*
The more advanced route for validating a user's VAT rate based on
multiple pieces of evidence. It checks whether at least 2 pieces of evidence match
and returns the VAT rate, country code and country accordingly.
If no 2 pieces of evidence match it returns the VAT rate based on the ip address
and a validated:false flag.
*/

router.post('/vat',function(req,res){
  var info = {
    ip:req.body.ip,
    evidence:req.body.evidence || []
  },
      success = false,
      validated = false,
      errors = [],
      rate,
      countryCode,
      country;

  // request the geolocation from the IP API
  request
  .get('http://ip-api.com/json/' + info.ip + '?fields=16387' )
  .end(function(err, r){
   if(err){
     console.log(err);

   } else if(r.body.status === "success") {

     success = true;

    // check if the supplied evidence is sufficient

    // get the IP-based country code into the supplied array of country codes
    countryCode = r.body.countryCode;

    if (info.evidence[0]){
      info.evidence.push(countryCode);

      // convert all values to uppercase

      info.evidence = info.evidence.map(function(code){
        return code.toUpperCase();
      });

      // go through the array and compare each code to to others to see if
      // there are 2 matching codes
      for (var i = 0; i < info.evidence.length; i++){
        var code = info.evidence[i];

        for (var k = 0; k < info.evidence.length; k++){
          if (code === info.evidence[k] && k !== i){
            countryCode = code;
            validated = true;
          }
        }
      }
    } else {
      errors.push("No evidence provided");
    }

    // get the rate from the vat list

    vatRates.forEach(function(obj){
      if(obj.country_code === countryCode){
        rate = obj.periods[0].rates;
        country = obj.name;
      }
    });

    if(!rate && !country){
      res.status(404).send('Country outside the EU');
    } else {
      var answer = {
       successful:success,
       validated:validated,
       rates:rate,
       countryCode:countryCode,
       country:country,
       errors:errors};

      res.json(answer);
    }

   }
  });
});

module.exports = router;
