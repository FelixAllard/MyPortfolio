using Microsoft.AspNetCore.Identity;

namespace PortfolioAPI.Data;

public class ApplicationUser : IdentityUser
{
    public bool IsAdmin { get; set; }
    public List<Comment> Comments { get; set; } = new List<Comment>();
    
}