var express = require('express');
var HTTPStatus = require('http-status');

var userAPI = function(wagner) {
	var user = express.Router();

	user.get('/me', function(req, res) {
		if (!req.user) {
			return res.json({ error: "User is not logged in", loginUrl: "http://localhost:3000/auth/instagram" });
		}

		return res.json({ user: req.user });
	});

	return user;
};

module.exports = userAPI;