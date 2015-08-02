/* jshint node: true */
'use strict';

var express = require('express');
var mongoose = require('mongoose');
var Restaurant = mongoose.model('Restaurant');
var router = new express.Router();

/* GET New Restaurant Page */
router.get('/new', function(req, res) {
    if (!req.isAuthenticated()) {
        res.redirect('/users/nologin');
    }

	Restaurant.getCuisineList(function(err,cuisines){
		if (err) {
			res.send(err + ' / There was a problem adding the information to the database.');
		} else {
			console.log(cuisines);
	    	res.render('restaurants/new', { title: 'Create a new restaurant', cuisines: cuisines.sort()});
	    }
	});
});

/* POST to Add Restaurant Service */
router.post('/new', function(req, res) {
    if (!req.isAuthenticated()) {
        res.redirect('/users/nologin');
    }

    // Get the max restaurant_id
    var restaurant_id = Math.floor(Date.now());
     // Get our form values. These rely on the 'name' attributes
	var newRestaurant = new Restaurant({
		restaurant_id : restaurant_id,
    	name : req.body.name,
	   	address : { street : req.body.street, zipcode : req.body.zipcode, building : req.body.building },
		cuisine : req.body.cuisine,
		borough : req.body.borough
    });
    newRestaurant.save(function(err) {
    	if (err) {
    		res.send('There was a problem adding the information to the database.');
    	} else {
            // If it worked, set the header so the address bar doesn't still say /addrestaurant
            res.location('/restaurants');
            // And forward to success page
            req.flash('success_messages', 'Restaurant ' + req.body.name + ' has been added');
            res.redirect('/restaurants');
        }
    });    
});

/* GET RestaurantList page. */
router.get('/', function(req, res) {
    Restaurant.getLast10Restaurants(function(err, restaurants) {
        res.render('restaurants/list', {title: 'List of restaurants', 
            restaurantlist : restaurants
        });
    });
});


/* GET View Restaurant page. */
router.get('/view/:id', function(req, res) {
    Restaurant.findRestaurantById(req.params.id, function(err1,doc){
        if (err1) {
            // If it failed, return error
            res.send('There was a problem adding the information to the database.');
        }
        else {
        	/* Compute the average grade of the restaurant. */
			Restaurant.getAverageScoreById(req.params.id, function(err2,score) {
				if (err2) {
            		// If it failed, return error
            		res.send('There was a problem adding the information to the database.');
        		}
        		else {
        			var average = -1;
        			console.log(score);
        			if (score.length > 0) {
        				average = Math.round(score[0].avgGrade * 20);
        			}
                    console.log(doc.address.coord);
                    var encoded_address = encodeURIComponent(doc.address.street) + ',' + 'New York+USA';
                    var long_lat = '0,0';
                    //doc.address.loc.coordinates;

                    var google_maps_address = 'https://maps.googleapis.com/maps/api/staticmap?center=' + encoded_address + '&zoom=15&size=400x300&markers=' + long_lat + '&sensor=false';
		            res.render('restaurants/view', {title: doc.name,
        	                                       restaurant : doc, 
                                                   google_maps_address : google_maps_address, 
                                                   average_score : average}
                    );
				}
			});
		}
	});
});


/* POST Search restaurant by name. */
router.post('/search', function(req, res) {
    Restaurant.findRestaurantByName(req.body.search, function(err,docs){
        if (err) {
            // If it failed, return error
            res.send('There was a problem adding the information to the database.');
        }
        else {
	        res.render('restaurants/list', {title: 'Search Results', 
            restaurantlist : docs.sort()});
        }
    });
});

/* GET Drop Restaurant page. */
router.get('/delete/:id', function(req, res) {
    if (!req.isAuthenticated()) {
        res.redirect('/users/nologin');
    }
    Restaurant.deleteRestaurantById(req.params.id, function(err,doc){

        if (err) {
            // If it failed, return error
            res.send('There was a problem adding the information to the database.');
        }
        else {
            // If it worked, set the header so the address bar doesn't still say /addrestaurant
            res.location('/restaurants');
            // And forward to success page
            req.flash('success_messages', 'Restaurant ' + doc.name + ' has been deleted');
            res.redirect('/restaurants');
        }
    });
});

/* GET Add Comment page. */
router.post('/comments/add', function(req, res) {
    if (!req.isAuthenticated()) {
        res.redirect('/users/nologin');
    }

    var restaurant_id = req.body.restaurant_id;
    var comment = req.body.comment;
    var grade = Number(req.body.grade);
    var date = new Date();
    var user = req.session.user.username;

    var comment_obj = {'grade': grade, 'comment':comment, 'date':date, 'user':user};

    Restaurant.addComment(restaurant_id, comment_obj, function(err,doc) {
        if (err) {
            // If it failed, return error
            res.send('There was a problem adding the information to the database.');
        }
        else {
            // If it worked, set the header so the address bar doesn't still say /addrestaurant
            res.location('/restaurants/view/' + restaurant_id);
            // And forward to success page
            res.redirect('/restaurants/view/' + restaurant_id);
        }
    });
});

module.exports = router;
