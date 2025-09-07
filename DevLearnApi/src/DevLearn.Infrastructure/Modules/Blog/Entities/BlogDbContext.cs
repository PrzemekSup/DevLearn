using DevLearn.Infrastructure.Modules.Blog.Entities.Configurations;
using Microsoft.EntityFrameworkCore;

namespace DevLearn.Infrastructure.Modules.Blog.Entities;

public class BlogDbContext(DbContextOptions<BlogDbContext> options) : DbContext(options)
{
    public DbSet<Author> Authors => Set<Author>();
    public DbSet<Article> Articles => Set<Article>();
    public DbSet<ArticleContent> ArticleContents => Set<ArticleContent>();
    public DbSet<Tag> Tags => Set<Tag>();
    public DbSet<Comment> Comments => Set<Comment>();
    public DbSet<Like> Likes => Set<Like>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.HasDefaultSchema("dev");

        builder.ApplyConfiguration(new ArticleConfiguration());
        builder.ApplyConfiguration(new ArticleContentConfiguration());
        builder.ApplyConfiguration(new AuthorConfiguration());
        builder.ApplyConfiguration(new TagConfiguration());
        builder.ApplyConfiguration(new CommentConfiguration());
        builder.Entity<Like>().ToTable("likes");
        builder.Entity<Like>().Property(x => x.UserId).IsRequired().HasMaxLength(40);
    }
}
