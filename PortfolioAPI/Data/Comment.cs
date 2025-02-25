using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PortfolioAPI.Data;

public class Comment
{
    
    [Key]
    public int Id { get; set; }
    public string UserName { get; set; }
    public int PostId { get; set; }
    public string Text { get; set; }
    public DateTime Date { get; set; }
    public CommentStatus Status { get; set; }
    
    
}