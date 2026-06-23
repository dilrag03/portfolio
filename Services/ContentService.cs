using System.Text.Json;
using portfolio.Models;

namespace portfolio.Services
{
    public class ContentService
    {
        public AboutSection About { get; } = new();
        public List<Project> Projects { get; } = new();
        public List<Education> Education { get; } = new();

        public ContentService(IWebHostEnvironment env)
        {
            try
            {
                var webRoot = env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                var dataPath = Path.Combine(webRoot, "data", "content.json");
                if (!File.Exists(dataPath))
                    return;

                var json = File.ReadAllText(dataPath);
                var content = JsonSerializer.Deserialize<PortfolioContent>(json, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (content?.About is not null)
                {
                    About.Name = content.About.Name;
                    About.Title = content.About.Title;
                    About.Bio = content.About.Bio;
                    About.Skills = content.About.Skills;
                    About.Email = content.About.Email;
                    About.Phone = content.About.Phone;
                    About.Location = content.About.Location;
                    About.Picture = content.About.Picture;
                    About.Social = content.About.Social;
                }

                if (content?.Projects is not null)
                    Projects.AddRange(content.Projects);

                if (content?.Education is not null)
                    Education.AddRange(content.Education);
            }
            catch
            {
                // expose empty defaults if loading fails
            }
        }
    }
}
