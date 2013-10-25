var mongoose = require('mongoose'),
	User = mongoose.model('User');

module.exports.index = function(req, res) {
	res.render('../views/index.ejs');
}

module.exports.showUser = function(req, res) {
	User.find().where('encodedId').equals(req.session.passport.user.id).findOne(
		function(err, user) {
			if (err) {
				res.send(500);
				return;
			}

			res.render('../views/phone.ejs', {
				phoneNumber: user.phoneNumber,
				message: ''
			});
		}
	);
}

module.exports.saveUser = function(req, res) {
	User.findOneAndUpdate(
		{
			encodedId: req.session.passport.user.id
		},
		{
			phoneNumber: req.body.phoneNumber
		},
		null,
		function(err, user) {
			if (err) {
				res.send(500);
				return;
			}

			res.render('../views/phone.ejs', {
				phoneNumber: user.phoneNumber,
				message: "saved!"
			});
		}
	);
}