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
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> PostProject([FromBody]Project project)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Unauthorized("User is not authenticated or invalid ID format.");
        }

        if (_userManager.FindByIdAsync(userId).Result.IsAdmin == false)
        {
            return Unauthorized("You are not an administrator. You do not have the right to create projects");
        }
        return Ok(_context.Projects.Add(project));
    }
    
    
}