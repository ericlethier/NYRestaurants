var mongoose = require('mongoose');
var restaurantModel = require('../../models/restaurant');
var Restaurant = mongoose.model('Restaurant');

module.exports.restaurant_id = Math.floor(Date.now());
module.exports.testRestaurantOK = new Restaurant({
  restaurant_id : module.exports.restaurant_id,
  name : 'TestRestaurant',
  address : { street : 'TestStreet', zipcode : 'TestZipcode', building : 'TestBuilding' },
  cuisine : 'TestCuisine',
  borough : 'TestBorough'
});

module.exports.testRestaurantMissingRestaurantId = new Restaurant({
  name : 'TestRestaurant',
  address : { street : 'TestStreet', zipcode : 'TestZipcode', building : 'TestBuilding' },
  cuisine : 'TestCuisine',
  borough : 'TestBorough'
});

module.exports.testRestaurantMissingRestaurantName = new Restaurant({
  restaurant_id : module.exports.restaurant_id,
  address : { street : 'TestStreet', zipcode : 'TestZipcode', building : 'TestBuilding' },
  cuisine : 'TestCuisine',
  borough : 'TestBorough'
});

module.exports.testRestaurantMissingCuisine = new Restaurant({
  restaurant_id : module.exports.restaurant_id,
  name : 'TestRestaurant',
  address : { street : 'TestStreet', zipcode : 'TestZipcode', building : 'TestBuilding' },
  borough : 'TestBorough'
});

module.exports.testRestaurantMissingBorough = new Restaurant({
  restaurant_id : module.exports.restaurant_id,
  name : 'TestRestaurant',
  address : { street : 'TestStreet', zipcode : 'TestZipcode', building : 'TestBuilding' },
  cuisine : 'TestCuisine'
});

module.exports.today = new Date();
module.exports.testComment1 = {'grade': 1, 'comment':'Bad', 'date':module.exports.today, 'user':'TestUser'};
module.exports.testComment2 = {'grade': 5, 'comment':'Good', 'date':module.exports.today, 'user':'TestUser'};