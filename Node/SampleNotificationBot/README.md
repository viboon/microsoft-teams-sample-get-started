# Teams sample notification bot, node.js

This sample shows a notification, or one-way bot.  This alternative to O365 Connectors utilizes the Bot Framework and all the rich functionality it provides to create a bot service that only pushes information into Microsoft Teams.  While it's easy to add basic conversational support, for some experiences a simple push system is all that is needed, and this will allow your notification service to full leverage the Bot APIs to target users and/or channels, and provide a rich experience utilizing Bot Framework cards.

### About Notification Only bots

A Notification Only bot is created like a normal bot, but in the manifest.json, the `isNotificationOnly` flag to `true` in the `bot` object.

```json
...
"bots": [
    {
        "botId": "b462cfb5-9354-44e3-9419-0220e2421ca4",
        "isNotificationOnly": true,
        "scopes": [
            "team",
            "personal"
        ]
    }
],
...
```

This signals to Microsoft Teams that this is not a bot designed for bi-directional communication; rather, it is a bot designed to only send messages back to a team (`scope:teams`) or an individual user (`scope:personal`).  Notification Only bots should not be addressable in channels, and the personal context will only show "Activities", not "Conversations."


## Prerequisites

The minimum prerequisites to run this sample are:
* Latest Node.js with NPM. Download it from [here](https://nodejs.org/en/download/).
* **[Recommended]** Visual Studio Code for IntelliSense and debugging, download it from [here](https://code.visualstudio.com/) for free.
* **[Optional]** The Bot Framework Emulator. To install the Bot Framework Emulator, download it from [here](https://emulator.botframework.com/). Please refer to [this documentation article](https://github.com/microsoft/botframework-emulator/wiki/Getting-Started) to know more about the Bot Framework Emulator.

For more information on running this application, see [Microsoft Teams Samples](https://msdn.microsoft.com/en-us/microsoft-teams/samples).

## Code Highlights

This code simulates service-level notifications by create deep links to web endpoints used to send channel and direct user messages.  The deep links themselves contain  these endpoints (/send/user and /send/team) along with identifying logic like a GUID for lookup, and user and tenant IDs.

The core logic is triggered by adding the bot to a channel, which sends the `conversationUpdate` event.  This event, when triggered by the bot addition itself, will create a Welcome message containing the deep links to the team channel and to individual team users.  Clicking on the links will launch the browser to those endpoints, and the Node server will process the event and send the appropriate message.

>**Please Note**:  This sample also demonstrates triggering of activity feed notification, which is currently not supported.

## More Information

To get more information about how to get started with Teams App development, please review the following resources:
* [Bots in Microsoft Teams](https://msdn.microsoft.com/en-us/microsoft-teams/bots)
* [Packaging](https://msdn.microsoft.com/en-us/microsoft-teams/createpackage) and [Sideloading](https://msdn.microsoft.com/en-us/microsoft-teams/submission) Microsoft Teams apps
* [Microsoft Teams Samples](https://msdn.microsoft.com/en-us/microsoft-teams/samples)

