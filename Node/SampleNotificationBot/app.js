'use strict';

const restify = require('restify');
const builder = require('botbuilder');
const teamsBuilder = require('botbuilder-teams');
const CookieParser = require('restify-cookies');

const uuid = require('node-uuid');
const rest = require('restler');
const faker = require('faker');
const utils = require('./utils/utils.js');

var access_token = {}; //Bearer token return by the auth call to the REST API
var rest_endpoint = null; //Endpoint to make REST requests, this is given to us when we start listening to a bot
var tenant_id = {}; //Our current tenant ID, his is given to us when we start listening to a bot
var host = process.env.BASE_URI // Our host endpoint

var addresses = {}; // Place to save bot connections

process.env.TEAMS_APP_ID = (process.env.TEAMS_APP_ID) ? process.env.TEAMS_APP_ID : ''; //This is the Teams App ID from your Manifest
process.env.MICROSOFT_APP_ID = (process.env.MICROSOFT_APP_ID) ? process.env.MICROSOFT_APP_ID : ''; //Bot ID from Bot Framework
process.env.MICROSOFT_APP_PASSWORD = (process.env.MICROSOFT_APP_PASSWORD) ? process.env.MICROSOFT_APP_PASSWORD : ''; //Bot password from Bot  Framework
process.env.BASE_URI = (process.env.BASE_URI) ? process.env.BASE_URI : '';  //the host name for your tab

// Setup Restify Server
var server = restify.createServer();
server.use(restify.queryParser());
server.use(CookieParser.parse);
server.use(restify.bodyParser());

