var mongoose = require('mongoose');

// Define User schema
var menuSchema = mongoose.Schema({
	name: {type: String, required: true},
	price: {type: Number, required: true},
	pictures: [{type: String}],
	description: {type: String, required: true},
	visible: Boolean,
	timesViewed: Number,
	timesOrdered: Number,
	owner: {type: mongoose.Schema.ObjectId, ref: "User"},
	references: [{type: String}] // This property stores unique URLs for posts
});

module.exports = menuSchema;
