var env = process.env.NODE_ENV || 'production',
	config = require('./config')[env];

var express = require('express'),
	http = require('http'),
	path = require('path'),
	OAuth = require('oauth'),
	passport = require('passport'),
	mongoose = require('mongoose'),
	FitbitStrategy = require('passport-fitbit').Strategy;

var app = express();

// All environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('TODO Random String: Fitbit is awesome!'));
app.use(express.session());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// Development Environment
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

// Connect to database and initialize models
mongoose.connect(config.db);
require('./models/user');
var User = mongoose.model('User');

// Initialize controllers
var IndexController = require('./controllers/index'),
	FitbitApiController = require('./controllers/fitbit-api'),
	TwilioApiController = require('./controllers/twilio-api');

// Initialize OAuth
passport.serializeUser(function(user, done) {
	console.log("serialize user", user);
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
	console.log("deserialize obj", obj);
	done(null, obj);
});

passport.use(new FitbitStrategy({
		consumerKey: config.fitbitClientKey,
		consumerSecret: config.fitbitClientSecret,
		callbackURL: "http://" + config.host + "/auth/fitbit/callback"
	},
	function(token, tokenSecret, profile, done) {
		// Store the user credentials
		User.update(
			{ encodedId: profile.id },
			{
				encodedId: profile.id,
				accessToken: token,
				accessSecret: tokenSecret
			},
			{ upsert: true },
			function(err, numberAffected) {
				if (err) console.error(err);
				console.log('User updated ' + numberAffected + ' records.');
			}
		);

		// Create a subscription.
		var oauth = new OAuth.OAuth(
			'https://api.fitbit.com/oauth/request_token',
			'https://api.fitbit.com/oauth/access_token',
			config.fitbitClientKey,
			config.fitbitClientSecret,
			'1.0',
			null,
			'HMAC-SHA1'
		);

		oauth.post(
			'https://api.fitbit.com/1/user/-/apiSubscriptions/' + profile.id + '-all.json',
			token,
			tokenSecret,
			null,
			null,
			function (err, data, res){
				if (err) console.error(err);
				console.log("Subscription creation attempt results:", require('util').inspect(data));
				return done(null, profile);
			}
		);
	}
));

app.get('/auth/fitbit', passport.authenticate('fitbit'));

app.get('/auth/fitbit/callback', 
	passport.authenticate('fitbit', { failureRedirect: '/?error=auth_failed' }),
	function(req, res) {
		// Successful authentication, redirect home.
		res.redirect('/phone');
	}
);

// Index and Notification routes
app.get('/', IndexController.index);
app.get('/phone', IndexController.showUser);
app.post('/phone', IndexController.saveUser);
app.post('/notifications', FitbitApiController.notificationsReceived);

// Start the server
http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});