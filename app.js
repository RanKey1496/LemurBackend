var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var api = require('./routes');
var cors = require('cors');

var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}));
//app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use('/public/songs', express.static(__dirname + '/public/songs'));


app.use('/', api);
module.exports = app;