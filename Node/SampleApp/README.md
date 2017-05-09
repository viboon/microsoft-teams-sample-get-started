# Teams sample app for node.js

Included in this project is sample code for available features in Microsoft Teams

## The Node App

### Setting up:
Clone the repo, then type: “npm install --save” then “node app.js”.

If you want to run locally there’s one thing to do:
1. Register your bot(s) at https://dev.botframework.com
2. In app.js update the process.env variables so you can point this app to your own bots

### App Personal Screen
When the app is sideloaded it will start appearing the the "Apps" flyout on the left app bar. Clicking on the app name in the flyout will open up the App's personal experience. For this sample app there are two static tabs set up: My Tasks and About.

### Connectors
You can setup the connector through the add a connector dialog, or you can set up a webhook and use the URL below to trigger messages

To trigger a message just paste this url in any browser:
https://teamsnodesample.azurewebsites.net/api/messages/connector/send?webhook_url=[webhook url]

The triggered message gives you buttons to send yourself more messages…this should be fun.

### Bots:
The bot implemented here responds to three commands: "create", "find", and "link". Create pretends to create a new card, and find pretends to find an existing card. Link you have to give it a tab name for a Tab from this app and it will generate a deep link

### Notifications:
Notifications are implemented through the bot framework. But really all you need is an app ID and password. For this example, adding the app to a team generates a new message to that channel with links to send more notifications to that channel, and it also shows how to send individual notifications for each member of the channel

### Tabs
Creating, updating and configuring tabs is supported in this app

### Compose Extensions
Sample code for compose extensions exists in the "compose" folder. This will show you how to create a queriable service for compose extensions

## The packages

The sideloadable packages are located in the apps folder. You should be able to simply sideload these to any team. 

These versions of the packages point to our cloud hosted node js code
* Bot.zip: contains a manifest with a bot. Ask it for help. This also contains tabs, connector, and compose extensions plus the home screen. 
* Notify.zip: contains the same manifest as above but it is a notifications only bot
