const restify = require('restify');
const builder = require('botbuilder');
const teamsBuilder = require('botbuilder-teams');
const CookieParser = require('restify-cookies');

process.env.TEAMS_APP_ID = (process.env.TEAMS_APP_ID) ? process.env.TEAMS_APP_ID : ''; //This is the Teams App ID from your Manifest
process.env.MICROSOFT_APP_ID = (process.env.MICROSOFT_APP_ID) ? process.env.MICROSOFT_APP_ID : ''; //Bot ID from Bot Framework
process.env.MICROSOFT_APP_PASSWORD = (process.env.MICROSOFT_APP_PASSWORD) ? process.env.MICROSOFT_APP_PASSWORD : ''; //Bot password from Bot Framework
process.env.NOTIFYBOT_APP_ID = (process.env.NOTIFYBOT_APP_ID) ? process.env.NOTIFYBOT_APP_ID : ''; //Bot ID from Bot Framework
process.env.NOTIFYBOT_SECRET = (process.env.NOTIFYBOT_SECRET) ? process.env.NOTIFYBOT_SECRET : ''; //Bot Password from Bot Framework
process.env.AUTH_CLIENT_ID = (process.env.AUTH_CLIENT_ID) ? process.env.AUTH_CLIENT_ID : '[auth client ID]';
process.env.AUTH_CLIENT_SECRET = (process.env.AUTH_CLIENT_SECRET) ? process.env.AUTH_CLIENT_SECRET : '[auth client secret]';
process.env.BASE_URI = (process.env.BASE_URI) ? process.env.BASE_URI : '';  //the host name for your tab

// Setup Restify Server
var server = restify.createServer();
server.use(restify.queryParser());
server.use(CookieParser.parse);
server.use(restify.bodyParser());

server.listen(process.env.port || process.env.PORT || 3978, () => {
	console.log(`Started Sample App`);
});

server.get(/\/static\/?.*/, restify.serveStatic({
    directory: __dirname 
}));

// Create connector
var chatConnector = new teamsBuilder.TeamsChatConnector({ 
	appId: process.env.MICROSOFT_APP_ID, 
	appPassword: process.env.MICROSOFT_APP_PASSWORD
});



//Setup bot
var bot = new builder.UniversalBot(chatConnector);



//Initialize Notification Handler 
var notificationsHandler = require('./notifications/notifications.js');
notificationsHandler.init(server, chatConnector, bot);
notificationsHandler.start_listening();

