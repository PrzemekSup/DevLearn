using Azure.Identity;
using DevLearn.Auth;
using DevLearn.Auth.IRepository;
using DevLearn.Auth.Token;
using DevLearn.Infrastructure.Email;
using DevLearn.Infrastructure.Modules.Users.Entities;
using DevLearn.Infrastructure.Modules.Users.Repositories;
using DevLearn.Middleware;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration.AzureAppConfiguration;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using StackExchange.Redis;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// === Configuration ===
string appConfigEndpoint = Common.GetConfigurationKey(builder, "AzureAppConfiguration");
var postgreConnectionString = Common.GetConfigurationKey(builder, "PostgreConnectionString");

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
})
.AddEntityFrameworkStores<UsersDbContext>()
.AddDefaultTokenProviders();

// === Redis ===
builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
    ConnectionMultiplexer.Connect(GetConnectionString(builder, "Redis")));

// === Custom Services ===
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IAuthRepository, AuthRepository>();
ConfigureEmail.Configure(builder);

// === JWT Authentication ===
var jwtKey = Common.GetConfigurationKey(builder, "DevJwtKey");
var jwtIssuer = Common.GetConfigurationKey(builder, "DevJwtIssuer");
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
builder.Services.AddSwaggerGen(opt =>
{
    opt.SwaggerDoc("v1", new OpenApiInfo { Title = "DevLearn API", Version = "v1" });
    opt.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme.",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Name = "Authorization"
    });
    opt.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme {
                Reference = new OpenApiReference {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            []
        }
    });
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
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();
app.Run();

static string GetConnectionString(WebApplicationBuilder builder, string key)
{
    var result = builder.Configuration.GetConnectionString(key);
    if (string.IsNullOrEmpty(result))
    {
        throw new Exception($"Error on initialization. Missing ConnectionString '{key}'");
    }

    return result;
}