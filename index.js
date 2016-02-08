var express = require('express'),
	session = require('express-session'),
	wagner = require('wagner-core'),
	bodyparser = require('body-parser'),
	HTTPStatus = require('http-status');

// Config
wagner.factory('Config', function() {
	return require('./config.js');
});

// Initialize models
require('./models')(wagner);

var app = express();

// Allow Cross-Origin requests
// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(bodyparser.json());

// Authentication
wagner.invoke(require('./auth'), { app: app });

// API subrouter
app.use('/api', require('./api')(wagner));

// Server front-end
app.use('/', express.static('./public'));

app.listen(3000, function() {
	console.log('Server listening on port 3000');
});
