var express = require('express');
var UserController= require('../controllers/user');
var CompanyController = require('../controllers/company');
var SongController = require('../controllers/song');
var api = express.Router();
var multer = require('multer');

//Image upload
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.mp3')
  }
});
var upload = multer({ storage: storage }).single('avatar');

api.get('/', function(req, res){
	return res.status(200).send({message: 'Lemur API'});
});

//Users
api.post('/signup', UserController.signup);
api.post('/signin', UserController.signin);

//Middleware
api.use(UserController.tokenCheck);

api.get('/authenticated', UserController.getAuthenticatedUser);

//Companies
api.post('/company/create', CompanyController.create);
api.post('/company/get', CompanyController.get);
api.post('/company/update', CompanyController.update);
api.post('/company/remove', CompanyController.remove);

//Songs
api.post('/song/create', SongController.create);
api.post('/song/get', SongController.get);
api.post('/song/update', SongController.update);
api.post('/song/remove', SongController.remove);

//PlayList
api.post('/upload', upload, UserController.uploadPicture);
api.post('/upload2', upload, UserController.getShit);

module.exports = api;