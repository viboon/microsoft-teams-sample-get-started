const faker = require('faker');
faker.seed(3998);

/*
	Convenience method to create a Hero card. Takes in an instance of BotBuilder and returns an attachment of type HeroCard
*/
module.exports.createHeroCard = function (builder) {
	return new builder.HeroCard()
		.title('This is a Hero Card')
		.subtitle('Card subtitle')
		.text('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vehicula, risus ac placerat vestibulum, quam metus congue augue, sed placerat elit metus a odio. Suspendisse nec odio in elit bibendum mollis vel eu diam. Integer id mollis orci, sed iaculis nibh. Suspendisse venenatis lacus neque, quis semper arcu tempus sed. Nunc quam augue, pulvinar at eros ac, bibendum ornare metus. Phasellus vitae enim augue.')
		.images([builder.CardImage.create(null, `https://teamsnodesample.azurewebsites.net/static/img/image${Math.floor(Math.random() * 9) + 1}.png`)])
		.buttons([
			builder.CardAction.openUrl(null, 'http://www.microsoft.com', 'Microsoft'),
			builder.CardAction.openUrl(null, 'https://products.office.com/en-us/microsoft-teams/group-chat-software', 'Teams'),
			builder.CardAction.openUrl(null, 'http://www.bing.com', 'Bing')
		]);
}

/*
	Convenience method to create a Thumbnail card. Takes in an instance of BotBuilder and returns an attachment of type ThumbnailCard
*/
module.exports.createThumbnailCard = function (builder) {
	return new builder.ThumbnailCard()
		.title('This is a Thumbnail Card')
		.subtitle('Card subtitle')
		.text('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vehicula, risus ac placerat vestibulum, quam metus congue augue, sed placerat elit metus a odio. Suspendisse nec odio in elit bibendum mollis vel eu diam. Integer id mollis orci, sed iaculis nibh. Suspendisse venenatis lacus neque, quis semper arcu tempus sed. Nunc quam augue, pulvinar at eros ac, bibendum ornare metus. Phasellus vitae enim augue.')
		.images([
			builder.CardImage.create(null, `https://teamsnodesample.azurewebsites.net/static/img/image${Math.floor(Math.random() * 9) + 1}.png`)
		])
		.buttons([
			builder.CardAction.openUrl(null, 'http://www.microsoft.com', 'Microsoft'),
			builder.CardAction.openUrl(null, 'https://products.office.com/en-us/microsoft-teams/group-chat-software', 'Teams'),
			builder.CardAction.openUrl(null, 'http://www.bing.com', 'Bing')
		]);
}

// Creates a random task
module.exports.createTask = function (title) {
	return {
		'title': (title) ? title : faker.fake("{{commerce.productName}}"),
		'description': faker.fake('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vehicula, risus ac placerat vestibulum, quam metus congue augue'),
		'assigned': getName()
	}
}

// Convenience method to strip out @ mentions from bot text
module.exports.getTextWithoutMentions = function (message) {
	var text = message.text;
	if (message.entities) {
		message.entities
			.filter(entity => entity.type === "mention")
			.forEach(entity => {
				text = text.replace(entity.text, "");
			});
		text = text.trim();
	}
	return text;
}

// Generates rich connector card.
module.exports.generateConnectorCard = function () {
	var summary = getName() + ' created a new task';
	var ret = {
		'@type': 'MessageCard',
		'@context': 'http://schema.org/extensions',
		'themeColor': '0076D7',
		'summary': summary,
		'sections': [{
			'activityTitle': summary,
			'activitySubtitle': 'On Project Tango',
			'activityImage': `https://teamsnodesample.azurewebsites.net/static/img/image${Math.floor(Math.random() * 9) + 1}.png`,
			'text': faker.fake('{{lorem.paragraphs}}'),
			'facts': [
				{
					'name': 'Assigned to',
					'value': 'Unassigned'
				}, {
					'name': 'Due date',
					'value': Date().toString()
				},
				{
					'name': 'Status',
					'value': 'Not started'
				}
			],
		}],
		'potentialAction': [
			{
				'@type': 'ActionCard',
				'name': 'Add a comment',
				'inputs': [
					{
						'@type': 'TextInput',
						'id': 'comment',
						'isMultiline': false,
						'title': 'Add a comment here for this task'
					}
				],
				'actions': [
					{
						'@type': 'HttpPOST',
						'name': 'Add comment',
						'target': 'http://...'
					}
				]
			},
			{
				'@type': 'ActionCard',
				'name': 'Set due date',
				'inputs': [
					{
						'@type': 'DateInput',
						'id': 'dueDate',
						'title': 'Enter a due date for this task'
					}
				],
				'actions': [
					{
						'@type': 'HttpPOST',
						'name': 'Save',
						'target': 'http://...'
					}
				]
			},
			{
				'@type': 'ActionCard',
				'name': 'Change status',
				'inputs': [
					{
						'@type': 'MultichoiceInput',
						'id': 'list',
						'title': 'Select a status',
						'isMultiSelect': 'false',
						'style': 'expanded',
						'choices': [
							{ 'display': 'In Progress', 'value': '1' },
							{ 'display': 'Active', 'value': '2' },
							{ 'display': 'Closed', 'value': '3' }
						]
					}
				],
				'actions': [
					{
						'@type': 'HttpPOST',
						'name': 'Save',
						'target': 'http://...'
					}
				]
			}
		]
	}
	return ret;
}

const names = ["Evangelina Gallagher", "Jess Lamontagne", "Darlene Solis", "Linda Riley", "Simone Suarez", "Alfonso Troy", "Gabriel Hendon"];
function getName() {
	return names[Math.floor(Math.random() * names.length)]
}
module.exports.getName = getName; 