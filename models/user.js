var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

var UserSchema = new Schema({
	username : { type : String, trim : true, index: { unique: true }, require : true},
	password : { type : String, trim : true, require : true},
	email : {type : String, trim : true, require : true,
			validate: [validateEmail, 'Please fill a valid email address']
	},
	avatar : { type : String, trim : true},
	isAdmin : { type : Boolean, trim : true, default: false},
	created_at : { type : Date, default : Date.now}
});


/**
* Statics
*/
UserSchema.statics.findUserByUsername = function(username, callback) {
	return this.findOne({'username': username}).exec(callback);
};

UserSchema.statics.getUserListExceptCurrent = function(username, callback) {
	return this.find({'username': {'$ne': username}}).exec(callback);
}

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
