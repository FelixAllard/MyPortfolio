using PortfolioAPI.Data;
using PortfolioAPI.Model;

namespace PortfolioAPI.Controllers;

using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly UserManager<ApplicationUser> _userManager;

    public AuthController(
        SignInManager<ApplicationUser> signInManager, 
        UserManager<ApplicationUser> userManager
        )
    {
        _signInManager = signInManager;
        _userManager = userManager;
    }
    /// <summary>
    /// Creates the account without the use of external API
    /// </summary>
    /// <param name="model">The registering model which accept a Username, a email and password</param>
    /// <returns>The Token Key</returns>
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterModel model)
    {
        if (await _userManager.FindByNameAsync(model.UserName) != null)
        {
            return BadRequest(new { error = "Username already exists." });
        }

        var user = new ApplicationUser { UserName = model.UserName, Email = model.Email };
        var result = await _userManager.CreateAsync(user, model.Password);

        if (!result.Succeeded)
        {
            var errors = result.Errors.Select(e => e.Description).ToList();
            return BadRequest(new { errors });
        }

        return Ok(new { message = "User registered successfully" });
    }


    /// <summary>
    /// Login with the credidentials
    /// </summary>
    /// <param name="model">A model for only the username and password</param>
    /// <returns>The token key</returns>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        var user = await _userManager.FindByNameAsync(model.UserName);
        if (user == null)
        {
            return Unauthorized("Invalid username or password.");
        }

        var result = await _signInManager.PasswordSignInAsync(user, model.Password, false, false);
        if (!result.Succeeded)
        {
            return Unauthorized("Invalid username or password.");
        }

        return Ok(new { message = "Login successful", user.Email });
    }

    /// <summary>
    /// Handles Github Login
    /// </summary>
    /// <returns>The Token Key</returns>
    [HttpGet("github-login")]
    public IActionResult GitHubLogin()
    {
        var redirectUrl = Url.Action(nameof(ExternalLoginCallback), "Auth", new { provider = "GitHub" }, Request.Scheme);
        var properties = _signInManager.ConfigureExternalAuthenticationProperties("GitHub", redirectUrl);
        return Challenge(properties, "GitHub");
    }
    /// <summary>
    /// Handles Google registering 
    /// </summary>
    /// <returns>The Token Key</returns>
    [HttpGet("google-login")]
    public IActionResult GoogleLogin()
    {
        var redirectUrl = Url.Action(nameof(ExternalLoginCallback), "Auth", new { provider = "Google" }, Request.Scheme);
        var properties = _signInManager.ConfigureExternalAuthenticationProperties("Google", redirectUrl);
        return Challenge(properties, "Google");
    }
    
    [HttpGet("external-login-callback")]
    public async Task<IActionResult> ExternalLoginCallback(string provider)
    {
        var info = await _signInManager.GetExternalLoginInfoAsync();
        if (info == null)
        {
            return BadRequest("Error loading external login information.");
        }

        var user = await _userManager.FindByEmailAsync(info.Principal.FindFirstValue(ClaimTypes.Email));
        if (user == null)
        {
            user = new ApplicationUser { UserName = info.Principal.FindFirstValue(ClaimTypes.Email), Email = info.Principal.FindFirstValue(ClaimTypes.Email) };
            await _userManager.CreateAsync(user);
            await _userManager.AddLoginAsync(user, info);
        }

        await _signInManager.SignInAsync(user, isPersistent: false);
        return Ok(new { message = "Login successful", user.Email });
    }
}
