using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DevLearn.Infrastructure.Modules.Users.Entities.Configurations;

internal class IdentityUserClaimConfiguration : IEntityTypeConfiguration<IdentityUserClaim<string>>
{
    public void Configure(EntityTypeBuilder<IdentityUserClaim<string>> builder)
    {
        builder.Property(x => x.UserId).HasMaxLength(40);
        builder.Property(x => x.ClaimType).HasMaxLength(100);
        builder.Property(x => x.ClaimValue).HasMaxLength(500);
    }
}
