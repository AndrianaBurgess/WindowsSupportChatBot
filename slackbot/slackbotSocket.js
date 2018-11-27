var config = require('../config/config.json');
var SlackBot = require('slackbots');

var AssistantV1 = require('watson-developer-cloud/assistant/v1');

// cached slack message
// var appCache = "";
// setAppCache();
// setInterval(setAppCache, 1000 * 60 * 30); // every 30 min

// create a bot
var bot = new SlackBot({
	token: config.slackbot_token,
	name: config.slackbot_name
});

var assistant = new AssistantV1({
	username: "apikey",
	password: config.watson_assistant_password,
	version: '2018-02-16'
});

bot.on('start', function () {
	console.log("Windows Supports BOT INITIALIZED BEEP BOOP");

	bot.on('message', function (data) {
		//DEBUG
		// if(data.type !== 'presence_change' && data.type !== "reaction_added" && data.type !== "user_change" && data.type !== "dnd_updated_user" && data.type !== "user_typing") {
		// 	console.log(JSON.stringify(data, null, 2));
		// }

		if(data.type === "message" && data.subtype !== "bot_message" && data.subtype !== "message_deleted" && data.text.indexOf(config.slackbot_user_id) > -1){
			var message = data.text;
			callWatson(message, intent =>{
				// do something with intent

				//sendMessage("my message", data.channel)

			})
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
		text: msg
	};
	bot.postMessage("", "", messageParams);
}

var sendMessageToWatsonAssistant = function(text, context) {
	var payload = {
		workspace_id: config.watson_assistant_id,
		input: {
			text: text
		},
		context: context
	};
	return new Promise((resolve, reject) =>
		assistant.message(payload, function(err, data) {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		})
	);
};

function callWatson(msg, callback) {
	sendMessageToWatsonAssistant(msg, undefined)
		.then(response1 => {
			console.log(JSON.stringify(response1, null, 2), '\n--------');

			// invoke a second call to assistant
			return callback(response1.intents[0].intent);
		}).catch(function(error){
			console.error(error)
		});
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