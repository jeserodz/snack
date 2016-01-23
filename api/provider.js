var express = require('express');
var HTTPStatus = require('http-status');
var instagram = require('instagram-node').instagram();

var providerApi = function(wagner) {

	var provider = express.Router();

	// Feed from Ouath provider (Instagram, Facebook, etc)
	provider.get('/feed', wagner.invoke(function(User, Menu) {

		return function(req, res) {
			// check user is logged in
			if (!req.user) {
				return res.status(HTTPStatus.UNAUTHORIZED)
					.json({ error: "User is not logged in", loginUrl: "http://localhost:3000/auth/instagram" });
			}

			// Check user oauth provider: Instagram 
			if (req.user.oauth.provider == 'instagram') {

				instagram.use({ access_token: req.user.oauth.accessToken });
				instagram.user_self_feed(function(err, medias, pagination, remaining, limit){
					if (err) {
						return res.status(HTTPStatus.INTERNAL_SERVER_ERROR)
							.send(err.body);
					}

					// REMOVE ITEMS THAT ALREADY EXISTS IN THE USER MENU
					Menu.find({ owner: req.user._id }, function(error, menu) {
						if (error) {
							return res.
							status(HTTPStatus.INTERNAL_SERVER_ERROR).
							json({ error: error, description: 'Error while getting user menu'});
						}
						
						menu.forEach(function(item, index, array) { // Each item in the user menu
							item.references.forEach(function(reference, index, array) { // Each reference in the item
								medias.forEach(function(media, index, array) { // Each of the media in instagram
									if(reference == media.link) { // Compare menu item reference with media link
										// If the reference already exists on the menu, 
										//  remove the media from the collection
										medias.splice(index, 1);
									}
								});
							});
						});

						// Convert UTC date to readable date
						medias.forEach(function(media, index, array) {
							media.created_time = new Date(parseInt(media.created_time) * 1000);
							media.created_time = media.created_time.getDate()+"/"+(media.created_time.getMonth()+1)+"/"+media.created_time.getFullYear()
						});

						// Return the API response
						return res.json({
							feed: {
								medias: medias,
								pagination: pagination,
								remaining: remaining,
								limit: limit
							}
						});
					});
				});
			}
		};
	}));

	return provider;
}

module.exports = providerApi;