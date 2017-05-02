const rest = require('restler');
const utils = require('../utils/utils.js');

var server;
var host = (process.env.ENVIROMENT === 'local') ? 'http://localhost:3998/' : 'http://teamsnodesample.azurewebsites.net/';

function start_listening() {

    // TODO: Figure out how to register this to teams and not to emails
    this.server.get('api/messages/connector/register', (req, res) => {
        
        // Parse register message from connector, find the group name and webhook url
        var query = req.query;
        var webhook_url = query.webhook_url;
        var group_name = query.group_name;

        if (connectors.length > 100) connectors = {}; //Clean up to not blow up memory on my server :)

        // save the webhook url using groupname as the key
        connectors[group_name] = webhook_url;

        res.send(webhook_url);

        // TODO, when this works hook it up to send a card.
        rest.postJson(webhook_url, {

            text: `A connector for the group ${group_name} has been setup! Please let Luis know so he can set up a proper card`

        }).on('complete', function (data, response) {
            console.log('completed connector setup');
            res.end();
        });
    });

    // This endpoint allows for sending connector messages. It checks if a webhook URL has been passed in first (set up as an incoming webhook)
    // if not it checks if a connector has been registered with us
    this.server.get('api/messages/connector/send', (req, res) => {

        // Handshake and figure out if we already know about this connector config
        var group_name = (typeof req.params.group_name === 'string') ? req.params.group_name : '';
        var type = (typeof req.params.type === 'string') ? req.params.type : 'static';

        // If we don't know about hte connector config, then check if the URL passes a webhook URL
        var webhook_url = (typeof req.params.webhook_url === 'string') ? req.params.webhook_url : null;
        webhook_url = (webhook_url == null) ? ((connectors[group_name]) ? connectors[group_name] : null) : webhook_url;

        // If we don' know about the connector and we don't have a webhook url then fail
        if (!webhook_url) {
            res.send(`A connector for ${group_name} has not been setup`);
            res.end();
        }

        // Generate connector message
        var message = utils.generateConnectorCard();
        res.send(`${webhook_url}`);

        // Post to connectors endpoint so they can route the message properly
        rest.postJson(webhook_url, message).on('complete', function (data, response) {
            console.log(JSON.stringify(data, null, 1));
            console.log(JSON.stringify(response, null, 1));
            console.log('completed connector request');
            res.end();
        });

    });

}

module.exports.init = function (server) {
    this.server = server;
    return this;
}

module.exports.start_listening = start_listening;