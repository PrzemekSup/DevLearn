using DevLearn.Auth;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DevLearn.Infrastructure.Modules.Users.Entities.Configurations;

internal class ApplicationUserConfiguration : IEntityTypeConfiguration<ApplicationUser>
{
    public void Configure(EntityTypeBuilder<ApplicationUser> builder)
    {
        // ApplicationUser
        builder.Property(x => x.Id).HasMaxLength(40);
        builder.Property(x => x.UserName).HasMaxLength(40);
        builder.Property(x => x.NormalizedUserName).HasMaxLength(40);
        builder.Property(x => x.Email).HasMaxLength(100);
        builder.Property(x => x.NormalizedEmail).HasMaxLength(100);
        builder.Property(x => x.PhoneNumber).HasMaxLength(20);

        builder.Property(x => x.PasswordHash).HasMaxLength(256); // Typical hash length
        builder.Property(x => x.SecurityStamp).HasMaxLength(40); // GUID
        builder.Property(x => x.ConcurrencyStamp).HasMaxLength(40); // GUID
    }
}
