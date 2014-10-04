module.exports = {
	production: {
		db: 'mongodb://localhost:27017', // MongoDB connection string, ex: mongodb://db-user:db-password@mongo.onmodulus.net:27017/1234567
		fitbitClientKey: 'c25b4fd7140f4cfc96a304dcf12d6aa4', // Your Fitbit application information found at https://dev.fitbit.com/apps
		fitbitClientSecret: '715cf218b6374522821e22da2e7b69b1',
		host: 'localhost', // The hostname where this application is available publicly, ex: fitbitexample-9501.onmodulus.net
		twilioAccountSid: 'TODO', // Found on your Twilio account page: https://www.twilio.com/user/account
		twilioAuthToken: 'TODO',
		twilioPhoneNumber: 'TODO' // The Twilio number that SMS will be sent from, ex: +14152363281
	}
};