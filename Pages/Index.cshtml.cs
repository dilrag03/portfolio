using Microsoft.AspNetCore.Mvc.RazorPages;
using portfolio.Models;
using portfolio.Services;

namespace portfolio.Pages
{
    public class IndexModel : PageModel
    {
        private readonly ContentService _content;

        public AboutSection About { get; private set; } = new();
        public List<Project> Projects { get; private set; } = new();
        public List<Education> Education { get; private set; } = new();

        public IndexModel(ContentService content)
        {
            _content = content;
        }

        public void OnGet()
        {
            About = _content.About;
            Projects = _content.Projects;
            Education = _content.Education;
        }
    }
}
