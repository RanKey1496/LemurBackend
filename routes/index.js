var express = require('express');
var UserController= require('../controllers/user');
var CompanyController = require('../controllers/company');
var SongController = require('../controllers/song');
var PlayListController = require('../controllers/playlist');
var api = express.Router();
var multer = require('multer');

//Image upload
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'songs/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.mp3')
  }
});
var upload = multer({ storage: storage }).single('file');

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
api.post('/song/create', upload, SongController.create);
api.post('/song/get', SongController.get);
api.post('/song/update', SongController.update);
api.post('/song/remove', SongController.remove);

//PlayList
api.post('/playlist/create', upload, PlayListController.create);
api.post('/playlist/get', PlayListController.get);
api.post('/playlist/update', PlayListController.update);
api.post('/playlist/remove', PlayListController.remove);
api.post('/playlist/addSong', PlayListController.addSong);
api.post('/playlist/removeSong', PlayListController.removeSong);
api.post('/playlist/search', PlayListController.search);


api.post('/upload', upload, UserController.uploadPicture);
api.post('/upload2', upload, UserController.getShit);

module.exports = api;