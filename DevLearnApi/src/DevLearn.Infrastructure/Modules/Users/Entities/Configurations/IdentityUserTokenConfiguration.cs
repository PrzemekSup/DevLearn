using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DevLearn.Infrastructure.Modules.Users.Entities.Configurations;

internal class IdentityUserTokenConfiguration : IEntityTypeConfiguration<IdentityUserToken<string>>
{
    public void Configure(EntityTypeBuilder<IdentityUserToken<string>> builder)
    {
        builder.Property(x => x.UserId).HasMaxLength(40);
        builder.Property(x => x.LoginProvider).HasMaxLength(50);
        builder.Property(x => x.Name).HasMaxLength(100);
        builder.Property(x => x.Value).HasMaxLength(500);
    }
}
