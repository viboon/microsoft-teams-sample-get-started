using Bogus;
using Microsoft.Bot.Connector;
using System;
using System.Collections.Generic;
using System.Linq;
using TeamsSampleTaskApp.DataModel;
using Microsoft.Bot.Connector.Teams;

namespace TeamsSampleTaskApp.Utils
{
    public static class Utils
    {

        public static TaskItem CreateTaskItem()
        {
            var faker = new Faker();
            return new TaskItem()
            {
                Title = faker.Commerce.ProductName(),
                Description = faker.Lorem.Sentence(),
                Assigned = $"{faker.Name.FirstName()} {faker.Name.LastName()}",
                Guid = Guid.NewGuid().ToString()
            };
        }

    }

    public class TabContext
    {
        public string ChannelId { get; set; }
        public string CanvasUrl { get; set; }
    }

}