using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authentication;
using PortfolioAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// Add DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

// ENABLE CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhostAndSpecificUrl", builder =>
    {
        builder
            .WithOrigins(
                "http://localhost:3000",     // Localhost for development
                "http://96.23.35.62:3000" // Specific production URL
            )
            .AllowAnyHeader()     // Allow any headers
            .AllowAnyMethod()     // Allow any HTTP method
            .AllowCredentials();  // Allow credentials (cookies, HTTP authentication)
    });
});

// Add Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])),
        ValidateIssuer = false,
        ValidateAudience = false
    };
})
// Google Authentication
.AddGoogle(googleOptions =>
{
    googleOptions.ClientId = builder.Configuration["Authentication:Google:ClientId"];
    googleOptions.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];
})
// GitHub Authentication using OAuth
.AddOAuth("GitHub", options =>
{
    options.ClientId = builder.Configuration["Authentication:GitHub:ClientId"];
    options.ClientSecret = builder.Configuration["Authentication:GitHub:ClientSecret"];
    options.CallbackPath = "/signin-github"; // Adjust if needed
    options.AuthorizationEndpoint = "https://github.com/login/oauth/authorize";
    options.TokenEndpoint = "https://github.com/login/oauth/access_token";
    options.UserInformationEndpoint = "https://api.github.com/user";
    options.SaveTokens = true;

    // Map user data
    options.ClaimActions.MapJsonKey("urn:github:login", "login");
    options.ClaimActions.MapJsonKey("urn:github:id", "id");
    options.ClaimActions.MapJsonKey("urn:github:name", "name");
    options.ClaimActions.MapJsonKey("urn:github:email", "email");
});

builder.Services.AddControllers();

var app = builder.Build();
app.UseRouting();

app.UseCors("AllowLocalhostAndSpecificUrl");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
