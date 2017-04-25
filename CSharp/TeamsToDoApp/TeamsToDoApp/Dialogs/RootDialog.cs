using System;
using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using TeamsToDoApp.Utils;
using System.Linq;
using Microsoft.Bot.Connector.Teams.Models;
using System.Web;
using Newtonsoft.Json;

namespace TeamsToDoApp.Dialogs
{
    [Serializable]
    public class RootDialog : IDialog<object>
    {
        public Task StartAsync(IDialogContext context)
        {
            context.Wait(MessageReceivedAsync);

            return Task.CompletedTask;
        }

        private async Task MessageReceivedAsync(IDialogContext context, IAwaitable<object> result)
        {
            var activity = await result as Activity;

            var text = activity.GetTextWithoutMentions();

            var split = text.Split(' ');

            if (split.Length < 2)
            {
                await SendHelpMessage(context, "I'm sorry, I did not understand you :(");
            }
            else
            {
                var q = split.Skip(1);

                // Parse the command and go do the right thing
                if (split[0].Contains("create") || split[0].Contains("find"))
                {
                    // Send Task Message
                    await SendTodoMessage(context, string.Join(" ", q));
                }
                else if (split[0].Contains("link"))
                {
                    // Create deep link
                    await SendDeeplink(context, activity, string.Join(" ", q));
                }
                else
                {
                    await SendHelpMessage(context, "I'm sorry, I did not understand you :(");
                }
            }

            context.Wait(MessageReceivedAsync);
        }

        private async Task SendTodoMessage(IDialogContext context, string todoItemTitle)
        {
            var todoItem = Utils.Utils.CreateTodoItem();
            todoItem.Title = todoItemTitle;

            string text = "Here's your task: \n\n"
                + "---\n\n"
                + $"**Task Title: ** {todoItem.Title}\n\n"
                + "**Task ID: ** 10\n\n"
                + $"**Task Description: ** {todoItem.Description}\n\n"
                + $"**Assigned To: ** {todoItem.Assigned}\n\n";

            await context.PostAsync(text);
        }

        private async Task SendDeeplink(IDialogContext context, Activity activity, string tabName)
        {
            var teamsChannelData = activity.GetChannelData<TeamsChannelData>();
            var teamId = teamsChannelData.Team.Id;
            var channelId = teamsChannelData.Channel.Id;

            var appId = "88a39b1b-476a-4998-8c51-22dff12741a3s"; // This is the app ID you set up in your manifest.json file.
            var entity = $"todotab-{tabName}-{teamId}-{channelId}"; // Match the entity ID we setup when configuring the tab
            var tabContext = new TabContext()
            {
                ChannelId = channelId,
                CanvasUrl = "https://teams.microsoft.com"
            };

            var url = $"https://teams.microsoft.com/l/entity/{HttpUtility.UrlEncode(appId)}/{HttpUtility.UrlEncode(entity)}?label={HttpUtility.UrlEncode(tabName)}&context={HttpUtility.UrlEncode(JsonConvert.SerializeObject(tabContext))}";

            var text = $"Here's your [deeplink]({url}): \n";
            text += HttpUtility.UrlDecode(url);

            await context.PostAsync(text);
        }

        private async Task SendHelpMessage(IDialogContext context, string firstLine)
        {
            var helpMessage = CreateHelpMessage(firstLine);

            await context.PostAsync(helpMessage);
        }

        private string CreateHelpMessage(string firstLine)
        {
            var text = $"{firstLine} \n\n Here's what I can help you do \n\n"
                + "---\n\n"
                + "* To create a new task, you can type **create** followed by the task name\n\n"
	            + "* To find an existing task, you can type **find** followed by the task name\n\n"
	            + "* To create a deep link, you can type **link** followed by the tab name";

            return text;
        }
    }
}