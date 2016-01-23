module.exports = function(app) {

	// User service for the User API endpoint
	app.factory('User', ['$http', function($http) {
		// Return the User service methods
		return {
			get: function(callback) {
				$http.get('/api/user/me').success(function(response) {
					if(response.error) { return callback(response.error, null) }
					if(response.user) { return callback(null, response.user) };
				}); // end of API request
			} // end of get() method
		};
	}]);

	// Provider service for the Provider API endpoint
	app.factory('Provider', ['$http', function($http) {
		// Return the Provider service methods
		return {
			feed: function(callback) {
				$http.get('/api/provider/feed').success(function(response) {
					if(response.error) { return callback(response.error, null) }
					if(response.feed) { return callback(null, response.feed) };
				}); // end of API request
			} // end of feed() method
		};
	}]);

	// Menu service for the Menu API endpoint
	app.factory('Menu', ['$http', function($http) {
		// Return the Menu service methods
		return {
			get: function(callback) {
				$http.get('/api/menu').success(function(response) {
					if(response.error) { return callback(response.error, null) }
					if(response.menu) { return callback(null, response.menu) };
				}); // end of API request
			}, // end of get() method
			post: function(menuItem, callback) {
				$http.post('/api/menu', menuItem).success(function(response) {
					if(response.error) { return callback(response.error, null) }
					if(response.menu) { return callback(null, response.menu) };
				});
			}
		};
	}]);

};