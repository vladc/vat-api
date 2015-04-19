var express = require ('express');
var request = require('superagent');
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('morgan');

var app = express();

var vatRates;

request
.get('http://jsonvat.com')
.end(function(err,res){
  vatRates = res.body.rates;
});

// configure app

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));

// add middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'src/bower_modules')));
app.use(express.static(path.join(__dirname,'bower_modules')));


app.get('/',function(req,res){
  res.render('index');
});

app.get('/vat/:ip', function(req,res){
  var ip = req.params.ip,
      country,
      countryCode,
      rate = null;

    // get the location from an API
   request
   .get('http://ip-api.com/json/' + ip )
   .end(function(err, result){
     if(err){
       console.log(err);
     } else {
       country = result.body.country;
       countryCode = result.body.countryCode;
       for(var i = 0; i < vatRates.length;i++){

         if(vatRates[i].country_code === countryCode){
           rate = vatRates[i].periods[0].rates;
         }

       }
     }
     var answer = {rates:rate};
    res.send(answer);

  });

});

app.listen('3000',function(){
  console.log("Server Running");
});
