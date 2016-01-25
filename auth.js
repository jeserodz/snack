var session = require('express-session');
var passport = require('passport');
var InstagramStrategy = require('passport-instagram');

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

};