var SSH = require('simple-ssh');
var fs = require('fs');

// not used, but can be used as an example for future ssh commands against the backends.
exports.getLogs = function(testInstance, callback) {
	var ssh = new SSH({
		host: 'machineIP',
		user: 'virtuser',
		key: fs.readFileSync('<your private key file')
	});

	console.log("Logging into test instances backend to get logs for server ys1"+testInstance);
	ssh.exec("<your command>", {
		exit: function(code, stdout, stderr){
			if(code != 0){
				console.log("getLogs returned with code: " + code + "\n Error: " + stderr);
				return callback(stderr, null);
			}
			else {
				console.log("Successfully retrieved backend logs for: " + testInstance);
				return callback(null, stdout);
			}
		}
	}).start();
};