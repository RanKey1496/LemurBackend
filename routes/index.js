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
    cb(null, 'public/songs/')
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

//Users
api.post('/user/addCompany', UserController.addCompany);
api.post('/user/removeCompany', UserController.removeCompany);

//Companies
api.post('/company/create', CompanyController.create);
api.post('/company/get', CompanyController.get);
api.post('/company/getAll', CompanyController.getAll);
api.post('/company/update', CompanyController.update);
api.post('/company/remove', CompanyController.remove);
api.post('/company/addPlayList', CompanyController.addPlayList);
api.post('/company/removePlayList', CompanyController.removePlayList);
api.post('/company/search', CompanyController.search);

//Songs
api.post('/song/create', upload, SongController.create);
api.post('/song/get', SongController.get);
api.post('/song/getAll', SongController.getAll);
api.post('/song/update', SongController.update);
api.post('/song/remove', SongController.remove);
api.post('/song/search', SongController.search);

//PlayList
api.post('/playlist/create', PlayListController.create);
api.post('/playlist/get', PlayListController.get);
api.post('/playlist/update', PlayListController.update);
api.post('/playlist/remove', PlayListController.remove);
api.post('/playlist/addSong', PlayListController.addSong);
api.post('/playlist/removeSong', PlayListController.removeSong);
api.post('/playlist/search', PlayListController.search);

module.exports = api;