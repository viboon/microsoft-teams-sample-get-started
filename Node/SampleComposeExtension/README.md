# microsoft-teams-composeExtension-sample
A sample node.js project that leverages full capability of Compose Extensions in Microsoft Teams, including an authentication flow.
It uses Facebook Event as an example, to search for an event, ans insert it as a thumbnail card into the compose box of Teams client.

# Steps to run
1. Register a bot at https://dev.botframework.com/.
2. Update the botId in manifest.json with the app id of the bot registered in the bot framework. Add your host domain to the validDomains array in manifest.json, zip the file and sideload it into Teams client
3. Register a Facebook app at https://developers.facebook.com, and add your host domain to the app settings.
4. Clone/download this project. Update src/config.json with the bot framework app id/password, as well as Facebook client id/secret, and your host domain.
5. Run the following npm command to start the node server:
<br>npm install -g ts-node
<br>npm install -g typescript
<br>npm install
<br>npm start
