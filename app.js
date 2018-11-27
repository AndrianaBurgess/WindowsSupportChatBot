var express = require('express');
var app = express();
var http = require('http').Server(app);
var cfenv = require("cfenv");
var appEnv = cfenv.getAppEnv();
var moment = require('moment-timezone');
var bodyParser = require('body-parser');
var engines = require('consolidate');
require('./slackbot/slackbotSocket.js');

console.log('App started on ' + appEnv.bind + ':' + appEnv.port);

// Configure views and html engine.
var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.engine('html', engines.mustache);
app.set('view engine', 'html');

// To be able to parse json
app.use(bodyParser.urlencoded({ extended: true }));
//require("./routes/routes.js")(app);

//start the server
http.listen(appEnv.port, appEnv.bind);