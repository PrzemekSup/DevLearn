using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

internal class IdentityRoleClaimConfiguration : IEntityTypeConfiguration<IdentityRoleClaim<string>>
{
    public void Configure(EntityTypeBuilder<IdentityRoleClaim<string>> builder)
    {
        builder.Property(x => x.RoleId).HasMaxLength(40);
        builder.Property(x => x.ClaimType).HasMaxLength(100);
        builder.Property(x => x.ClaimValue).HasMaxLength(500);
    }
}