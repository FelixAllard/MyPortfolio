using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioAPI.Data;

namespace PortfolioAPI.Controllers;
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CommentController: ControllerBase
{
    public readonly ApplicationDbContext _context;

    public CommentController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<IEnumerable<Comment>>> GetCommentsOnPost([FromRoute]int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Unauthorized("User is not authenticated or invalid ID format.");
        }
        var comments = await _context.Comments
            .Where(c => c.PostId == id && c.Status == CommentStatus.Approved || c.Status == CommentStatus.Unapproved && c.UserId == userId )
            .ToListAsync();
        return Ok(comments);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<Comment>> DeleteComment([FromRoute] int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Unauthorized("User is not authenticated or invalid ID format.");
        }
        var comments = await _context.Comments.FindAsync(id);
        if(comments == null)
            return NotFound("Comment not found");
        if (comments.UserId == userId)
            return Unauthorized("You are not the user who created this comment");
        comments.Status = CommentStatus.Deleted;
        return Ok(comments);
    }

    [HttpPost]
    public async Task<ActionResult<Comment>> PostComment([FromBody]Comment comment)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Unauthorized("User is not authenticated or invalid ID format.");
        }
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            return NotFound("User not found");
        }
        Comment commentAwaitingCreation = comment;
        
        commentAwaitingCreation.Status = CommentStatus.Unapproved;
        user.Comments.Add(commentAwaitingCreation);
        return Ok(await _context.SaveChangesAsync());
    }
    
}