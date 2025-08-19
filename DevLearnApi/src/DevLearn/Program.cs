using Azure.Identity;
using DevLearn.Auth;
using DevLearn.Auth.IRepository;
using DevLearn.Auth.Token;
using DevLearn.Helpers;
using DevLearn.Infrastructure.Email;
using DevLearn.Infrastructure.Modules.Users.Entities;
using DevLearn.Infrastructure.Modules.Users.Repositories;
using DevLearn.Middleware;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration.AzureAppConfiguration;
using Microsoft.IdentityModel.Tokens;
using StackExchange.Redis;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// === Configuration ===
string appConfigEndpoint = builder.Configuration.GetSafeConfigurationKey("AzureAppConfiguration");
var postgreConnectionString = builder.Configuration.GetSafeConfigurationKey("PostgreConnectionString");

builder.Configuration.AddAzureAppConfiguration(options =>
{
    options.Connect(new Uri(appConfigEndpoint), new DefaultAzureCredential())
           .Select(KeyFilter.Any, labelFilter: "devlearn")
           .ConfigureKeyVault(kv =>
           {
               kv.SetCredential(new DefaultAzureCredential());
           });
});

// === Database Contexts ===
builder.Services.AddDbContext<UsersDbContext>(options =>
    options.UseNpgsql(postgreConnectionString, npgsqlOptions =>
    {
        npgsqlOptions.MigrationsHistoryTable("__UsersMigrationsHistory", "dev");
    }));

// === Identity ===
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.User.RequireUniqueEmail = true;
    options.SignIn.RequireConfirmedEmail = true;

    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequiredLength = 8;
    options.Password.RequiredUniqueChars = 1;
})
.AddEntityFrameworkStores<UsersDbContext>()
.AddDefaultTokenProviders();

// === Redis ===
builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
    ConnectionMultiplexer.Connect(builder.Configuration.GetSafeConnectionString("Redis")));

// === Custom Services ===
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IAuthRepository, AuthRepository>();
ConfigureEmail.Configure(builder);

// === JWT Authentication ===
var jwtKey = builder.Configuration.GetSafeConfigurationKey("DevJwtKey");
var jwtIssuer = builder.Configuration.GetSafeConfigurationKey("DevJwtIssuer");
var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = key,
        ClockSkew = TimeSpan.Zero
    };
});
//.AddGoogle(options =>
//{
//    options.ClientId = GetConfigurationKey(builder, "Authentication:Google:ClientId");
//    options.ClientSecret = GetConfigurationKey(builder, "Authentication:Google:ClientSecret");
//    options.CallbackPath = "/signin-google";
//})
//.AddFacebook(options =>
//{
//    options.AppId = GetConfigurationKey(builder, "Authentication:Facebook:AppId");
//    options.AppSecret = GetConfigurationKey(builder, "Authentication:Facebook:AppSecret");
//    options.CallbackPath = "/signin-facebook";
//});

// === CORS ===
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

// === Swagger ===
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApiDocument(opt =>
{
    opt.Title = "DevLearn API";
    opt.Version = "v1";

    opt.AddSecurity("Bearer", new NSwag.OpenApiSecurityScheme()
    {
        Description = "JWT Authorization header using the Bearer scheme.",
        Type = NSwag.OpenApiSecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = NSwag.OpenApiSecurityApiKeyLocation.Header,
        Name = "Authorization"
    });

    opt.PostProcess = document =>
    {
        document.Info.Version = "v1";
        document.Info.Title = "DevLearn API";
        document.Info.Description = "REST API for DevLearn.";
    };
});

builder.Services.AddControllers();

var app = builder.Build();

// --- Middleware ---
app.UseMiddleware<ExceptionMiddleware>();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.UseOpenApi();
    app.UseSwaggerUi();
}

app.MapControllers();
app.Run();