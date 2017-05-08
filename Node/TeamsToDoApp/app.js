const restify = require('restify');
const builder = require('botbuilder');
const CookieParser = require('restify-cookies');

process.env.ENVIRONMENT = 'cloud';

var server = restify.createServer();
server.use(restify.queryParser());
server.use(CookieParser.parse);

server.listen(process.env.port || process.env.PORT || 3998, () => {
	console.log(`Started Sample App`);
});

server.get(/\/static\/?.*/, restify.serveStatic({
    directory: __dirname 
}));

/*
var c = new builder.ChatConnector({ 
	appId: (process.env.ENVIRONMENT === 'local') ? '[local app id]' : 'd812b620-006e-406a-99e4-93d670f91748', 
	appPassword: (process.env.ENVIRONMENT === 'local') ? '[local app id]' : '664Zv3Q2GJe6DawSmeAHVfq'});
*/
var c = new builder.ChatConnector({ 
	appId: (process.env.ENVIRONMENT === 'local') ? '[local app id]' : '82cc5668-94fb-4486-a355-620f336b364d', 
	appPassword: (process.env.ENVIRONMENT === 'local') ? '[local app id]' : 'rzPB0jBYPF8UEsUDtOf1iox'});

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
