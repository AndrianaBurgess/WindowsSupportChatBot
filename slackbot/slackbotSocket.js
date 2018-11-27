var util = require('util');
var config = require('../config/config.json');
var SlackBot = require('slackbots');
var moment = require("moment-timezone");
var ssh = require('../answers/ssh_commands.js');


// cached slack message
// var appCache = "";
// setAppCache();
// setInterval(setAppCache, 1000 * 60 * 30); // every 30 min

// create a bot
var bot = new SlackBot({
	token: config.slackbot_token,
	name: config.slackbot_name
});

bot.on('start', function () {
	console.log("Windows Supports BOT INITIALIZED BEEP BOOP");

	bot.on('message', function (data) {
		//DEBUG
		// if(data.type !== 'presence_change' && data.type !== "reaction_added" && data.type !== "user_change" && data.type !== "dnd_updated_user" && data.type !== "user_typing") {
		// 	console.log(JSON.stringify(data, null, 2));
		// }

		if(data.type === "message" && data.subtype !== "bot_message" && data.subtype !== "message_deleted"){
			var message = data.text;
				console.log(message);
			sendMessage("hello", data.channel)
		}
	});
});

bot.on('close', function () {
	// forever process will restart the app on exit. Having trouble trying to reconnect the websocket, but restarting the app seems to work - so that is what I'm going to do.
	console.log("Websocket connection closed :(");
});

bot.on('error', function (err) {
	console.error("error connecting to slack " + err);
});


function handleRequest(message, callback){
	// Guess what the user wants using Wit.AI
	wit.sendWitTextRequest(message, function(err, response){
		if(err)
			return callback(err,null);
		else {
			handleWitResponse(response, function(err, answer){
				if(err)
					return callback(err,null);
				else
					return callback(null,answer);
			});
		}
	});
}


function sendMessage(msg, channel){
	var messageParams = {
		link_names: 1,
		channel: channel,
		text: "well hello"
	};
	bot.postMessage("", "", messageParams);
}


// function handleWitResponse(witRes, callback){
// 	// null check here for outcomes empty.
// 	var intent = witRes.outcomes[0].intent.toLowerCase();
// 	switch(intent){
//         case 'help':
//             return callback(null, handleHelp());
//             break;
// 		case 'last_user_test_instance':
// 			return callback(null, appCache);
// 			break;
//         case 'refresh_last_user_cache':
//         	setAppCache();
//             return callback(null, handleAck());
//             break;
// 		case 'compliment':
// 			return callback(null, handleCompliment());
// 			break;
// 		case 'insult':
// 			return callback(null, handleInsult());
// 			break;
// 		case 'who_is_current_monitor':
// 			return callback(null, handleWhoIsOnCall());
// 			break;
// 		case 'backend_logs':
// 			handleBackendLogs(witRes, function(message){
// 			   return callback(null, message);
// 			});
// 			break;
// 		case 'hand_or_pocket':
// 			var responses = ["hand", "pocket"];
// 			var handOrPocket = responses[Math.floor(Math.random()*responses.length)];
// 			return callback(null, handOrPocket + " :punk_magician:");
// 		case 'unknown':
// 			return callback(null, handleUnknown());
// 			break;
// 		default:
// 			console.error("Could not recognize intent: " + intent + " from wit response: " + JSON.stringify(witRes, null, 2));
// 	}
// }