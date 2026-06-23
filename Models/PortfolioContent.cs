namespace portfolio.Models
{
    public class PortfolioContent
    {
        public AboutSection About { get; set; } = new();
        public List<Project> Projects { get; set; } = new();
        public List<Education> Education { get; set; } = new();
    }

    public class AboutSection
    {
        public string Name { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Bio { get; set; } = string.Empty;
        public string[] Skills { get; set; } = Array.Empty<string>();
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Location { get; set; }
        public string? Picture { get; set; }
        public SocialLinks Social { get; set; } = new();
    }

    public class SocialLinks
    {
        public string Github { get; set; } = string.Empty;
        public string Linkedin { get; set; } = string.Empty;
        public string? Twitter { get; set; }
    }
}
