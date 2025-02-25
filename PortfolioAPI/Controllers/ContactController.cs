using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioAPI.Data;

namespace PortfolioAPI.Controllers;
[ApiController]
[Route("api/[controller]")]
public class ContactController : ControllerBase
{
    
    public readonly ApplicationDbContext _context;

    private readonly ILogger<CommentController> _logger;

    public ContactController(ApplicationDbContext context,ILogger<CommentController> logger)
    {
        _logger = logger;
        _context = context;
    }
    [HttpPost("")]
    [AllowAnonymous]
    public async Task<ActionResult<Skill>> PostContact([FromBody]AskingForContact  askingForContact)
    {
        _context.AskingForContacts.Add(askingForContact);
        await _context.SaveChangesAsync();
        return Ok(askingForContact);
    }
    [HttpGet("")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllContacts()
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
        return Ok(await _context.AskingForContacts.ToListAsync());
    }
    [HttpDelete("{id}")]
    [Authorize]
    public async Task<ActionResult<Comment>> DeleteContact([FromRoute] int id)
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
        var existingComment = await _context.AskingForContacts.FindAsync(id);

        if (existingComment == null)
        {
            return NotFound("Contact not found.");
        }
        

        _context.AskingForContacts.Remove(existingComment);
        await _context.SaveChangesAsync();

        return Ok(existingComment);
    }
}