/* jshint node: true */
'use strict';

var mongoose = require('mongoose');
var configDB = require('../config/database.js');

before(function(done) {
	//Another possibility is to check if mongoose.connection.readyState equals 1
	if (mongoose.connection.db) {
		return done();
	}
	mongoose.connect(configDB.URL, configDB.OPTIONS);
	done();
});

after(function(done){
	mongoose.connection.close(done);
});
