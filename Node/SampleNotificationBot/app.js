'use strict';

const restify = require('restify');
const builder = require('botbuilder');
const teamsBuilder = require('botbuilder-teams');
const uuid = require('node-uuid');
const faker = require('faker');
const utils = require('./utils/utils.js');




// We are caching addresses in memory, so they can be accessed directly via the endpoints
//  We are basically creating an key/value table of `address` objects, where key = unique guid and value = bot address
//  We then use the guid in the URLs we create below, for lookup in the endpoint calls
var addresses = {}; 

process.env.MICROSOFT_APP_ID = (process.env.MICROSOFT_APP_ID) ? process.env.MICROSOFT_APP_ID : ''; //Bot ID from Bot Framework
process.env.MICROSOFT_APP_PASSWORD = (process.env.MICROSOFT_APP_PASSWORD) ? process.env.MICROSOFT_APP_PASSWORD : ''; //Bot password from Bot  Framework
var host = process.env.BASE_URI = (process.env.BASE_URI) ? process.env.BASE_URI : '';  //the host name our endpoints

// Setup Restify Server
var server = restify.createServer();
server.use(restify.queryParser());
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

//Bind our one way bot to /api/messages
server.post('api/messages', chatConnector.listen()); 

//Default dialog handler:
bot.dialog("/", function(session) {
    session.send("Hello - I'm a simple Notification bot and should not have to answer you.");
});

