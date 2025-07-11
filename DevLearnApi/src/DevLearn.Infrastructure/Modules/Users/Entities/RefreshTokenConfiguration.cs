using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DevLearn.Infrastructure.Modules.Users.Entities;

class RefreshTokenConfiguration : IEntityTypeConfiguration<RefreshToken>
{
    public void Configure(EntityTypeBuilder<RefreshToken> builder)
    {
        builder.HasKey(x => x.Id);
        builder.HasIndex(x => x.Token).IsUnique();
        builder.HasOne(x => x.User)
         .WithMany()
         .HasForeignKey(x => x.UserId)
         .IsRequired()
         .OnDelete(DeleteBehavior.Cascade);
    }
}

