using Bogus;
using Microsoft.Bot.Connector;
using System;
using System.Collections.Generic;
using System.Linq;
using TeamsToDoApp.DataModel;

namespace TeamsToDoApp.Utils
{
    public static class Utils
    {
        // TODO: move to SDK function
        public static string GetTextWithoutMentions(this Activity activity)
        {
            var text = activity.Text;
            if (activity.Entities != null)
            {
                var mentions = activity.Entities.Where(e => e.Type == "mention");
                foreach (var m in mentions)
                {
                    text = text.Replace(m.Properties["text"].ToString(), String.Empty);
                }
                text = text.Trim();
            }
            return text;
        }

        public static TodoItem CreateTodoItem()
        {
            var faker = new Faker();
            return new TodoItem()
            {
                Title = faker.Commerce.ProductName(),
                Description = faker.Lorem.Sentence(),
                Assigned = $"{faker.Name.FirstName()} {faker.Name.LastName()}"
            };
        }

    }

    public class TabContext
    {
        public string ChannelId { get; set; }
        public string CanvasUrl { get; set; }
    }

    // TODO: Use the classes from the SDK
    public class ComposeExtensionParameter
    {
        public string Name { get; set; }
        public string Value { get; set; }
    }

    public class QueryOptions
    {
        public int Skip { get; set; }
        public int Count { get; set; }
    }

    public class ComposeExtensionQuery
    {
        public string CommandId { get; set; }
        public List<ComposeExtensionParameter> Parameters { get; set; }
        public QueryOptions QueryOptions { get; set; }

        public const string InvokeActivityName = "inputExtension/query";
    }


    public class InvokeResponse
    {
        public ComposeExtensionResult InputExtension { get; set; }
    }

    public class ComposeExtensionResult
    {
        public string AttachmentLayout { get; set; }
        public string Type { get; set; }
        public List<InvokeResponseAttachment> Attachments { get; set; }
    }

    public class InvokeResponseAttachment : Attachment
    {
        public Attachment Preview { get; set; }

        public InvokeResponseAttachment()
        {
        }

        public InvokeResponseAttachment(Attachment attachment)
        {
            this.Content = attachment.Content;
            this.ContentType = attachment.ContentType;
            this.ContentUrl = attachment.ContentUrl;
            this.Name = attachment.Name;
            this.ThumbnailUrl = attachment.ThumbnailUrl;

            this.Preview = new Attachment()
            {
                Content = attachment.Content,
                ContentType = attachment.ContentType,
                ContentUrl = attachment.ContentUrl,
                Name = attachment.Name,
                ThumbnailUrl = attachment.ThumbnailUrl,
            };
        }

    }

}