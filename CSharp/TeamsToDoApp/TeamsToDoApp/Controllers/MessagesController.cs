using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using Newtonsoft.Json;
using TeamsToDoApp.Utils;
using Bogus;
using System.Collections.Generic;
using System;

namespace TeamsToDoApp
{
    [BotAuthentication]
    public class MessagesController : ApiController
    {

        /// <summary>
        /// POST: api/Messages
        /// Receive a message from a user and reply to it
        /// </summary>
        public async Task<HttpResponseMessage> Post([FromBody]Activity activity)
        {

            if (activity.Type == ActivityTypes.Message)
            {
                await Conversation.SendAsync(activity, () => new Dialogs.RootDialog());
            }
            else if (activity.Type == ActivityTypes.Invoke)
            {
                var invokeResponse = GetInvokeResponse(activity);
                return Request.CreateResponse<InvokeResponse>(HttpStatusCode.OK, invokeResponse);
            }
            else
            {
                HandleSystemMessage(activity);
            }
            var response = Request.CreateResponse(HttpStatusCode.OK);
            return response;
        }

        private InvokeResponse GetInvokeResponse(Activity activity)
        {
            InvokeResponse response = null;

            var invoke = activity as IInvokeActivity;
            if (invoke.Name == ComposeExtensionQuery.InvokeActivityName)
            {
                var query = JsonConvert.DeserializeObject<ComposeExtensionQuery>(invoke.Value.ToString());
                if (query.CommandId == null || query.Parameters == null)
                {
                    return null;
                }
                if (query.CommandId == "searchCmd")
                {
                    // query.Parameters has the parameters sent by client

                    var results = new ComposeExtensionResult()
                    {
                        AttachmentLayout = "list",
                        Type = "result",
                        Attachments = new List<InvokeResponseAttachment>(),
                    };
                    for (var i = 0; i < 5; i++)
                    {
                        var invokeResponseAttachment = new InvokeResponseAttachment(this.GenerateThumbnailCard().ToAttachment());
                        
                        results.Attachments.Add(invokeResponseAttachment);
                    }

                    response = new InvokeResponse()
                    {
                        InputExtension = results
                    };
                }
            }
            else
            {
                // Handle other types here
            }

            return response;
        }

        private ThumbnailCard GenerateThumbnailCard()
        {
            var faker = new Faker();
            var random = new Random();

            return new ThumbnailCard()
            {
                Title = faker.Commerce.ProductName(),
                Subtitle = $"Assigned to {faker.Name.FirstName()} {faker.Name.LastName()}",
                Text = faker.Lorem.Sentence(),
                Images = new List<CardImage>()
                {
                    new CardImage()
                    {
                        Url = $"https://teamsnodesample.azurewebsites.net/static/img/image{random.Next(1, 9)}.png",
                    }
                }
            };
        }

        private Activity HandleSystemMessage(Activity message)
        {
            if (message.Type == ActivityTypes.DeleteUserData)
            {
                // Implement user deletion here
                // If we handle user deletion, return a real message
            }
            else if (message.Type == ActivityTypes.ConversationUpdate)
            {
                // Handle conversation state changes, like members being added and removed
                // Use Activity.MembersAdded and Activity.MembersRemoved and Activity.Action for info
                // Not available in all channels
            }
            else if (message.Type == ActivityTypes.ContactRelationUpdate)
            {
                // Handle add/remove from contact lists
                // Activity.From + Activity.Action represent what happened
            }
            else if (message.Type == ActivityTypes.Typing)
            {
                // Handle knowing tha the user is typing
            }
            else if (message.Type == ActivityTypes.Ping)
            {
            }

            return null;
        }
    }
}