var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var beautifyUnique = require('mongoose-beautiful-unique-validation');

var CompanySchema = Schema({
	nit: {
		type: String, unique: true, required: true
	}, 
	name: {
		type: String, required: true
	},
	playlists: [{
		type: Schema.ObjectId, ref: 'PlayList'
	}],
	createdDate : {
		type: Date, default: Date.now()
	}
});

CompanySchema.plugin(beautifyUnique);

module.exports = mongoose.model('Company', CompanySchema);