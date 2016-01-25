var express = require('express');
var HTTPStatus = require('http-status');

var menuAPI = function(wagner) {
	var menu = express.Router();

	// Add a menu item
	menu.post('/', wagner.invoke(function(Menu) {
		return function(req, res) {
			if (!req.user) {
				return res.status(HTTPStatus.UNAUTHORIZED).json({ error: "User is not logged in", loginUrl: "http://localhost:3000/auth/instagram" });
			}

			if (!req.body) {
				return res.status(400).json({ error: "Bad data from client." });
			}

			Menu.create(req.body, function(err, menuItem) {
				if (err) {
					return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({ error: err });
				}

				Menu.find({ owner: req.user._id }, function(err, menu) {
					return res.json({ menu: menu });
				});
			});
		};
	}));

	// Get the menu list for the logged-in user
	menu.get('/', wagner.invoke(function(User, Menu) {		

		return function(req, res) {	
			if (!req.user) {
				return res.status(HTTPStatus.UNAUTHORIZED)
					.json({ error: "User is not logged in", loginUrl: "http://localhost:3000/auth/instagram" });
			}

			Menu.find({ owner: req.user._id }, function(err, menu) {
				if(err) return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({ error: err });
				return res.json({ menu: menu });
			});

		};
	}));
	
	// Get a specific menu item by ID
	menu.get('/item/:id', wagner.invoke(function(Menu) {
		return function(req, res) {
			Menu.findOne({ _id: req.params.id }, function(err, item) {
				if(err) { return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({ error: err }); }
				return res.json({ item: item });
			});
		};
	}));

	// Update an specific menu item by ID
	menu.put('/item/:id', wagner.invoke(function(Menu) {
		return function(req, res) {
			if(!req.user) {
				return res.status(HTTPStatus.UNAUTHORIZED).json({ error: 'User is not logged in'});
			}

			var updatedItem = req.body;

			Menu.update({ _id: updatedItem._id }, updatedItem, function (err, raw) {
	      if(err) { return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({ error: err }); }

	      // Update OK, now reponse the updated item
	      Menu.findOne({ _id: updatedItem._id }, function(err, item) {
	      	if(err) { return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({ error: err }); }
	      	return res.json({ item: item });
	      });
	    });
		};
	}));

	// Remove an specific menu item by ID
	menu.delete('/item/:id', wagner.invoke(function(Menu) {
		return function(req, res) {
			if(!req.user) {
				return res.status(HTTPStatus.UNAUTHORIZED).json({ error: 'User is not logged in'});
			}

			Menu.remove({ _id: req.params.id }, function (err) {
	      if(err) { return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({ error: err }); }

	      // Deleted OK, now reponse the updated menu
	      Menu.find({ owner: req.user._id }, function(err, menu) {
	      	if(err) { return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({ error: err }); }
	      	return res.json({ menu: menu });
	      });
	    });
		};
	}));

	return menu;
};

module.exports = menuAPI;