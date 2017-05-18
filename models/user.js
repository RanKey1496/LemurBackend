var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');

//kek

var beautifyUnique = require('mongoose-beautiful-unique-validation');

var UserSchema = Schema({
	username:{
		type: String, unique: true, lowercase: true, required: true
	},
	password: {
		type: String, select: false, required: true
	},
	name: {
		first: { type: String, required: true},
		last: { type: String, required: true}
	},
	companies: [{
		type: Schema.ObjectId, ref: 'Company'
	}],
	signupDate: {
		type: Date, default: Date.now()
	},
	role: {
		type: String, enum: ['admin', 'user', 'producer'], default: 'user'
	}
});

UserSchema.pre('save', function(next){
	var user = this;
	if(!user.isModified('password')){
		return next();
	};
	bcrypt.genSalt(10, function(err, salt){
		if(err){
			return next();
		}
		bcrypt.hash(user.password, salt, null, function(err, hash){
			if(err){
				return next(err);
			}
			user.password = hash;
			next();
		});
	});
});

UserSchema.plugin(beautifyUnique);

module.exports = mongoose.model('User', UserSchema);
