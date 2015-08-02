/* jshint node: true */
'use strict';

var assert = require('assert');
var mongoose = require('mongoose');
var root_hooks = require('../root_hooks.js');
var restaurantModel = require('../../models/restaurant');
var restaurantData = require('../data/restaurant.js');
var Restaurant = mongoose.model('Restaurant');

describe('Restaurant', function () {

  describe("Validation", function() {

    it('validates a restaurant id', function(done){
      restaurantData.testRestaurantMissingRestaurantId.validate(function(err) {
        assert.equal(err.errors.restaurant_id, 'Restaurant ID cannot be blank.');
        done();
      });
    });

    it('validates a restaurant name', function(done){
      restaurantData.testRestaurantMissingRestaurantName.validate(function(err) {
        assert.equal(err.errors.name, 'Restaurant Name cannot be blank.');
        done();
      });
    });

    it('validates a restaurant cuisine', function(done){
      restaurantData.testRestaurantMissingCuisine.validate(function(err) {
        assert.equal(err.errors.cuisine, 'Restaurant Cuisine cannot be blank.');
        done();
      });
    });

    it('validates a restaurant borough', function(done){
      restaurantData.testRestaurantMissingBorough.validate(function(err) {
        assert.equal(err.errors.borough, 'Restaurant Borough cannot be blank.');
        done();
      });
    });

  });

  describe('Storage', function () {

   it('creates a new restaurant', function(done){
    restaurantData.testRestaurantOK.save(restaurantData.testRestaurantOK, function(err,restaurant) {
      assert.equal(err, null);
      done();
    });
  });

   it('retrieves a restaurant', function(done){
     Restaurant.findRestaurantById(restaurantData.testRestaurantOK.restaurant_id, function(err, restaurant) {
       assert.equal(err, null);
       assert.equal(restaurant.restaurant_id, restaurantData.testRestaurantOK.restaurant_id);
       done();
     });
   });

   it('adds a new comment', function(done){
    Restaurant.addComment(restaurantData.testRestaurantOK.restaurant_id, restaurantData.testComment1, function(err) {
      assert.equal(err, null);
      done();
    });
  });

   it('adds a new comment', function(done){
    Restaurant.addComment(restaurantData.testRestaurantOK.restaurant_id, restaurantData.testComment2, function(err) {
      assert.equal(err, null);
      done();
    });
  });


   it('retrieves comments', function(done){
    Restaurant.findRestaurantById(restaurantData.testRestaurantOK.restaurant_id, function(err, restaurant) {
      assert.equal(err, null);
      assert.equal(restaurant.grades.length, 2);
      done();
    });
  });

   it('removes a restaurant', function(done){
     Restaurant.findOneAndRemove({restaurant_id : restaurantData.testRestaurantOK.restaurant_id}, function(err) {
      assert.equal(err, null);
      done();
    });
   });

   it('checks that the deleted restaurant doesnt exist', function(done){
     Restaurant.findRestaurantById(restaurantData.testRestaurantOK.restaurant_id, function(err, restaurant) {
       assert.equal(err, null);
       assert.equal(restaurant, null);
       done();
     });
   })
 });
});