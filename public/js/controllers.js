module.exports = function(app) {

	app.controller('MainController', function($scope, $state) {
		$scope.user = '';
	});

	app.controller('LoginController', function($scope, $http, $state, User) {
		// Check in API if user is logged in
		User.get(function(err, user) {
			if(err) {
				console.log(err);
			}
			if(user){
				console.log(user);
				return $state.go('dashboard.general');
			}
		});
	});

	app.controller('DashboardController', function($scope, $http, $state, User, Menu) {
		// Check in API if user is logged in
		User.get(function(err, user) {
			if(err) {
				return $state.go('login');
			}
			else {
				$scope.user = user;
			}

			// Check the Menu for restaurants
			if($scope.user.type == 'restaurant') {
				console.log('valid');
				Menu.get(function(err, menu) {
					if(err) {
						return console.log(err);
					}
					else {
						return $scope.user.data.menu = menu;
					}
				});
			}
		});
	});

	app.controller('MenuCtrl', function($scope, $http, $state, Provider, Menu) {

		// Get the social feed for the user
		// The API shall returns posts that are not already part of the user menu
		Provider.feed(function(err, feed) {
			$scope.feed = []; // clear feed
			if(err) {
				console.log(err);
				return $state.go('login');
			}
			if(feed) {
				$scope.feed = feed; 
			}
		});

		// Get the user menu
		// The API returns posts that are not already part of the user menu
		Menu.get(function(err, menu) {
			if(err) {
				console.log(err);
			}
			if(menu) {
				$scope.user.data.menu = menu;
			}
		});

		// Index of selected media for Add Menu Item Modal
		$scope.addIndex;
		$scope.addItemIndex = function(index) {
			$scope.addIndex = index;
		};

		// Change the selected media Index
		$scope.changeModalItem = function(direction) {
			if(direction == 1) {
				if($scope.addIndex + 1 < $scope.feed.medias.length)
					$scope.addIndex++;
				if($scope.addIndex + 1 == $scope.feed.medias.length)
					$scope.addIndex = 0;
			}
			if(direction == -1) {
				if($scope.addIndex - 1 >= 0)
					$scope.addIndex--;
				if($scope.addIndex - 1 < 0)
					$scope.addIndex = $scope.feed.medias.length - 1;
			}
		};

		// Create new Menu item and post to API
		$scope.addMenuItemName;
		$scope.addMenuItemPrice;
		$scope.addMenuItemDesc;
		$scope.createMenuItem = function() {
			var media = $scope.feed.medias[$scope.addIndex];
			var menuItem = {
				name: $scope.addMenuItemName,
				price: $scope.addMenuItemPrice,
				pictures: [media.images.standard_resolution.url],
				description: $scope.addMenuItemDesc,
				timesOrdered: 0,
				owner: $scope.user._id,
				references: [media.link] // This property stores unique URLs for posts
			};

			// if media has caption
			if(media.caption) {
				menuItem.caption = media.caption.text;
			}
			else {
				menuItem.caption = '';
			}

			console.log({menuItem: menuItem});

			$http.post('/api/menu', menuItem).success(function(response) {
				if(response.error)
					return console.log(error);

				// Update user menu client-side
				$scope.user.data.menu = response.menu;
				console.log($scope.user.data.menu);

				// Update feed client-side
				$http.get('/api/provider/feed').success(function(response) {
					$scope.feed = response.feed;
				});

				// Clear Add Menu Item modal fields
				$scope.addMenuItemName = '';
				$scope.addMenuItemPrice = '';
				$scope.addMenuItemDesc = '';
			});
		}; //.createMenuItem()

		// Check add item form requirements
		$scope.addItemMissingFields = true;
		$scope.checkAddItemRequirements = function() {
			if ($scope.addMenuItemName && $scope.addMenuItemPrice && $scope.addMenuItemDesc) {
				$scope.addItemMissingFields = false;
			}
			else {
				$scope.addItemMissingFields = true;
			}
		};//.checkAddItemRequirements()
	});
}