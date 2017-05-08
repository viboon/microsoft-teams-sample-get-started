const restify = require('restify');
const builder = require('botbuilder');
const CookieParser = require('restify-cookies');

process.env.ENVIRONMENT = (process.env.ENVIRONMENT) ? process.env.ENVIRONMENT : 'cloud';
process.env.BOT_APP_ID = (process.env.BOT_APP_ID) ? process.env.BOT_APP_ID : '[bot app id]';
process.env.BOT_SECRET = (process.env.BOT_SECRET) ? process.env.BOT_SECRET : '[bot app secret]';
process.env.NOTIFY_APP_ID = (process.env.NOTIFY_APP_ID) ? process.env.NOTIFY_APP_ID : '[notifications only bot app id]';
process.env.NOTIFY_SECRET = (process.env.NOTIFY_SECRET) ? process.env.NOTIFY_SECRET : '[notifications only bot secret]';
process.env.AUTH_CLIENT_ID = (process.env.AUTH_CLIENT_ID) ? process.env.AUTH_CLIENT_ID : '[auth client ID]';
process.env.AUTH_CLIENT_SECRET = (process.env.AUTH_CLIENT_SECRET) ? process.env.AUTH_CLIENT_SECRET : '[auth client secret]';

var server = restify.createServer();
server.use(restify.queryParser());
server.use(CookieParser.parse);

server.listen(process.env.port || process.env.PORT || 3998, () => {
	console.log(`Started Sample App`);
});

server.get(/\/static\/?.*/, restify.serveStatic({
    directory: __dirname 
}));

var c = new builder.ChatConnector({ 
	appId: process.env.BOT_APP_ID, 
	appPassword: process.env.BOT_SECRET
});

var b = new builder.UniversalBot(c);

var bot = require('./bot/bot.js');
bot.init(server, c, b);
bot.start_listening();

var compose = require('./compose/compose.js');
compose.init(server, c, b);
compose.start_listening();

var notifications = require('./notifications/notifications.js');
notifications.init(server);
notifications.start_listening();

var connector = require('./connector/connector.js');
connector.init(server);
connector.start_listening();

var tabs = require('./tabs/tabs.js');
tabs.init(server);
tabs.start_listening();

var auth = require('./auth/auth.js');
auth.init(server);
auth.start_listening();
