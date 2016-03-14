var angular = require('angular');
var uiRouter = require('angular-ui-router');
var ngFileUpload = require('ng-file-upload');

// Initialize AngularJS application
var app = angular.module('FoodStalker', ['ng','ui.router', ngFileUpload]);

// Setup Services
require('./services')(app);

// Setup Controllers
require('./controllers')(app);

// Setup Directives
require('./directives')(app);

// Setup Utils
// AdminLTE event listeners registerer
require('./utils/AdminLTE')();

// Setup Routes
app.config(function($stateProvider, $urlRouterProvider) {
 	//
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/frontpage");
  //
  // Now set up the states
  $stateProvider
    // State for login view
    .state('login', {
      url: "/login",
      templateUrl: "templates/login.html"
    })

    // State for frontpage view
    .state('frontpage', {
      url: "/frontpage",
      templateUrl: "templates/frontpage.html",
      controller: "FrontpageController"
    })

    // States for Restaurant users
    .state('dashboard', {
      url: "/dashboard",
      templateUrl: "templates/dashboard.html",
      controller: 'DashboardController'
    })
        // States for General
        .state('dashboard.general', {
          url: '/general',
          templateUrl: "templates/dashboard.general.html"
        })

        // States for Menu
        .state('dashboard.menu', {
          url: '/menu',
          templateUrl: "templates/dashboard.menu.html",
          controller: 'MenuCtrl'
        })
            // States for adding plates with Instagram
            .state('dashboard.menu.addInstagram', {
              url: '/addinstagram',
              templateUrl: "templates/dashboard.menu.addinstagram.html",
              controller: 'MenuAddInstagramCtrl'
            })
              .state('dashboard.menu.addInstagram.existing', {
                url: '/existing?media',
                templateUrl: "templates/dashboard.menu.addinstagram.existing.html",
                controller: 'MenuAddInstagramExistingCtrl'
              })

            // TODO: States for adding plates locally
            .state('dashboard.menu.addLocal', {
              url: '/addlocal',
              templateUrl: 'templates/dashboard.menu.addlocal.html',
              controller: 'MenuAddLocalCrtl'
            })

            .state('dashboard.menu.item', {
              url: '/item/:id',
              templateUrl: "templates/dashboard.menu.item.html",
              controller: 'MenuItemCtrl'
            })

        // States for Orders
        .state('dashboard.orders', {
          url: '/orders',
          templateUrl: "templates/dashboard.orders.html"
        });
});
