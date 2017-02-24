var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var api = require('./routes');
var cors = require('cors');

var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use('/public/songs', express.static(__dirname + '/public/songs'));


app.use('/', api);
module.exports = app;