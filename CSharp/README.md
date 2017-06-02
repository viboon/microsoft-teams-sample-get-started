
# Microsoft Teams Sample README

Thank you for your interest in Microsoft Teams developer samples!
These samples offer some limited functionality against mock data. Each sample exercises the full richness of the Microsoft Teams platform capabilities, including bots, tabs, connectors, and compose extensions. Additionally, full manifest.json examples are included to show you how to package and side load them into Teams. 

**For more information on developing apps for Microsoft Teams, please review the Microsoft Teams [developer documentation](https://msdn.microsoft.com/en-us/microsoft-teams/index).**

## Code Highlights
This app simulates connection to a project management system and allows users and teams to create, manage and search tasks. The content is randomly generated to simulate what you can do with Teams. 

	* 1:1 conversation bot in a configurable tab with channel-specific simulated content
	* 2 personal tabs with user-specific content
	* A connector with channel-specific simulated content
	* A composed extension to search channel-specific and user-specific simulated content

## Prerequisites
	* An [Office 365 account with access to Microsoft Teams](https://msdn.microsoft.com/en-us/microsoft-teams/setup).
	* This sample is built using C#, so to view the code, you'll need the latest update of Visual Studio. You can download the community version for free from [visualstudio.com](http://www.visualstudio.com/).

### Add the TaskApp tab to Microsoft Teams
1. Download the [TeamsAppPackage](https://github.com/OfficeDev/microsoft-teams-sample-get-started/tree/master/CSharp/TeamsAppPackages/TaskApp.zip) zip file for this sample.
2. In Teams, set yourself to be running the Developer Preview. Select the Profile icon at the bottom-left, click About, and then **Developer (Preview)**.
3. Create a new team for testing, if necessary. Click the Teams icon, then **Add team** at the bottom of the left-hand panel.
4. Click the Teams icon, select the team, click **... (more options)** and then select **View Team**.
5. Click **Apps**. Scroll to the bottom and click **Sideload an app**. If this option isn't displayed, contact your Office 365 Admin to turn it on. 
5. Navigate to the downloaded zip file from step 1 above and select it.
6. Go to any channel in the team.  Click the '+' to the right of the existing tabs.
7. Select your tab from the gallery that appears.
8. Hit Save to add the tab to channel.

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

Please read [Contributing](contributing.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/officedev/microsoft-teams-sample-get-started/tags).

## License

This project is licensed under the MIT License - see the [License](LICENSE) file for details.

## Copyright
Copyright (c) 2017 Microsoft Corporation. All rights reserved.