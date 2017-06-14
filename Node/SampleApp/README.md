# Teams Sample app for Node.js

This app simulates a web-based task management SaaS, and will simulate allowing users to create, manage and search tasks.  All content is randomly generated - no data in the service is actually persisted or consistant from view to view.  

**For more information on developing apps for Microsoft Teams, please review the Microsoft Teams [developer documentation](https://msdn.microsoft.com/en-us/microsoft-teams/index).**

## Prerequisites
* [Microsoft Teams with app sideloading enabled](https://msdn.microsoft.com/en-us/microsoft-teams/setup)
* **[Recommended]** [Visual Studio Code](https://code.visualstudio.com/) or [Visual Studio IDE](https://www.visualstudio.com/vs/) for IntelliSense and debugging.
* **[Optional]** The Bot Framework Emulator. To install the Bot Framework Emulator, download it from [here](https://emulator.botframework.com/). Please refer to [this documentation article](https://github.com/microsoft/botframework-emulator/wiki/Getting-Started) to know more about the Bot Framework Emulator.

>**Note**: some features in the sample require that you [enable Public Developer Preview mode](https://msdn.microsoft.com/en-us/microsoft-teams/publicpreview) in Microsoft Teams.

For more information about how to configure and test our samples, see [Sample applications for the Microsoft Teams Developer Platform](https://msdn.microsoft.com/en-us/microsoft-teams/samples).

## Code Highlights

### Tabs
The Sample app demonstrates simple Configurable Tabs in channels and Static Tabs in personal view.  Add "auth=1" as a query parameter tab URLs to turn on the authentication flow, which signs you in to Azure AD and gets your display name from Microsoft Graph.

### Bots
The simple bot implementation demonstrates a bot in both teams and personal scope.  It will respond to three commands: "create", "find", and "link", and will generate a Welcome message when added to a team.

### Compose Extensions
The same bot implementation shows an example of a simple compose extension, which will allow you to generate random sample tasks in the conversation pane.  Note that "search" is not really enabled since tasks are not persisted.

### Connectors
You can setup the O365 Connector through the add a connector dialog, or you can set up a webhook and use the URL below to trigger messages

To trigger a message just paste this url in any browser:
https://teamsnodesample.azurewebsites.net/api/messages/connector/send?webhook_url=[webhook url]

The triggered message gives you buttons to send yourself more messages.


## More Information

To get more information about how to get started with Teams App development, please review the following resources:
* [Apps in Microsoft Teams](https://msdn.microsoft.com/en-us/microsoft-teams/teamsapps)
* [Getting started with tabs for Microsoft Teams](https://msdn.microsoft.com/en-us/microsoft-teams/tabs)
* [Getting started with Bots for Microsoft Teams](https://msdn.microsoft.com/en-us/microsoft-teams/bots)
* [Getting started with Connectors for Microsoft Teams](https://msdn.microsoft.com/en-us/microsoft-teams/connectors)
* [Compose Extensions](https://msdn.microsoft.com/en-us/microsoft-teams/composeextensions)
* [Packaging](https://msdn.microsoft.com/en-us/microsoft-teams/createpackage) and [Sideloading](https://msdn.microsoft.com/en-us/microsoft-teams/submission) Microsoft Teams apps
* [Microsoft Teams Samples](https://msdn.microsoft.com/en-us/microsoft-teams/samples)