server.listen(process.env.port || process.env.PORT || 3978, () => {
   console.log('%s listening to %s', server.name, server.url); 
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

server.post('api/messages', chatConnector.listen()); // bind our one way bot to /api/messages

bot.dialog("/sendToUser", function (session, args) {

	console.log(`Sending message to user: isImportant=${args.msgImportant}`);
	var quote = faker.fake("{{lorem.sentence}}");
	var msg = new builder.Message(session);

	if (args.msgImportant) {
        msg.channelData = { notification: { alert: 'true' } };
        msg.summary = quote;
    }

	if (args.msgType === 'text') msg.text(quote);
	if (args.msgType === 'hero') msg.addAttachment(utils.createHeroCard(builder));
	if (args.msgType === 'thumb') msg.addAttachment(utils.createThumbnailCard(builder));

	try {
		if (msg.attachments[0]) msg.attachments[0].content.tap = builder.CardAction.openUrl(null, 'http://teams.microsoft.com/l/', 'Open Teams');
	}
	catch (e) {
	}

    session.endDialog(msg);
});

// When a bot is added or removed we get an event here. Event type we are looking for is teamMember added
bot.on('conversationUpdate', (msg) => {

    if (!rest_endpoint) rest_endpoint = msg.address.serviceUrl; // This is the base URL where we will send REST API request		

    //Get the event information using the Teams Extension SDK
    var event = teamsBuilder.TeamsMessage.getConversationUpdateData(msg);

    //We're only parsing MembersAdded event for the sample:
    if (event.eventType != teamsBuilder.TeamEventBase.TeamEventType.MembersAdded) 	return;

    var members = event.membersAdded;

    // Loop through all members that were just added to the team
    for (var i = 0; i < members.length; i++) {

        // See if the member added was our bot
        if (members[i].id.includes(process.env.MICROSOFT_APP_ID)) {


            // We are keeping track of unique addresses so we can send messages to multiple users and channels at the same time
            // Clean up so we don't blow up memory (I know, I know, but still)
            if (addresses.length > 100) {
                addresses = {};
                tenant_id = {};
                access_token = {};
            }

            var botmessage = new builder.Message()
                .address(msg.address)
                .text('Hello, I am a sample app. I am looking for the team members and will shortly send you a message');

            bot.send(botmessage, function (err) { });

            console.log('Sample app was added to the team');
            var tenId = msg.sourceEvent.tenant.id;
            
            getAllMembers(msg).then((ret) => {
                var members = ret;
                console.log('got members');

                // Prepare a message to the channel about the addition of this app. Write convenience URLs so 
                // we can easily send messages to the channel and individually to any user					
                var text = `##Just added the Sample App!! \n Send message to team: `
                text += `[Text](${host}/api/messages/send/team?id=${encodeURIComponent(guid)}), [Important](${host}/api/messages/send/team?id=${encodeURIComponent(guid)}&isImportant=true)`;
                text += ` | [Hero Card](${host}/api/messages/send/team?type=hero&id=${encodeURIComponent(guid)}), [Important](${host}/api/messages/send/team?type=hero&id=${encodeURIComponent(guid)}&isImportant=true)`;
                text += ` | [Thumbnail Card](${host}/api/messages/send/team?type=thumb&id=${encodeURIComponent(guid)}), [Important](${host}/api/messages/send/team?type=thumb&id=${encodeURIComponent(guid)}&isImportant=true)`;
                //addresses[guid] = msg.address;

                function getEndpoint(type, guid, user, isImportant) {
                    return `${host}/api/messages/send/user?type=${encodeURIComponent(type)}&id=${encodeURIComponent(guid)}&user=${encodeURIComponent(user)}&tenant=${encodeURIComponent(tenId)}&isImportant=${encodeURIComponent(isImportant)}`;
                }

                // Loop through and prepare convenience URLs for each user
                text += '\n\n';
                for (var i = 0; i < members.length; i++) {
                    var user = members[i].id;
                    var name = members[i].givenName || null;
                    var guid = uuid.v4();

                    var nameString = (name) ? name : `user number ${i + 1}`;
                    text += `Send message to ${nameString}: `
                    text += `[Text](${getEndpoint('text', guid, user, false)}), `;
                    text += `[Text alert](${getEndpoint('text', guid, user, true)}), `;
                    text += `[Hero](${getEndpoint('hero', guid, user, false)}), ` 
                    text += `[Hero Alert](${getEndpoint('hero', guid, user, true)}), `;
                    text += `[Thumb](${getEndpoint('thumb', guid, user, false)}), `
                    text += `[Thumb Alert](${getEndpoint('thumb', guid, user, true)})`;
                    text += '\n\n';

                    addresses[guid] = JSON.parse(JSON.stringify(msg.address)); // Make sure we mae a copy of an address to add to our addresses array
                    tenant_id[guid] = msg.sourceEvent.tenant.id; // Extracting tenant ID as we will need it to create new conversations
                }

                // Go ahead and send the message
                try {
                    var botmessage = new builder.Message()
                        .address(msg.address)
                        .textFormat(builder.TextFormat.markdown)
                        .text(text);

                    bot.send(botmessage, function (err) {

                    });
                } catch (e) {
                    console.log(`Cannot send message: ${e}`);
                }

            }, (err) => {

            });

        }
    }
});



// Endpoint to send one way messages to the team. If a message is important it will appear on a user's feed
server.get('api/messages/send/team', (req, res) => {


    var address = addresses[decodeURIComponent(req.params.id)];
    var type = (typeof req.params.type === 'string') ? req.params.type : 'text';
    var isImportant = (typeof req.params.isImportant === 'string' && req.params.isImportant === 'true') ? true : false;

    if (!address) {
        res.send('Sorry cannot find your bot, please re-add the app');
        res.end();
        return;
    }

    console.log(`Sending Message to team: isImportant=${isImportant}`);

    try {

        var quote = faker.fake("{{lorem.sentence}}");
        var msg = new builder.Message().address(address);
        if (isImportant) msg.channelData = { notification: { alert: 'true' } };

        if (type === 'text') msg.text(quote);
        if (type === 'hero') msg.addAttachment(utils.createHeroCard(builder));
        if (type === 'thumb') msg.addAttachment(utils.createThumbnailCard(builder));

        if (type === 'text') res.send('Look on MS Teams, just sent: ' + quote);
        if (type === 'hero') res.send('Look on MS Teams, just sent a Hero card');
        if (type === 'thumb') res.send('Look on MS Teams, just sent a Thumbnail card');

        bot.send(msg, function (err) {
            // Return success/failure
            res.status(err ? 500 : 200);
            res.end();
        });
    } catch (e) { }
});

// Endpoint to send one way messages to individual users
server.get('api/messages/send/user', (req, res) => {

    var guid = decodeURIComponent(req.params.id);
    var address = addresses[guid];
    var userId = decodeURIComponent(req.params.user);
    var type = (typeof req.params.type === 'string') ? req.params.type : 'text';
    var isImportant = (typeof req.params.isImportant === 'string' && req.params.isImportant === 'true') ? true : false;

    if (!address) {
        res.send('Sorry cannot find your bot, please re-add the app');
        res.end();
        return;
    }

    if (!userId) {
        res.send('Sorry cannot find your user, please re-add the app');
        res.end();
        return;
    }


    var addr =
    {
        channelId: 'msteams',
        user: { id: userId },
        channelData: {
            tenant: {
                id: tenant_id[guid]
            }
        },
        bot: {
            id: address.bot.id,
            name: address.bot.name
        },
        serviceUrl: address.serviceUrl,
        useAuth: true
    };

    bot.beginDialog(addr,"/sendToUser", { msgType: type, msgImportant: isImportant } );

    console.log(`Sending message to user: isImportant=${isImportant}`);

    if (type === 'text') res.send('Look on MS Teams, just sent text');
    if (type === 'hero') res.send('Look on MS Teams, just sent a Hero card');
    if (type === 'thumb') res.send('Look on MS Teams, just sent a Thumbnail card');
    
    // Return success/failure
    res.status(200);
    res.end();

    
});

///////////////////////////////////////////////////////
//	Helpers and other methods
///////////////////////////////////////////////////////


function getAllMembers(message)
{
    return new Promise((resolve, reject) => {
        var conversationId = message.address.conversation.id;
        var tenId = teamsBuilder.TeamsMessage.getTenantId(message);
        chatConnector.fetchMemberList(
            message.address.serviceUrl,
            conversationId,
            tenId,
            (err, result) => {
                if (err) {
                    console.log('There is some error');
                    reject("Error");
                }
                else 
                {

                    resolve(result);
                }
            }
        );
    });
}