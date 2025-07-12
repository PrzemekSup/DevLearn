using DevLearn.Auth;
using DevLearn.Infrastructure.Modules.Users.Entities.Configurations;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DevLearn.Infrastructure.Modules.Users.Entities;

public class UsersDbContext(DbContextOptions<UsersDbContext> options) : IdentityDbContext<ApplicationUser>(options)
{
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.HasDefaultSchema("dev");
        LowerCaseAllGenericTables(builder);

        builder.Entity<RefreshToken>().ToTable("refreshtoken");
        builder.ApplyConfiguration(new ApplicationUserConfiguration());
        builder.ApplyConfiguration(new IdentityRoleConfiguration());
        builder.ApplyConfiguration(new IdentityUserClaimConfiguration());
        builder.ApplyConfiguration(new IdentityUserLoginConfiguration());
        builder.ApplyConfiguration(new IdentityUserRoleConfiguration());
        builder.ApplyConfiguration(new IdentityRoleClaimConfiguration());
        builder.ApplyConfiguration(new IdentityUserTokenConfiguration());
        builder.ApplyConfiguration(new RefreshTokenConfiguration());

    }

    /// <summary>
    /// Due to behavior of PostgreSQL, we set all tables to lowercase
    /// </summary>
    private static void LowerCaseAllGenericTables(ModelBuilder builder)
    {
        builder.Entity<ApplicationUser>().ToTable("applicationusers");
        builder.Entity<IdentityRole>().ToTable("applicationroles");
        builder.Entity<IdentityUserRole<string>>().ToTable("auserroles");
        builder.Entity<IdentityUserClaim<string>>().ToTable("auserclaims");
        builder.Entity<IdentityUserLogin<string>>().ToTable("auserlogins");
        builder.Entity<IdentityRoleClaim<string>>().ToTable("aroleclaims");
        builder.Entity<IdentityUserToken<string>>().ToTable("ausertokens");
    }
}
