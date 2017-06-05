
# Microsoft Teams Get Started Sample in C#

This app simulates connection to a project management system and allows users and teams to create, manage and search tasks. The content is randomly generated to simulate what you can do with Teams.  

**For more information on developing apps for Microsoft Teams, please review the Microsoft Teams [developer documentation](https://msdn.microsoft.com/en-us/microsoft-teams/index).**

## Prerequisites
* An [Office 365 account](https://msdn.microsoft.com/en-us/microsoft-teams/setup)  with access to Microsoft Teams
* To view the code, you'll need the latest update of Visual Studio. You can download the community version for free from [visualstudio.com](http://www.visualstudio.com/).

## Code Walkthough
This app simulates connection to a project management system and allows users and teams to create, manage and search tasks. The content is randomly generated to simulate what you can do with Teams. 

### Configuration
* [manifest.json](CSharp/TeamsAppPackages/manifest.json) configures the following components: 
	* bot commands and configurable tab with personal and team scopes
	* static tabs with personal scope
	* connector with team scope
	* compose extension and commands with personal and team scopes
* [web.config](CSharp/TeamsToDoApp/) appSettings connect to the bot if registered

### Components:
* 1:1 conversation bot in a configurable tab with channel-specific simulated content
	* [MessagesController.cs](CSharp/TeamsToDoApp/Controllers/MessagesController.cs) authentication and message activity
	* [RootDialog.cs](CSharp/TeamsToDoApp/Dialogs/RootDialog.cs) interactive chat functionality
* A compose extension to search channel-specific and user-specific simulated content
	* [ComposeExtension.cs](CSharp/TeamsToDoApp/Compose/ComposeExtension.cs) processes an activity and responds with a set of compose extension results

## Testing
For more information about how to configure and test samples, see [Sample applications for the Microsoft Teams Developer Platform](https://msdn.microsoft.com/en-us/microsoft-teams/samples) on MSDN.

## More Information
For more information about getting started with Teams, please review the following resources:
- Review [Getting Started with Teams](https://msdn.microsoft.com/en-us/microsoft-teams/setup)
- Review [Getting Started with Bot Framework](https://docs.microsoft.com/en-us/bot-framework/bot-builder-overview-getstarted)
- Review [Testing your bot with Teams](https://msdn.microsoft.com/en-us/microsoft-teams/botsadd)

## License

This project is licensed under the MIT License - see the [License](LICENSE) file for details.

## Copyright
Copyright (c) 2017 Microsoft Corporation. All rights reserved.