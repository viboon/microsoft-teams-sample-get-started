const restify = require('restify');
const builder = require('botbuilder');
const CookieParser = require('restify-cookies');

process.env.ENVIRONMENT = 'cloud';

// If running in cloud, hostname should be available as env variables, otherwise configure it locally.
console.log(process.env.WEBSITE_HOSTNAME);
if (!process.env.WEBSITE_HOSTNAME) {
	process.env.WEBSITE_HOSTNAME = 'https://9cd00130.ngrok.io';
}
if (!process.env.ClientId) {
  process.env.ClientId = 'd64c574f-6cc3-420d-95eb-b0694147315d';
}
if (!process.env.ClientSecret) {
  process.env.ClientSecret = 'nbqbrobggifsw6rOrBdkFqW';
}

var server = restify.createServer();
server.use(restify.queryParser());
server.use(CookieParser.parse);
server.use(restify.bodyParser())

server.listen(process.env.port || process.env.PORT || 3998, () => {
	console.log(`Started ToDo App`);
});

server.get(/\/static\/?.*/, restify.serveStatic({
    directory: __dirname 
}));

var c = new builder.ChatConnector({ 
	appId: (process.env.ENVIRONMENT === 'local') ? '[local app id]' : 'd812b620-006e-406a-99e4-93d670f91748', 
	appPassword: (process.env.ENVIRONMENT === 'local') ? '[local app id]' : '664Zv3Q2GJe6DawSmeAHVfq'});
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

var graph = require('./graph/graph.js');
graph.init(server);
graph.start_listening();
