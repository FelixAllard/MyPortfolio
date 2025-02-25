using System.ComponentModel.DataAnnotations;


namespace PortfolioAPI.Data;

public class Skill
{
    [Key]
    public int Id { get; set; }
    public string Name { get; set; }
    public string icon_name { get; set; }
    public bool Tool { get; set; }
    
}