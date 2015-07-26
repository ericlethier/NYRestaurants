var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var User = mongoose.model('User');
var multer = require("multer");
var upload = multer({dest:'uploads/'});
var router = new express.Router();

/* GET Login Page */
router.get('/login', function(req, res) {
    res.render('login', { title: 'Login', message: req.flash('error') });
});

/* POST Login Page */ 
router.post('/login', passport.authenticate('local', {
            failureRedirect: '/users/login', failureFlash : true 
        }
    ),   
    function(req, res) {
        req.session.user = req.user; 
        req.flash('success_messages', ['Welcome back ' + req.user.username + '!']);
        res.redirect('/restaurants');   
    }
);

router.get('/nologin', function(req, res) {
    req.logout();
    req.flash('error', 'You need to login first.');
    res.redirect('/users/login');
});

router.get('/logout', function(req, res) {
    req.session.destroy();
    req.logout();
    //console.log(req);
    //req.flash('success_messages', 'You have been logged out.');
    res.redirect('/users/login');
});

router.get('/new', function(req, res) {
    res.render('users/new', { title: 'Register'} );
});

router.post('/new', upload.single('avatar'), function(req, res) {
    //console.dir(req.file.filename);
    //originalname
    var user = new User({ username : req.body.username, email : req.body.email, password : req.body.password });

    User.register(user, req.body.password, 
    function(err, user) {
        if (err) {
            console.log(err);
            return res.render('users/new', { user : user });
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/users/view');
        });
    });
});

router.get('/view', function(req, res) {
    if (!req.isAuthenticated()) {
        res.redirect('/users/nologin');
    }
    res.render('users/view', { title: 'My Profile', user : req.user });
});


module.exports = router;
