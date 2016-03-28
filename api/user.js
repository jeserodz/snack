var express = require('express');
var HTTPStatus = require('http-status');

module.exports = function(wagner) {
  var user = express.Router();

  user.get('/me', function(req, res) {
    if (!req.user) {
      return res.json({ error: "User is not logged in", loginUrl: "http://localhost:3000/auth/instagram" });
    }
    return res.json({user: req.user});
  });

  user.post('/register', wagner.invoke(function(User) {
    return function(req, res) {

      if (!req.body) {
        return res.status(400).json({ error: "Bad data from client." });
      }

      var newUser = {
        username: req.body.username,
        displayName: req.body.displayName,
        password: req.body.password,
        type: 'restaurant',
        picture: 'http://www.bonifaciostraitpilots.eu/Cms_Data/Contents/BSP-en/Media/img/man-icon.png',
        oauth: { provider: 'local' }
      };

      User.create(newUser, function(err, user) {
        if(err) {
          return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({ error: err });
        }
        if(user) {
          return res.json({ user: user });
        }
      });
    };
  }));

  return user;
};
