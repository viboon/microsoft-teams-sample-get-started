# Teams Sample app for Node.js
This app simulates connection to a project management system and allows users and teams to create, manage and search tasks. The content is randomly generated to simulate what you can do with Teams.  

**For more information on developing apps for Microsoft Teams, please review the Microsoft Teams [developer documentation](https://msdn.microsoft.com/en-us/microsoft-teams/index).**

## Prerequisites
* An [Office 365 account](https://msdn.microsoft.com/en-us/microsoft-teams/setup)  with access to Microsoft Teams
* To view the code, you'll need the latest update of Visual Studio. You can download the community version for free from [visualstudio.com](http://www.visualstudio.com/).
* This sample requires that you have Teams in Developer Preview mode. In Teams, click the Profile icon, click About, and click Developer Preview. 

## Configuration
The sideloadable packages are located in the apps folder. You should be able to simply sideload these to any team. These versions of the packages point to our cloud hosted node js code.
* [Bot.zip](/Node/SampleApp/apps/bot.zip): contains a manifest with a bot. Ask it for help. This also contains tabs, connector, and compose extensions plus the home screen.
* [Notify.zip](/Node/SampleApp/apps/notify.zip): contains the same manifest as above but it is a notifications only bot
* [TabAuth.zip](/Node/SampleApp/apps/tabAuth.zip): contains the same manifest as above but the tabs require authentication.

Sideload the desired package. See [Sideloading your app in a team](https://msdn.microsoft.com/en-us/microsoft-teams/sideload) for details.
Clone the repo, then type: “npm install” then “node app.js”.

## Testing
For more information about how to configure and test samples, see [Sample applications for the Microsoft Teams Developer Platform](https://msdn.microsoft.com/en-us/microsoft-teams/samples) on MSDN.

## Code Walkthrough
### App Personal Screen
When the app is sideloaded, it will start appearing the the "Apps" flyout on the left app bar. Clicking on the app name in the flyout will open up the App's personal experience. For this sample app there are two static tabs set up: My Tasks and About.

### Connectors
You can setup the connector through the add a connector dialog, or you can set up a webhook and use the URL below to trigger messages

To trigger a message just paste this url in any browser:
https://teamsnodesample.azurewebsites.net/api/messages/connector/send?webhook_url=[webhook url]

The triggered message gives you buttons to send yourself more messages…this should be fun.

### Bots
The bot implemented here responds to three commands: "create", "find", and "link". Create pretends to create a new card, and find pretends to find an existing card. Link you have to give it a tab name for a Tab from this app and it will generate a deep link

### Notifications
Notifications are implemented through the bot framework. But really all you need is an app ID and password. For this example, adding the app to a team generates a new message to that channel with links to send more notifications to that channel, and it also shows how to send individual notifications for each member of the channel

### Tabs
Creating, updating and configuring tabs is supported in this app.  Add "auth=1" as a query parameter tab URLs to turn on the authentication flow, which signs you in to Azure AD and gets your display name from Microsoft Graph.

### Compose Extensions
Sample code for compose extensions exists in the "compose" folder. This will show you how to create a queriable service for compose extensions

## License

This project is licensed under the MIT License - see the [License](LICENSE) file for details.

## Copyright
Copyright (c) 2017 Microsoft Corporation. All rights reserved.

