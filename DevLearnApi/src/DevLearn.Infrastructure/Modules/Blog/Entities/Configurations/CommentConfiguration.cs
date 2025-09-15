using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DevLearn.Infrastructure.Modules.Blog.Entities.Configurations;

internal class CommentConfiguration : IEntityTypeConfiguration<Comment>
{
    public void Configure(EntityTypeBuilder<Comment> builder)
    {
        builder.ToTable("comments");
        builder.HasKey(x => x.Id);
        builder.HasOne(x => x.Article)
         .WithMany(x => x.Comments)
         .HasForeignKey(x => x.ArticleId);
        builder.Property(x => x.Author).IsRequired().HasMaxLength(50);
        builder.Property(x => x.Content).IsRequired().HasMaxLength(1000);
        builder.Property(x => x.Likes).IsRequired().HasColumnType("smallint");
    }
}
