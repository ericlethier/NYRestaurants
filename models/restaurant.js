/* jshint node: true */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Getters
 */
function getCoordinates(coordinates) {
	console.log(coordinates);
  return coordinates.join(',');
}

/**
 * Setters
 */
function setCoordinates(coordinates) {
  return coordinates.split(',');
}

var RestaurantSchema = new Schema({
	restaurant_id : { type : String, trim : true, index: { unique: true }, required : true},
	name : { type : String, trim : true, required : true},
	address : {
		coord : { type: [Number] , get : getCoordinates, set : setCoordinates },
		street : { type : String, default : '', trim : true},
		zipcode : { type : String, default : '', trim : true},
		building : { type : String, default : '', trim : true}
	},
	borough : { type : String, trim : true, required : true},
	cuisine : { type : String, trim : true, required : true},
	grades : [{
		date : Date,
		grade : { type : Number, min : 1, max : 5},
		comment : String,
		user : String
	}],
	created_at : { type : Date, default : Date.now}
});

/**
 * Validations
 */
RestaurantSchema.path('restaurant_id').required(true, 'Restaurant ID cannot be blank.');
RestaurantSchema.path('name').required(true, 'Restaurant Name cannot be blank.');
RestaurantSchema.path('borough').required(true, 'Restaurant Borough cannot be blank.');
RestaurantSchema.path('cuisine').required(true, 'Restaurant Cuisine cannot be blank.');

/**
* Statics
*/
RestaurantSchema.statics.getLast10Restaurants = function(callback) {
	return this.find().sort('-created_at').limit(10).exec(callback);
};

RestaurantSchema.statics.findRestaurantById = function(restaurant_id, callback) {
	return this.findOne({'restaurant_id': restaurant_id}).exec(callback);
};

RestaurantSchema.statics.getAverageScoreById = function(restaurant_id, callback) {
	return this.aggregate({$match : {restaurant_id: restaurant_id }})
						.unwind('grades')
						.group({_id : { restaurant_id : '$restaurant_id'}, avgGrade : { $avg : '$grades.grade'}})
						.exec(callback);
};

RestaurantSchema.statics.findRestaurantByName = function(restaurant_name, callback) {
	return this.find({name : new RegExp(restaurant_name, 'i')}).sort('name').exec(callback);
};

RestaurantSchema.statics.deleteRestaurantById = function(restaurant_id, callback) {
	return this.findOneAndRemove({'restaurant_id' : restaurant_id}).exec(callback);
};

RestaurantSchema.statics.addComment = function(restaurant_id, grade, callback) {
	return this.update({'restaurant_id': restaurant_id},{'$push': {'grades':grade}}).exec(callback);
};

RestaurantSchema.statics.getCuisineList = function(callback) {
	return this.find().distinct('cuisine').exec(callback);
};


module.exports = mongoose.model('Restaurant', RestaurantSchema);