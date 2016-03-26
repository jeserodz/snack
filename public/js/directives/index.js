module.exports = function(app) {

	app.directive('fpHeader', function() {
		return {
			templateUrl: '../templates/fp-header.html',
			controller: 'fpHeaderController'
		};
	});

	app.directive('fsHeader', function() {
		return {
			templateUrl: '../templates/fs-header.html'
		};
	});

	app.directive('fsSidebar', function() {
		return {
			templateUrl: '../templates/fs-sidebar.html'
		};
	});

	app.directive('fsFooter', function() {
		return {
			templateUrl: '../templates/fs-footer.html'
		};
	});

};
