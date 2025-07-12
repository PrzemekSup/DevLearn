using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DevLearn.Infrastructure.Modules.Users.Entities.Configurations;

internal class IdentityRoleConfiguration : IEntityTypeConfiguration<IdentityRole>
{
    public void Configure(EntityTypeBuilder<IdentityRole> builder)
    {
        builder.Property(x => x.Name).HasMaxLength(30);
        builder.Property(x => x.NormalizedName).HasMaxLength(30);
        builder.Property(x => x.ConcurrencyStamp).HasMaxLength(40);
    }
}
