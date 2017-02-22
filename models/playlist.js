var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var beautifyUnique = require('mongoose-beautiful-unique-validation');

var PlayListSchema = new Schema({
	name: {
		type: String, required: true
	}, 
	creator: {
		type: String, required: true
	},
	songs: [{
		type: Schema.ObjectId, ref: 'Song', unique: true
	}],
	createdDate : {
		type: Date, default: Date.now()
	}
});

PlayListSchema.plugin(beautifyUnique);

module.exports = mongoose.model('PlayList', PlayListSchema);