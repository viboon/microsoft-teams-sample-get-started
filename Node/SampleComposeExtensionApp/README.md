# Teams Sample Compose Extension App for Node.js
Thank you for your interest in Microsoft Teams developer samples!
These samples offer some limited functionality against mock data. Each sample exercises the full richness of the Microsoft Teams platform capabilities, including bots, tabs, connectors, and compose extensions. Additionally, full manifest.json examples are included to show you how to package and side load them into Teams. 
**For more information on developing apps for Microsoft Teams, please review the Microsoft Teams [developer documentation](https://msdn.microsoft.com/en-us/microsoft-teams/index).**
## Code Highlights
This is a sample node.js project that leverages full capability of compose extensions in Microsoft Teams, including an authentication flow. It uses Facebook Event as an example, to search for an event, and insert it as a thumbnail card into the compose box of Teams client.
## Prerequisites
    * An [Office 365 account with access to Microsoft Teams](https://msdn.microsoft.com/en-us/microsoft-teams/setup).
    * This sample is built using [Node.js](https://nodejs.org/). Download and install the recommended version if you don't already have it.

## Steps to run
1. Register a bot at https://dev.botframework.com/.
2. Clone/download this project. Update the botId in manifest.json with the app id of the bot registered in the bot framework. Add your host domain to the validDomains array in manifest.json, zip the file and sideload it into Teams client
3. Register a Facebook app at https://developers.facebook.com, and add your host domain to the app settings.
4. Update src/config.json with the bot framework app id/password, as well as Facebook client id/secret, and your host domain.
5. Run the following npm command to start the node server:
<br>npm install -g ts-node
<br>npm install -g typescript
<br>npm install
<br>npm start

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