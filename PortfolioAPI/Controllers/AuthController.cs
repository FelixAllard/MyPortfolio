using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
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
    private readonly IConfiguration _configuration;

    public AuthController(
        SignInManager<ApplicationUser> signInManager, 
        UserManager<ApplicationUser> userManager,
        IConfiguration configuration
        )
    {
        _signInManager = signInManager;
        _userManager = userManager;
        _configuration = configuration;
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
        if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
        {
            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(authClaims),
                Expires = DateTime.UtcNow.AddMinutes(double.Parse(_configuration["Jwt:ExpiryMinutes"]!)),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = _configuration["Jwt:Issuer"]
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);
            
            await _userManager.SetAuthenticationTokenAsync(user, "JWT", "AccessToken", tokenString);

            return Ok(new { token = tokenString });
        }
        return Unauthorized();
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
            user = new ApplicationUser 
            { 
                UserName = info.Principal.FindFirstValue(ClaimTypes.Email), 
                Email = info.Principal.FindFirstValue(ClaimTypes.Email) 
            };
            await _userManager.CreateAsync(user);
            await _userManager.AddLoginAsync(user, info);
        }

        await _signInManager.SignInAsync(user, isPersistent: false);

        // Instead of returning JSON, redirect to frontend with the token
        var token = "your_generated_token"; // You need to generate a JWT token here.
        return Redirect($"http://localhost:5173/auth-success?token={token}");
    }
    [HttpGet("user-info")]
    [Authorize]
    public async Task<IActionResult> GetUserInfo()
    {
        var userName = User.Identity?.Name;

        if (string.IsNullOrEmpty(userName))
        {
            return Unauthorized(new { error = "User is not authenticated" });
        }

        var user = await _userManager.FindByNameAsync(userName);
        if (user == null)
        {
            return NotFound(new { error = "User not found" });
        }

        return Ok(new
        {
            id = user.Id,
            username = user.UserName,
            email = user.Email,
            admin = user.IsAdmin,
        });
    }
    
    

}
