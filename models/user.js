var mongoose = require('mongoose');

// Define User schema
var userSchema = mongoose.Schema({
	username: {type: String},
	displayName: {type: String},
	type: {type: String, enum: ['customer', 'restaurant']},
	picture: {type: String},
	data: {
		orders: [{ type: mongoose.Schema.ObjectId, ref: 'Order' }],
		friends: [{ type: mongoose.Schema.ObjectId, ref: 'User'}],
		menu: [{ type: mongoose.Schema.ObjectId, ref: 'Menu' }]
	},
	oauth: {
		provider: {type: String},
		id: {type: String},
		accessToken: {type: String}
	}
});

module.exports = userSchema;