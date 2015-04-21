var express = require('express');
var router = express.Router();
var request = require('superagent');
var bodyParser = require('body-parser');


router.get('/',function(req,res){
   request
   .get('http://dwelly.me/api/vat/54.154.87.28')
   .end(function(err, r){
     if(err){
       console.log(err);

    } else {
      res.render('index',{
        res:r
      });
    }
     });
});

module.exports = router;
