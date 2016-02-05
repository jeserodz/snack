module.exports = function(app) {

	app.controller('MainController', function($scope, $state, User) {

		// Check if User is logged-in
		User.get(function(err, user) { 
			// If not logged-in, go to login page
			if(err) {
				console.log(err);
				return $state.go('login');
			}

			// If logged-in, check user type
			else if (user) {
				console.log(user);
				$scope.user = user;
				if($scope.user.type == 'restaurant') {
					// Load the restaurant dashboard
					return $state.go('dashboard.general');
				}
				if($scope.user.type == 'customer') {
					// Loan the customers view
					return $state.go('app.general');
				}
			};
		});
	});


	app.controller('DashboardController', function($scope, $http, $state, User, Menu) {
		
	});

	app.controller('MenuCtrl', function($scope, $http, $state, Provider, Menu) {

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
	});

	app.controller('MenuAddCtrl', function($scope, $http, $state, Provider, Menu) {
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
				else if($scope.addIndex + 1 == $scope.feed.medias.length)
					$scope.addIndex = 0;
			}
			if(direction == -1) {
				if($scope.addIndex - 1 >= 0)
					$scope.addIndex--;
				else if($scope.addIndex - 1 < 0)
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
				visible: true,
				timesOrdered: 0,
				owner: $scope.user._id,
				references: [media.link] // This property stores unique URLs for posts
			};

			$http.post('/api/menu', menuItem).success(function(response) {
				if(response.error)
					return console.log(error);

				// Update user menu client-side
				$scope.user.data.menu = response.menu;

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

	app.controller('MenuAddExistingCtrl', function($scope, $http, $state, Provider, Menu) {
		//If user has not loaded the Add Item screen, go there...
		if (!$scope.$parent.feed) 
			return $state.go('dashboard.menu.add');

		// Get the Feed item index
		$scope.feedItem = $scope.feed.medias[$state.params.media];

		// Get menu items
		Menu.get(function(err, menu) {
			if(err) return console.log(err);
			$scope.menu = menu;
		});

		// addPicturetoItem
		// 	takes the index of the item on the menu to add the picture
		$scope.addPicturetoItem = function(menuItemIndex) {
			// get the item object from the menu
			var menuItem = $scope.menu[menuItemIndex];
			// push the image url and the link url (from the Provider feed)
			menuItem.pictures.push($scope.feedItem.images.standard_resolution.url);
			menuItem.references.push($scope.feedItem.link);
			// update menu item in db
			Menu.updateItem(menuItem, function(err, item) {
				if(err) console.log(err);
				if(item) {
					// If update successfull, go to item details view
					$state.go('dashboard.menu.item', { 'id': item._id });
				}
			});
		}
	});

	app.controller('MenuItemCtrl', function($scope, $http, $state, $location, $timeout, Menu) {

		// Read item ID in the URL and load from DB
		Menu.getItem($state.params.id, function(error, item) {
			if(error) console.log(error);
			$scope.item = item;
		});

		$scope.location = $location.url();
		console.log($scope.location);

		// This var is used for loding spinner state
		$scope.loading;

		// Hide item and update in DB
		$scope.hideItem = function(item) {
			$scope.loading = true;
			item.visible = false;
			Menu.updateItem(item, function(error, item) {
				if(error) return console.log(error);
				$scope.item = item;
				$scope.loading = false;
			});
		};

		// Show item and update in DB
		$scope.showItem = function(item) {
			$scope.loading = true;
			item.visible = true;
			Menu.updateItem(item, function(error, item) {
				if(error) return console.log(error);
				$scope.item = item;
				$scope.loading = false;
			});
		};

		// Delete item and update in DB
		$scope.deleteItem = function(item) {
			$scope.loading = true;
			Menu.deleteItem(item._id, function(error, menu) {
				if(error) return console.log(error);
				// Update user menu
				$scope.$parent.user.data.menu = menu;
				// Timeout needed because bootstrap modal is slow to dissapear
				$timeout(function() {
					$scope.loading = false;
					$state.go('dashboard.menu')
				}, 1000);
			});
		};
	});

}