const builder = require("botbuilder");
const faker = require('faker');
const utils = require('../utils/utils.js');

var c;
var bot;
var server;

function start_listening() {

	this.server.post('api/bot', this.c.listen());

	// Make sure to listen to the on invoke call. This is what triggers the compose extension
	this.c.onInvoke((msg, callback) => {

		var v = msg.value;

		if (!v.commandId || !v.parameters) return;

		var results;

		if (v.commandId === "searchCmd") {
			results = generateResults();
		};

		callback(null, results, 200);

	});
}

function generateResults(){
	var results = {
		composeExtension:{
			attachmentLayout: 'list',
			type: 'result',			
		}
	}

	var attachments = [];
	for(var i = 0; i < 5; i++){
		attachments.push(generateResultAttachment());
	}

	results.composeExtension.attachments = attachments;
	return results;
}

function generateThumbnail(){
	return {
		contentType: 'application/vnd.microsoft.card.thumbnail',
		content: {
			title: utils.getTitle(),
			subtitle: `Assigned to ${utils.getName()}`,
			text: faker.fake('{{lorem.sentence}}'),
			images: [
				{
					url: `https://teamsnodesample.azurewebsites.net/static/img/image${Math.floor(Math.random() * 9) + 1}.png`
				}
			]
		}
	}
}

function generateResultAttachment(){
	var attachment = generateThumbnail();
	attachment.preview = generateThumbnail();
	return attachment;
}

module.exports.init = function(server, connector, bot) {
	this.server = server;
	this.c = connector;
	this.b = bot;
	return this;
}

module.exports.start_listening = start_listening;