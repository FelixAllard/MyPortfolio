using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioAPI.Data;

namespace PortfolioAPI.Controllers;
[ApiController]
[Route("api/[controller]")]
public class SkillController : ControllerBase
{
    public readonly ApplicationDbContext _context;

    private readonly ILogger<CommentController> _logger;

    public SkillController(ApplicationDbContext context,ILogger<CommentController> logger)
    {
        _logger = logger;
        _context = context;
    }
    [HttpGet("{tool}")]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<Skill>>> GetSkills([FromRoute] bool? tool)
    {
        if(tool == null)
            return Ok(await _context.Skills.ToListAsync());
        if (tool == true)
        {
            return await _context.Skills.Where(skill =>skill.Tool).ToListAsync();
        }
        else
        {
            return await _context.Skills.Where(skill =>!skill.Tool).ToListAsync();
        }
        
    }

    [HttpPost("")]
    [Authorize]
    public async Task<ActionResult<Skill>> PostSkill([FromBody]Skill skill)
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
        _context.Skills.Add(skill);
        await _context.SaveChangesAsync();

        return Ok(skill);
    }
    [HttpPut("{id}")]
    [Authorize]
    public async Task<ActionResult<Skill>> PutSkill([FromRoute]int id, [FromBody]Skill skill)
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

        Skill? skillToUpdate = await _context.Skills.FirstOrDefaultAsync(s => s.Id == id);
        
        if (skillToUpdate == null)
            return NotFound("Skill not found.");
        skillToUpdate.Name = skill.Name;
        skillToUpdate.icon_name = skill.icon_name;
        skillToUpdate.Tool= skill.Tool;
        await _context.SaveChangesAsync();
        return Ok(skill);
    }
    [HttpDelete("{id}")]
    [Authorize]
    public async Task<ActionResult<Skill>> DeleteSkill([FromRoute]int id)
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

        Skill? skillToUpdate = await _context.Skills.FirstOrDefaultAsync(s => s.Id == id);
        if(skillToUpdate == null)
            return NotFound("Skill not found.");
        _context.Skills.Remove(skillToUpdate);
        await _context.SaveChangesAsync();
        return Ok("Skill deleted.");
    }
        
    
    
}