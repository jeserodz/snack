var mongoose = require('mongoose');

module.exports = function(wagner) {
	mongoose.connect('mongodb://localhost/foodstalker');

	wagner.factory('db', function() {
		return mongoose;
	});

	wagner.factory('User', function() {
		var User = mongoose.model('User', require('./user'), 'users');
		return User;
	});

	wagner.factory('Menu', function() {
		var Menu = mongoose.model('Menu', require('./menu'), 'menus');
		return Menu;
	});
};