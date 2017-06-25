const faker = require('faker');

// Convenience method to create a Hero card. Takes in an instance of BotBuilder and returns an attachment of type HeroCard
module.exports.createHeroCard = function (builder) {
	return new builder.HeroCard()
		.title(getTitle())
		.subtitle(`Assigned to: ${getName()}`)
		.text(faker.fake("{{lorem.paragraph}}"))
		.images([builder.CardImage.create(null, `${process.env.BASE_URI}/static/img/image${Math.floor(Math.random() * 9) + 1}.png`)])
		.buttons([
			builder.CardAction.openUrl(null, 'http://www.microsoft.com', 'Microsoft'),
			builder.CardAction.openUrl(null, 'https://products.office.com/en-us/microsoft-teams/group-chat-software', 'Teams'),
			builder.CardAction.openUrl(null, 'http://www.bing.com', 'Bing')
		]);
}

// Convenience method to create a Thumbnail card. Takes in an instance of BotBuilder and returns an attachment of type ThumbnailCard
module.exports.createThumbnailCard = function (builder) {
	return new builder.ThumbnailCard()
		.title(getTitle())
		.subtitle(`Assigned to: ${getName()}`)
		.text(faker.fake("{{lorem.paragraph}}"))
		.images([
			builder.CardImage.create(null, `${process.env.BASE_URI}/static/img/image${Math.floor(Math.random() * 9) + 1}.png`)
		])
		.buttons([
			builder.CardAction.openUrl(null, 'http://www.microsoft.com', 'Microsoft'),
			builder.CardAction.openUrl(null, 'https://products.office.com/en-us/microsoft-teams/group-chat-software', 'Teams'),
			builder.CardAction.openUrl(null, 'http://www.bing.com', 'Bing')
		]);
}

// Generates random names
const names = ['Evangelina Gallagher', 'Jess Lamontagne', 'Darlene Solis', 'Linda Riley', 'Simone Suarez', 'Alfonso Troy', 'Gabriel Hendon'];
function getName() { return names[Math.floor(Math.random() * names.length)]}
module.exports.getName = getName; 

// Generates random task titles
const titles = ['Create new tenant', 'Add new team members', 'Hire two new developers', 'Interview design candidates', 'Set up the project', 'Decide on project tools', 'Assign new tasks', 'Generate new leads', 'Meet with clients', 'Meet with the press', 'Sleep'];
function getTitle() { return titles[Math.floor(Math.random() * titles.length)]}
module.exports.getTitle = getTitle;