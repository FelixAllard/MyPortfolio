using System.ComponentModel.DataAnnotations;

namespace PortfolioAPI.Data;

public class Project
{
    [Key]
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string GithubLink { get; set; }
    public string publicationLink { get; set; }
    public int HueA { get; set; }
    public int HueB { get; set; }
}