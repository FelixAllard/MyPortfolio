using System.Diagnostics;
using System.Diagnostics.CodeAnalysis;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioAPI.Data;
using PortfolioAPI.Model;

namespace PortfolioAPI.Controllers;
[ApiController]
[Route("api/[controller]")]
public class CommentController: ControllerBase
{
    public readonly ApplicationDbContext _context;

    private readonly ILogger<CommentController> _logger;

    public CommentController(ApplicationDbContext context,ILogger<CommentController> logger)
    {
        _logger = logger;
        _context = context;
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<Comment>>> GetCommentsOnPost([FromRoute]int id)
    {
        var username = User.FindFirstValue(ClaimTypes.Name);
        List<Comment> comments;
        if (username != null)
        {
            comments = await _context.Comments.ToListAsync();
            //.Where(c => c.PostId == id && c.Status == CommentStatus.Approved || c.Status == CommentStatus.Unapproved && c.UserName == username )

        }
        else
        {
            comments = await _context.Comments
                .Where(c => c.PostId == id && c.Status == CommentStatus.Approved )
                .ToListAsync();
        }
        
        return Ok(comments);
    }
    // [HttpGet("og/{id}")]
    // [Authorize]
    // public async Task<ActionResult<IEnumerable<Comment>>> GetCommentsUnApprovedOnPost([FromRoute]int id)
    // {
    //     var username = User.FindFirstValue(ClaimTypes.Name);
    //     
    //     List<Comment> comments;
    //     
    //     if (username == null)
    //     {
    //         return Unauthorized("You are not logged in");
    //     }
    //     var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == username);
    //     if(!user.IsAdmin)
    //         return Unauthorized("You are not admin");
    //
    //     comments = await _context.Comments
    //         .Where(c => c.PostId == id && c.Status == CommentStatus.Unapproved )
    //         .ToListAsync();
    //     return Ok(comments);
    // }

    [HttpPut("add/{id}")]
    [Authorize]
    public async Task<ActionResult<Comment>> PutComment([FromRoute] int id)
    {
        // Get the authenticated user's username
        var userName = User.FindFirstValue(ClaimTypes.Name);

        if (userName == null)
        {
            return Unauthorized("User is not authenticated.");
        }
        var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == userName);
        if (user == null)
            return Unauthorized("User is not authenticated.");
        if (!user.IsAdmin)
        {
            return Unauthorized("You are not an administrator.");
        }

        // Find the comment that needs to be updated
        var existingComment = await _context.Comments.FindAsync(id);

        if (existingComment == null)
        {
            return NotFound("Comment not found.");
        }

        existingComment.Status = CommentStatus.Approved;

        _context.Comments.Update(existingComment);
        await _context.SaveChangesAsync();

        return Ok(existingComment);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<ActionResult<Comment>> DeleteComment([FromRoute] int id)
    {
        
        var userName = User.FindFirstValue(ClaimTypes.Name);

        if (userName == null)
        {
            return Unauthorized("User is not authenticated.");
        }
        var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == userName);
        if (!user.IsAdmin)
        {
            return Unauthorized("You are not an administrator.");
        }

        // Find the comment that needs to be updated
        var existingComment = await _context.Comments.FindAsync(id);

        if (existingComment == null)
        {
            return NotFound("Comment not found.");
        }

        // Ensure the authenticated user is the owner of the comment
        if (existingComment.UserName != userName)
        {
            return Forbid("You do not have the right to delete this comment!"); // Prevent users from modifying others' comments
        }

        existingComment.Status = CommentStatus.Deleted;

        _context.Comments.Update(existingComment);
        await _context.SaveChangesAsync();

        return Ok(existingComment);
    }
    [Authorize]
    [HttpPut("/api/status/{id}")]
    public async Task<ActionResult<Comment>> ChangeStatusComment([FromRoute]int id, [FromBody]int status)
    {
        Console.WriteLine("hello");
        var userName = User.FindFirstValue(ClaimTypes.Name);

        if (userName == null)
        {
            return Unauthorized("User is not authenticated.");
        }
        var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == userName);
        if (!user.IsAdmin)
        {
            return Unauthorized("You are not an administrator.");
        }

        // Find the comment that needs to be updated
        var existingComment = await _context.Comments.FindAsync(id);

        if (existingComment == null)
        {
            return NotFound("Comment not found.");
        }
        
        existingComment.Status = (CommentStatus)Enum.GetValues(typeof(CommentStatus)).GetValue(status);

        _context.Comments.Update(existingComment);
        await _context.SaveChangesAsync();

        return Ok(existingComment);
    }

    
    [HttpPost]
    
    public async Task<ActionResult<Comment>> PostComment([FromBody]CommentRequest commentRequest)
    {
        // _logger.LogInformation("This is a log message to the console.");
        //
        // // Access userId and userName directly from the JWT claims
        // var userName = User.FindFirstValue(ClaimTypes.Name); // Automatically available
        //
        // if (userName == null)
        // {
        //     return Unauthorized("User is not authenticated or invalid ID format.");
        // }
        //
        // // If you want to retrieve the user's full details (only necessary if needed for something else)
        // var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == userName);
        //
        // if (user == null)
        // {
        //     return NotFound("User not found");
        // }

        // Map data and proceed
        Comment commentAwaitingCreation = new Comment();
        commentAwaitingCreation.Text = commentRequest.Comment;
        commentAwaitingCreation.PostId = 0;
        commentAwaitingCreation.UserName = commentRequest.User;  // Could use the username from token
        commentAwaitingCreation.Status = CommentStatus.Unapproved;
        commentAwaitingCreation.Date = DateTime.Now;
    
        _context.Comments.Add(commentAwaitingCreation);
    
        await _context.SaveChangesAsync();

        return Ok(commentAwaitingCreation);
    }

    
}