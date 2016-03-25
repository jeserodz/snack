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
require('./routes')(app);