//This function will be called when the send/user endpoint is hit.
bot.dialog("/sendToUser", function (session, args) {

	console.log(`Sending message to user: isImportant=${args.msgImportant}`);
	var quote = faker.fake("{{lorem.sentence}}");
	var msg = new builder.Message(session);

    //NOTE: Notification Alert currently not supported as of 6/13/2017
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

// When a bot is added or removed we get an event here. Event type we are looking for is teamMember added.
bot.on('conversationUpdate', (msg) => {

     //Get the event information using the Teams Extension SDK
    var event = teamsBuilder.TeamsMessage.getConversationUpdateData(msg);

    //We're only parsing MembersAdded event for the sample:
    if (event.eventType != teamsBuilder.TeamEventBase.TeamEventType.MembersAdded) 	return;

    var members = event.membersAdded;

    // Loop through all members that were just added to the team
    for (var i = 0; i < members.length; i++) {

        // See if the member added was our bot
        if (members[i].id.includes(process.env.MICROSOFT_APP_ID)) {


            if (addresses.length > 100) {
                addresses = {};
            }

            var botmessage = new builder.Message()
                .address(msg.address)
                .text('Hello, I am a sample app. I am looking for the team members and will shortly send you a message');
            bot.send(botmessage, function (err) { });

            //store off tenant for use in the endpoint creation for User messages
            var tenantId = msg.sourceEvent.tenant.id;
            
            getAllMembers(msg).then((ret) => {

                var members = ret;

                //Create endpoint which will be hyperlinks on the message the bot will create
                function getEndpoint(scope, type, guid, user, isImportant) {
                    if (scope === 'user')
                    {
                        return `${host}/api/messages/send/user?type=${encodeURIComponent(type)}&id=${encodeURIComponent(guid)}&user=${encodeURIComponent(user)}&tenant=${encodeURIComponent(tenantId)}&isImportant=${encodeURIComponent(isImportant)}`;
                    } 
                    else 
                    {
                        return `${host}/api/messages/send/team?type=${encodeURIComponent(type)}&id=${encodeURIComponent(guid)}&isImportant=${encodeURIComponent(isImportant)}`;
                    }
                }

                //Create unique key for the team key and store the msg address:
                var guid = uuid.v4();
                addresses[guid] = msg.address;

                // Prepare a message to the channel about the addition of this app. Write convenience URLs so 
                // we can easily send messages to the channel and individually to any user					
                var text = `##Just added the Sample App!! \n Send message to team: `
                text += `[Text](${getEndpoint('team', 'text', guid, null, false)}), `;
                text += `[Text alert](${getEndpoint('team', 'text', guid, null, true)}) | `;
                text += `[Hero](${getEndpoint('team', 'hero', guid, null, false)}), ` 
                text += `[Hero Alert](${getEndpoint('team', 'hero', guid, null, true)}) | `;
                text += `[Thumb](${getEndpoint('team', 'thumb', guid, null, false)}), `
                text += `[Thumb Alert](${getEndpoint('team', 'thumb', guid, null, true)})`;
                text += '\n\n';

                // Loop through and prepare convenience URLs for each user
                for (var i = 0; i < members.length; i++) {
                    //Create a unique key for each user and store the address
                    guid = uuid.v4();
                    addresses[guid] = JSON.parse(JSON.stringify(msg.address)); 

                    var user = members[i].id;
                    var name = members[i].givenName || null;
                    var nameString = (name) ? name : `user number ${i + 1}`;

                    text += `Send message to ${nameString}: `
                    text += `[Text](${getEndpoint('user', 'text', guid, user, false)}), `;
                    text += `[Text alert](${getEndpoint('user', 'text', guid, user, true)}) | `;
                    text += `[Hero](${getEndpoint('user', 'hero', guid, user, false)}), ` 
                    text += `[Hero Alert](${getEndpoint('user', 'hero', guid, user, true)}) | `;
                    text += `[Thumb](${getEndpoint('user', 'thumb', guid, user, false)}), `
                    text += `[Thumb Alert](${getEndpoint('user', 'thumb', guid, user, true)})`;
                    text += '\n\n';
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

// Endpoint to send one way messages to the team
server.get('api/messages/send/team', (req, res) => {

    //Look up the address (id) passed in the Get.
    var address = addresses[decodeURIComponent(req.params.id)];
    if (!address) {
        res.send('Sorry cannot find your bot, please re-add the app');
        res.end();
        return;
    }

    var type = (typeof req.params.type === 'string') ? req.params.type : 'text';
    var isImportant = (typeof req.params.isImportant === 'string' && req.params.isImportant === 'true') ? true : false;

    console.log(`Sending Message to team: isImportant=${isImportant}`);

    try {
        var quote = faker.fake("{{lorem.sentence}}");

        var msg = new builder.Message().address(address);

        //NOTE: Notification Alert currently not supported as of 6/13/2017
        if (isImportant)
        {
            msg.channelData = { notification: { alert: 'true' } };
            msg.summary = quote;
        }

        if (type === 'text') msg.text(quote);
        if (type === 'hero') msg.addAttachment(utils.createHeroCard(builder));
        if (type === 'thumb') msg.addAttachment(utils.createThumbnailCard(builder));

        if (type === 'text') res.send('Look on MS Teams, just sent: ' + quote + ' to team. isImportant=${isImportant}');
        if (type === 'hero') res.send('Look on MS Teams, just sent a Hero card to team. isImportant=${isImportant}');
        if (type === 'thumb') res.send('Look on MS Teams, just sent a Thumbnail card to team. isImportant=${isImportant}');

        bot.send(msg, function (err) {
            // Return success/failure
            res.status(err ? 500 : 200);
            res.end();
        });
    } catch (e) { }
});

// Endpoint to send one way messages to individual users
server.get('api/messages/send/user', (req, res) => {

    //Look up the address (id) passed in the Get.
    var guid = decodeURIComponent(req.params.id);
    var address = addresses[guid];
    if (!address) {
        res.send('Sorry cannot find your bot, please re-add the app');
        res.end();
        return;
    }

    var userId = decodeURIComponent(req.params.user);
    if (!userId) {
        res.send('Sorry cannot find your user, please re-add the app');
        res.end();
        return;
    }

    var tenantId = decodeURIComponent(req.params.tenant);

    var type = (typeof req.params.type === 'string') ? req.params.type : 'text';
    var isImportant = (typeof req.params.isImportant === 'string' && req.params.isImportant === 'true') ? true : false;

    //Construct the address for the new 1:1 message
    var addr =
    {
        channelId: 'msteams',
        user: { id: userId },
        channelData: {
            tenant: {
                id: tenantId
            }
        },
        bot: {
            id: address.bot.id,
            name: address.bot.name
        },
        serviceUrl: address.serviceUrl,
        useAuth: true
    };

    //Trigger the dialog handler to actually display the message.
    bot.beginDialog(addr,"/sendToUser", { msgType: type, msgImportant: isImportant } );

    if (type === 'text') res.send('Look on MS Teams, just sent text to user.  isImportant=${isImportant}');
    if (type === 'hero') res.send('Look on MS Teams, just sent a Hero card to user. isImportant=${isImportant}');
    if (type === 'thumb') res.send('Look on MS Teams, just sent a Thumbnail card to user. isImportant=${isImportant}');

    // Return success/failure
    res.status(200);
    res.end();
});

// This uses the Teams SDK function: fetchMemberList.
function getAllMembers(message)
{
    return new Promise((resolve, reject) => {

        chatConnector.fetchMemberList(
            message.address.serviceUrl,
            message.address.conversation.id,
            teamsBuilder.TeamsMessage.getTenantId(message),
            (err, result) => {
                if (err) 
                {
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