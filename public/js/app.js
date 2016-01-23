var angular = require('angular');
var uiRouter = require('angular-ui-router');

// Initialize AngularJS application
var app = angular.module('FoodStalker', ['ng','ui.router']);

// Setup Services
require('./services')(app);

// Setup Controllers
require('./controllers')(app);

// Setup Directives
require('./directives')(app);

// Setup Routes
app.config(function($stateProvider, $urlRouterProvider) {
 	//
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/dashboard/general");
  //
  // Now set up the states
  $stateProvider
    // State for login view
    .state('login', {
      url: "/login",
      templateUrl: "templates/login.html",
      controller: "LoginController"
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
            .state('dashboard.menu.list', {
              url: '/list',
              templateUrl: "templates/dashboard.menu.list.html"
            })
            .state('dashboard.menu.add', {
              url: '/add',
              templateUrl: "templates/dashboard.menu.add.html"
            })

        // States for Orders
        .state('dashboard.orders', {
          url: '/orders',
          templateUrl: "templates/dashboard.orders.html"
        });
});