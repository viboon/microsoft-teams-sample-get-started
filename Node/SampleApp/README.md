# Teams Sample app for Node.js
Thank you for your interest in Microsoft Teams developer samples!
These samples offer some limited functionality against mock data. Each sample exercises the full richness of the Microsoft Teams platform capabilities, including bots, tabs, connectors, and compose extensions. Additionally, full manifest.json examples are included to show you how to package and side load them into Teams. 
**For more information on developing apps for Microsoft Teams, please review the Microsoft Teams [developer documentation](https://msdn.microsoft.com/en-us/microsoft-teams/index).**
## Code Highlights
The sideloadable packages are located in the apps folder. You should be able to simply sideload these to any team. These versions of the packages point to our cloud hosted node js code.

* Bot.zip: contains a manifest with a bot. Ask it for help. This also contains tabs, connector, and compose extensions plus the home screen.
* Notify.zip: contains the same manifest as above but it is a notifications only bot
* TabAuth.zip: contains the same manifest as above but the tabs require authentication.
## Prerequisites
* An [Office 365 account with access to Microsoft Teams](https://msdn.microsoft.com/en-us/microsoft-teams/setup).
* This sample is built using [Node.js](https://nodejs.org/). Download and install the recommended version if you don't already have it.

### Setting up:
Clone the repo, then type: “npm install” then “node app.js”.

If you want to run locally:
1. If creating your own bot, register it at https://dev.botframework.com
2. If creating a tab authenticated via OAuth, register it at https://apps.dev.microsoft.com (or the app provider of your choice).
3. In app.js update the process.env variables so you can point this app to your own bots and tabs.

### App Personal Screen
When the app is sideloaded, it will start appearing the the "Apps" flyout on the left app bar. Clicking on the app name in the flyout will open up the App's personal experience. For this sample app there are two static tabs set up: My Tasks and About.

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
Creating, updating and configuring tabs is supported in this app.  Add "auth=1" as a query parameter tab URLs to turn on the authentication flow, which signs you in to Azure AD and gets your display name from Microsoft Graph.

### Compose Extensions
Sample code for compose extensions exists in the "compose" folder. This will show you how to create a queriable service for compose extensions

## More Information
For more information about getting started with Teams, please review the following resources:
- Review [Getting Started with Teams](https://msdn.microsoft.com/en-us/microsoft-teams/setup)
- Review [Getting Started with Bot Framework](https://docs.microsoft.com/en-us/bot-framework/bot-builder-overview-getstarted)
- Review [Testing your bot with Teams](https://msdn.microsoft.com/en-us/microsoft-teams/botsadd)
## Feedback
We welcome your feedback! [Here's how to send us yours](https://msdn.microsoft.com/en-us/microsoft-teams/feedback).
## Microsoft Open Source Code of Conduct
This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
## Contributing
This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). Please read [Contributing](contributing.md) for details on our code of conduct, and the process for submitting pull requests to us.
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments. 
## Versioning
We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/officedev/microsoft-teams-sample-get-started/tags).
## License
This project is licensed under the MIT License - see the [License](LICENSE) file for details.
## Copyright
Copyright (c) 2017 Microsoft Corporation. All rights reserved.