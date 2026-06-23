namespace portfolio.Models
{
    public class Project
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string[] Tags { get; set; } = Array.Empty<string>();
        public string ImageUrl { get; set; } = string.Empty;
        public string GithubUrl { get; set; } = string.Empty;
        public string DemoUrl { get; set; } = string.Empty;
        public string Details { get; set; } = string.Empty;
    }
}
