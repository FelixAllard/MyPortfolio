using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace PortfolioAPI.Data;

public class Project
{
    [Key]
    public int Id { get; set; }

    [JsonPropertyName("nameEn")]
    public string NameEn { get; set; }

    [JsonPropertyName("nameFr")]
    public string NameFr { get; set; }

    [JsonPropertyName("descriptionEn")]
    public string DescriptionEn { get; set; }

    [JsonPropertyName("descriptionFr")]
    public string DescriptionFr { get; set; }

    [JsonPropertyName("imageLink")]
    public string ImageLink { get; set; }

    [JsonPropertyName("githubLink")]
    public string GithubLink { get; set; }
}