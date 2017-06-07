const restify = require('restify');
const builder = require('botbuilder');

const CookieParser = require('restify-cookies');

process.env.TEAMS_APP_ID = (process.env.TEAMS_APP_ID) ? process.env.TEAMS_APP_ID : ''; //This is the Teams App ID from your Manifest
process.env.BOT_APP_ID = (process.env.BOT_APP_ID) ? process.env.BOT_APP_ID : ''; //Bot ID from Bot Framework
process.env.BOT_SECRET = (process.env.BOT_SECRET) ? process.env.BOT_SECRET : ''; //Bot password from Bot Framework
process.env.NOTIFY_APP_ID = (process.env.NOTIFY_APP_ID) ? process.env.NOTIFY_APP_ID : ''; //Bot ID from Bot Framework
process.env.NOTIFY_SECRET = (process.env.NOTIFY_SECRET) ? process.env.NOTIFY_SECRET : ''; //Bot Password from Bot Framework
process.env.AUTH_CLIENT_ID = (process.env.AUTH_CLIENT_ID) ? process.env.AUTH_CLIENT_ID : '[auth client ID]';
process.env.AUTH_CLIENT_SECRET = (process.env.AUTH_CLIENT_SECRET) ? process.env.AUTH_CLIENT_SECRET : '[auth client secret]';
process.env.HOST = (process.env.HOST) ? process.env.HOST : '[the host name for your application]';

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
var chatConnector = new builder.ChatConnector({ 
	appId: process.env.BOT_APP_ID, 
	appPassword: process.env.BOT_SECRET
});

//Setup bot
var bot = new builder.UniversalBot(chatConnector);

//Initialize bot 
var botHandler = require('./bot/bot.js');
botHandler.init(server, chatConnector, bot);
botHandler.start_listening();

//Initialize ComposeExtension 
var composeHandler = require('./compose/compose.js');
composeHandler.init(server, chatConnector, bot);
composeHandler.start_listening();

//Initialize Notification Handler 
var notificationsHandler = require('./notifications/notifications.js');
notificationsHandler.init(server);
notificationsHandler.start_listening();

//Initialize O365 Connector handler 
var connectorHandler = require('./connector/connector.js');
connectorHandler.init(server);
connectorHandler.start_listening();

//Initialize Tab handler 
var tabsHandler = require('./tabs/tabs.js');
tabsHandler.init(server);
tabsHandler.start_listening();

//Initialize authorization test handler
var authHandler = require('./auth/auth.js');
authHandler.init(server);
authHandler.start_listening();

//Initial Graph API test handler
var graphHandler = require('./graph/graph.js');
graphHandler.init(server);
graphHandler.start_listening();
