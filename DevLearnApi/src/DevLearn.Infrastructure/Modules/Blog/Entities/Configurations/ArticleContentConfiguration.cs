using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DevLearn.Infrastructure.Modules.Blog.Entities.Configurations;

internal class ArticleContentConfiguration : IEntityTypeConfiguration<ArticleContent>
{
    public void Configure(EntityTypeBuilder<ArticleContent> builder)
    {
        builder.ToTable("articlecontents");
        builder.HasKey(x => x.Id);
        builder.HasOne(x => x.Article)
         .WithMany(x => x.ArticleContents)
         .HasForeignKey(x => x.ArticleId);
        builder.Property(b => b.Content).HasColumnType("jsonb");
    }
}
