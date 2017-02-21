var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var beautifyUnique = require('mongoose-beautiful-unique-validation');

var SongSchema = new Schema({
	name: {
		type: String, required: true
	}, 
	artist: {
		type: String, required: true
	},
	album: {
		type: String
	},
	duration: {
		type: Number, required: true 
	},
	url: {
		type: String, required: true
	},
	createdDate : {
		type: Date, default: Date.now()
	}
});

SongSchema.plugin(beautifyUnique);

module.exports = mongoose.model('Song', SongSchema);