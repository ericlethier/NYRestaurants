var mongoose = require('mongoose');
var usermodel = require('../../models/user');
var User = mongoose.model('User');

module.exports.username = 'testUser' + Math.floor(Date.now());
module.exports.testUserOK = new User({ username : module.exports.username, email : 'testUser@testUser.com', password : 'testUser' });
module.exports.testUserMissingEmail = new User({ username : module.exports.username, password : 'testUser' });
module.exports.testUserInvalidEmail = new User({ username : module.exports.username, email : 'testUsertestUser.com', password : 'testUser' });
module.exports.testUserMissingUsername = new User({ email : 'testUser@testUser.com', password : 'testUser' });
module.exports.testUserShortUsername = new User({ username : 'tes', email : 'testUser@testUser.com', password : 'testUser' });
module.exports.testUserLongUsername = new User({ username : 'testUsertestUsertestUsertestUsertestUsertestUsertestUser', email : 'testUser@testUser.com', password : 'testUser' });
module.exports.testUserMissingPassword = new User({ username : module.exports.username, email : 'testUser@testUser.com'});
module.exports.testUserShortPassword = new User({ username : module.exports.username, email : 'testUser@testUser.com', password : 'tes'});
module.exports.testUserLongPassword = new User({ username : module.exports.username, email : 'testUser@testUser.com', password : 'testUsertestUsertestUsertestUsertestUsertestUsertestUser'});
