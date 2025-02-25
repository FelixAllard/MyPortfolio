namespace PortfolioAPI.Model;

using System.ComponentModel.DataAnnotations;

public class CommentRequest
{
    [Required(ErrorMessage = "User is required.")]
    public string User { get; set; }

    [Required(ErrorMessage = "Comment is required.")]
    public string Comment { get; set; }
}
