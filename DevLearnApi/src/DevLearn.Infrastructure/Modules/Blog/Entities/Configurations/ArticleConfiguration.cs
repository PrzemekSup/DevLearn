using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DevLearn.Infrastructure.Modules.Blog.Entities.Configurations;

internal class ArticleConfiguration : IEntityTypeConfiguration<Article>
{
    public void Configure(EntityTypeBuilder<Article> builder)
    {
        builder.ToTable("articles");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Title).HasMaxLength(500);
        builder.Property(x => x.Slug).HasMaxLength(200);
        builder.Property(x => x.Description).HasMaxLength(1000);
        builder.HasOne(x => x.Author)
         .WithMany(x => x.Articles)
         .HasForeignKey(x => x.AuthorId);
        builder.HasMany(x => x.Tags).WithMany(x => x.Articles).UsingEntity("articlestags");
        builder.HasOne(x => x.Category).WithMany(x => x.MainArticles).HasForeignKey(x => x.CategoryId);
    }
}
