/* jshint node: true */
'use strict';

var express = require('express');
var User = require('../models/user');
var router = new express.Router();

router.get('/', function(req, res) {
	if (!req.isAuthenticated()) {
        res.redirect('/users/nologin');
    }
    if (req.user.isAdmin === false) {
       	req.flash('error_messages', ['You are not an administrator']);
        res.redirect('/restaurants');   
    }

	User.getUserListExceptCurrent(req.user.username, function(err,users){
		if (err) {
			res.send(err + ' / There was a problem adding the information to the database.');
		} else {
			console.log(users);
	    	res.render('admin/manage_users', { title: 'Manage Users', userList: users.sort()});
	    }
	});

});

module.exports = router;
