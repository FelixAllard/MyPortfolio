using System.ComponentModel.DataAnnotations;

namespace PortfolioAPI.Data;

public class AskingForContact
{
    [Key]
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string Reason { get; set; }
    
    
}