using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioAPI.Data;

namespace PortfolioAPI.Controllers;
[ApiController]
[Route("api/[controller]")]

public class ProjectsController : ControllerBase
{
    public readonly ApplicationDbContext _context;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly UserManager<ApplicationUser> _userManager;
    
    public ProjectsController(
        ApplicationDbContext context,
        SignInManager<ApplicationUser> signInManager, 
        UserManager<ApplicationUser> userManager
        )
    {
        _context = context;
        _signInManager = signInManager;
        _userManager = userManager;
    }
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetProjects()
    {
        return Ok(await _context.Projects.ToListAsync());
    }
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetProjectById([FromRoute]int id)
    {
        return Ok(await _context.Projects.FirstOrDefaultAsync(d => d.Id == id));
    }
    [HttpPost("")]
    [Authorize]
    public async Task<IActionResult> PostProject([FromBody] Project project)
    {
        var userId = User.FindFirstValue(ClaimTypes.Name);
        if (userId == null)
        {
            return Unauthorized("User is not authenticated or invalid ID format.");
        }

        var user = await _userManager.FindByNameAsync(userId);
        if (user == null || !user.IsAdmin)
        {
            return Unauthorized("You are not an administrator. You do not have the right to create projects");
        }

        _context.Projects.Add(project);
        await _context.SaveChangesAsync(); // Save to database

        return Ok(project);
    }
    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> PutProject([FromRoute]int id, [FromBody] Project project)
    {
        var userId = User.FindFirstValue(ClaimTypes.Name);
        if (userId == null)
        {
            return Unauthorized("User is not authenticated or invalid ID format.");
        }

        var user = await _userManager.FindByNameAsync(userId);
        if (user == null || !user.IsAdmin)
        {
            return Unauthorized("You are not an administrator. You do not have the right to update projects");
        }

        // Try to find the project by id
        var projectToUpdate = await _context.Projects.FindAsync(id);
        if (projectToUpdate == null)
        {
            return NotFound("Project not found.");
        }

        // Update the fields
        projectToUpdate.DescriptionEn = project.DescriptionEn;
        projectToUpdate.DescriptionFr = project.DescriptionFr;
        projectToUpdate.NameEn = project.NameEn;
        projectToUpdate.NameFr = project.NameFr;
        projectToUpdate.GithubLink = project.GithubLink;
        projectToUpdate.ImageLink = project.ImageLink;

        try
        {
            // Save the changes to the database
            await _context.SaveChangesAsync();
            return Ok(projectToUpdate); // Return the updated project
        }
        catch (Exception ex)
        {
            // Log the exception and return an appropriate error message
            return StatusCode(500, "Error updating project: " + ex.Message);
        }
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteProject([FromRoute]int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.Name);
        if (userId == null)
        {
            return Unauthorized("User is not authenticated or invalid ID format.");
        }

        var user = await _userManager.FindByNameAsync(userId);
        if (user == null || !user.IsAdmin)
        {
            return Unauthorized("You are not an administrator. You do not have the right to create projects");
        }

        _context.Projects.Remove(_context.Projects.FirstOrDefault(d => d.Id == id));
        await _context.SaveChangesAsync(); // Save to database

        return Ok("Project deleted");
    }

    
    
}