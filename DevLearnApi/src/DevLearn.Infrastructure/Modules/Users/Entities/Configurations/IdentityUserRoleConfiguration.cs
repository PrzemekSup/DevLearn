using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DevLearn.Infrastructure.Modules.Users.Entities.Configurations;

internal class IdentityUserRoleConfiguration : IEntityTypeConfiguration<IdentityUserRole<string>>
{
    public void Configure(EntityTypeBuilder<IdentityUserRole<string>> builder)
    {
        builder.Property(x => x.UserId).HasMaxLength(40);
        builder.Property(x => x.RoleId).HasMaxLength(40);
    }
}