/* jshint node: true */
'use strict';

// config/database.js
module.exports = {
	'URL' : 'mongodb://testUser:password@localhost:27017/test',
	'OPTIONS' : { server: { socketOptions: { keepAlive: 1 } } }
};
