module.exports = {
	production: {
		db: 'TODO', // MongoDB connection string, ex: mongodb://db-user:db-password@mongo.onmodulus.net:27017/1234567
		fitbitClientKey: 'TODO', // Your Fitbit application information found at https://dev.fitbit.com/apps
		fitbitClientSecret: 'TODO',
		host: 'TODO', // The hostname where this application is available publicly, ex: fitbitexample-9501.onmodulus.net
		twilioAccountSid: 'TODO', // Found on your Twilio account page: https://www.twilio.com/user/account
		twilioAuthToken: 'TODO',
		twilioPhoneNumber: 'TODO' // The Twilio number that SMS will be sent from, ex: +14152363281
	}
};