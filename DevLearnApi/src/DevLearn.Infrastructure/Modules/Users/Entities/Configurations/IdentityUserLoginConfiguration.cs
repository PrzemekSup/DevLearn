using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

internal class IdentityUserLoginConfiguration : IEntityTypeConfiguration<IdentityUserLogin<string>>
{
    public void Configure(EntityTypeBuilder<IdentityUserLogin<string>> builder)
    {
        builder.Property(x => x.LoginProvider).HasMaxLength(50);
        builder.Property(x => x.ProviderKey).HasMaxLength(100);
        builder.Property(x => x.ProviderDisplayName).HasMaxLength(100);
        builder.Property(x => x.UserId).HasMaxLength(40);
    }
}
