/* jshint node: true */
'use strict';

var assert = require('assert');
var mongoose = require('mongoose');
var root_hooks = require('../root_hooks.js');
var userModel = require('../../models/user');
var userData = require('../data/user.js');
var User = mongoose.model('User');

describe('User', function () {

  describe("Validation", function() {

    it('validates an email address', function(done){
      userData.testUserMissingEmail.validate(function(err) {
        assert.equal(err.errors.email, 'Path \`email\` is required.');
        done();
      });
    });

    it('validates the format of an email address', function(done){
      userData.testUserInvalidEmail.validate(function(err) {
        assert.equal(err.errors.email, 'Invalid \`email\`.');
        done();
      });
    });

    it('validates a username', function(done){
      userData.testUserMissingUsername.validate(function(err) {
        assert.equal(err.errors.username, 'Path \`username\` is required.');
        done();
      });
    });

    it('validates a short username', function(done){
      userData.testUserShortUsername.validate(function(err) {
        assert.equal(err.errors.username, 'Invalid \`username\`.');
        done();
      });
    });

    it('validates a long username', function(done){
      userData.testUserLongUsername.validate(function(err) {
        assert.equal(err.errors.username, 'Invalid \`username\`.');
        done();
      });
    });

    it('validates a password', function(done){
      userData.testUserMissingPassword.validate(function(err) {
        assert.equal(err.errors.password, 'Path \`password\` is required.');
        done();
      });
    });

    it('validates a short password', function(done){
      userData.testUserShortPassword.validate(function(err) {
        assert.equal(err.errors.password, 'Invalid \`password\`.');
        done();
      });
    });

    it('validates a long password', function(done){
      userData.testUserLongPassword.validate(function(err) {
        assert.equal(err.errors.password, 'Invalid \`password\`.');
        done();
      });
    });

  });

describe("Storage", function() {

  it('creates a user', function(done){
    userData.testUserOK.save(userData.testUserOK, function(err, user) {
      assert.equal(err, null);
      assert.equal(user.username, userData.testUserOK.username);
      done();
    });
  });

  it('finds the user by id', function(done){
   User.findUserByUsername(userData.testUserOK.username, function(err, user) {
    assert.equal(err, null);
    assert.equal(user.username, userData.testUserOK.username);
    done();
  });
 });

  it('deletes a user', function(done){
   User.findOneAndRemove({username : userData.testUserOK.username}, function(err) {
    assert.equal(err, null);
    done();
  });
 });

  it('checks that the deleted user doesnt exist', function(done){
   User.findUserByUsername(userData.testUserOK.username, function(err, user) {
    assert.equal(err, null);
    assert.equal(user, null);
    done();
   });
  });
 });
});
