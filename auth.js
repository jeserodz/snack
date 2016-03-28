var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var InstagramStrategy = require('passport-instagram');
var googleStrategy = require('passport-google-oauth').OAuth2Strategy;

module.exports = function(Config, User, app) {

	// Configure passport
	// - Instagram Strategy
	passport.use(new InstagramStrategy({
	    clientID: Config.INSTAGRAM_CLIENT_ID,
	    clientSecret: Config.INSTAGRAM_CLIENT_SECRET,
	    callbackURL: "http://localhost:3000/auth/instagram/callback"
	  },
	  function(accessToken, refreshToken, profile, done) {
	    User.findOneAndUpdate(
	    	// query by example
	    {
	    	'oauth.id': profile.id
	    },
	    	// update or create user document with latest data
	    {
	    	$set: {
					username: profile.username,
					displayName: profile.displayName,
					type: 'restaurant',
					picture: profile._json.data.profile_picture,
					oauth: {
						provider: 'instagram',
						id: profile.id,
						accessToken: accessToken
					}
				}
	    },
	    	// options: create new if don't exists, return updated version
	    {
	    	'new': true,
	    	upsert: true
	    },
	    function (err, user) {
	      return done(err, user);
	    });
	  }
	));

	// - Google Strategy
	passport.use(new googleStrategy({
			clientID: Config.GOOGLE_CLIENT_ID,
	    clientSecret: Config.GOOGLE_CLIENT_SECRET,
	    callbackURL: "http://localhost:3000/auth/google/callback"
		}, function(accessToken, refreshToken, profile, done) {
			User.findOneAndUpdate(
	    	// query by example
	    {
	    	'oauth.id': profile.id
	    },
	    	// update or create user document with latest data
	    {
	    	$set: {
					username: profile.id, // google dont use username
					displayName: profile.displayName,
					type: 'customer',
					picture: 'http://www.bonifaciostraitpilots.eu/Cms_Data/Contents/BSP-en/Media/img/man-icon.png',
					oauth: {
						provider: 'google',
						id: profile.id,
						accessToken: accessToken
					}
				}
	    },
	    	// options: create new if don't exists, return updated version
	    {
	    	'new': true,
	    	upsert: true
	    },
	    function (err, user) {
	      return done(err, user);
	    });
		}
	));


	// - Local Strategy
	passport.use(new LocalStrategy(function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) {
				console.log(err);
				return done(err);
			}
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (user.password != password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }));

	// passport
	passport.serializeUser(function(user, done) {
	  done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
	  User.findById(id, function(err, user) {
	    done(err, user);
	  });
	});



	// Use session and passport middleware for Express
	app.use(session({
		secret: "foodstalker secret phrase",
		saveUninitialized: false,
		resave: false
	}));
	app.use(passport.initialize());
  app.use(passport.session());



  // Confiure Routes
  app.get('/auth/instagram', passport.authenticate('instagram',
  	{ scope: [
  			'basic',
  			'public_content',
  			'follower_list',
  			'comments',
  			'relationships',
  			'likes']
		}));

	app.get('/auth/instagram/callback',
	  passport.authenticate('instagram', { failureRedirect: '/authFailed' }),
	  function(req, res) {
	    // Successful authentication, redirect home.
	    res.redirect('/');
	  });

	app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

	app.get('/auth/google/callback',
	  passport.authenticate('google', { failureRedirect: '/authFailed' }),
	  function(req, res) {
	    // Successful authentication, redirect home.
	    res.redirect('/');
	  });

	app.post('/auth/local', passport.authenticate('local'), function(req, res) {
		console.log("auth started!!!");
		if(req.user.type === 'restaurant') {
			res.redirect('/#/dashboard');
		}
		else if (res.user.type === 'client') {
			res.redirect('/#/frontpage');
		}
	});

	app.get('/auth/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

};
