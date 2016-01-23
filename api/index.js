// This module contains all the endpoints of the API
// Each endpoint is handled with a subrouter

var express = require('express');
var HTTPStatus = require('http-status');
var instagram = require('instagram-node').instagram();

var apiContainer = function(wagner) {

	var api = express.Router();

	// User endpoint -> User subrouter
	api.use('/user', require('./user')(wagner));

	// Provider endpoint -> Provider subrouter
	api.use('/provider', require('./provider')(wagner));

	// Menu endpoint -> Menu subrouter
	api.use('/menu', require('./menu')(wagner));

	return api;
}

module.exports = apiContainer;