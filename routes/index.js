var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var User = require('../models/user');
var router = new express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});


/* GET Show Map page. */
router.get('/showmap', function(req, res) {
    var db = req.db;

    // Set our collection
    var collection = db.get('restaurants');

    // Submit to the DB
    //collection.find({}, {limit:10}, function (err, doc) {
    collection.find({}, {limit:10, fields:{"address.loc.coordinates":1, "_id":0}}, function (err, docs) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
                var coordinates = [];
                for (index in docs) {
                    coordinates.push(docs[index].address.loc);
                }
                var coordinates_str = JSON.stringify(coordinates);
                console.log(coordinates_str);
                res.render('showmap', {points: coordinates});
        }
    });
});

module.exports = router;
