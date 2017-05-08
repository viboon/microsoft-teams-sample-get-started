using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using Microsoft.Bot.Connector.Teams;
using Newtonsoft.Json;
using TeamsToDoApp.Utils;
using Bogus;
using System.Collections.Generic;
using System;
using Microsoft.Bot.Connector.Teams.Models;

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
            
            if (activity.Type == ActivityTypes.Message) // If we just received a message, then let Dialogs process it.
            {
                await Conversation.SendAsync(activity, () => new Dialogs.RootDialog());
            }
            else if (activity.Type == ActivityTypes.Invoke) // Received an invoke
            {
                // Determine the response object to reply with
                var invokeResponse = new ComposeExtension(activity).CreateComposeExtensionResponse();

                // Return the response
                return Request.CreateResponse<ComposeExtensionResponse>(HttpStatusCode.OK, invokeResponse);
            }
            else
            {
                HandleSystemMessage(activity);
            }
            var response = Request.CreateResponse(HttpStatusCode.OK);
            return response;
        }

        private ComposeExtensionResponse GetInvokeResponse(Activity activity)
        {
            ComposeExtensionResponse response = null;

            var invoke = activity as IInvokeActivity;

            if (activity.IsComposeExtensionQuery())
            {
                var query = activity.GetComposeExtensionQueryData();
                if (query.CommandId == null || query.Parameters == null)
                {
                    return null;
                }
                if (query.CommandId == "searchCmd") // This is specified in bot manifest
                {
                    // query.Parameters has the parameters sent by client

                    var results = new ComposeExtensionResult()
                    {
                        AttachmentLayout = "list",
                        Type = "result",
                        Attachments = new List<ComposeExtensionAttachment>(),
                    };
                    for (var i = 0; i < 5; i++)
                    {
                        var composeExtensionAttachment = this.GenerateThumbnailCard().ToAttachment().ToComposeExtensionAttachment();
                        
                        results.Attachments.Add(composeExtensionAttachment);
                    }

                    response = new ComposeExtensionResponse()
                    {                        
                        ComposeExtension = results
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