/* jshint node: true */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};

var validateUsername = function(username) {
   if (username.length >= 4 && username.length <= 30) {
		return true;
   	}
   	return false;
};

var validatePassword = function(password) {
    if (password.length >= 4 && password.length <= 30) {
		return true;
   	}
   	return false;
};

var UserSchema = new Schema({
	username : { type : String, trim : true, index: { unique: true }, required : true, validate: [validateUsername, 'Invalid \`username`\.']},
	password : { type : String, trim : true, required : true,  validate: [validateUsername, 'Invalid \`password`\.']},
	email : {type : String, trim : true, required : true, validate: [validateEmail, 'Invalid \`email`\.']},
	avatar : { type : String, trim : true},
	isAdmin : { type : Boolean, trim : true, default: false},
	created_at : { type : Date, default : Date.now}
});

/**
* Instance methods
*/
UserSchema.methods.updateAvatar = function(img_path, callback) {
	return this.model('User').update({'username' : this.username}, {'$set' : {'avatar' : img_path}}, callback);
};

UserSchema.methods.getUserListExceptCurrent = function(callback) {
	return this.find({'username': {'$ne': this.username}}, callback);
};


/**
* Statics
*/
UserSchema.statics.findUserByUsername = function(username, callback) {
	return this.findOne({'username': username}).exec(callback);
};


UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
