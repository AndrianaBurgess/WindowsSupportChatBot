var wit = require('node-wit');
var config = require('../config/config.json');

exports.sendWitTextRequest = function(text, callback) {
	console.log("Sending text to Wit.AI: " + text);

	wit.captureTextIntent(config.wit_token, text, function (err, res) {
		if (err) {
			console.log("Error: ", err);
			return callback(err, null);
		}
		else {
			return callback(null, res);
		}
	});
};