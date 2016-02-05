module.exports = function(app) {
	app.directive('navbarCustomMenu', function() {
		return {
			templateUrl: '../templates/navbar-custom-menu.html'
		};
	});

	// app.directive('fsSidebar', function() {
	// 	return {
	// 		templateUrl: '../templates/fs-sidebar.html'
	// 	};
	// });

	// app.directive('fsFooter', function() {
	// 	return {
	// 		templateUrl: '../templates/fs-footer.html'
	// 	};
	// });

};