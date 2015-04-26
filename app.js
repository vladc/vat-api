var express = require ('express');
var request = require('superagent');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

// routers
var api = require('./routes/api');
var views = require('./routes/views');

var app = express();

// configure app

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'src'));

// add middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'src')));

// add routes
app.use('/',views);
app.use('/api',api);

app.listen('3000',function(){
  console.log("Server Running");
});
