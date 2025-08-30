using AutoMapper;
using DevLearn.Contract.Blog.Dtos;
using DevLearn.Contract.Blog.IRepositories;
using DevLearn.Infrastructure.Modules.Blog.Entities;
using Microsoft.EntityFrameworkCore;

namespace DevLearn.Infrastructure.Modules.Blog.Repositories;

public class ArticleRepository(BlogDbContext context, IMapper mapper) : IArticleRepository
{
    /// <inheritdoc/>
    public async Task<ArticleListResponse> Get(int page = 1, int pageSize = 10)
    {
        var articles = await context.Articles
            .Include(x => x.Author)
            .OrderByDescending(a => a.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var articleDtos = articles.Select(MapArticle);
        var articlesCount = await context.Articles.CountAsync();

        return new ArticleListResponse([.. articleDtos], articlesCount);
    }

    /// <inheritdoc/>
    public async Task<ArticleListResponse> Search(List<string> tags, int page = 1, int pageSize = 10)
    {
        var articles = await context.Articles
            .Where(x => x.Tags.Any(t => tags.Contains(t.Name)))
            .Include(x => x.Author)
            .OrderByDescending(a => a.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var articleDtos = articles.Select(MapArticle);
        var articlesCount = await context.Articles
            .Where(x => x.Tags.Any(t => tags.Contains(t.Name)))
            .CountAsync();

        return new ArticleListResponse([.. articleDtos], articlesCount);
    }

    /// <inheritdoc/>
    public async Task<Guid> CreateAsync(CreateArticleRequest request)
    {
        var articleDb = mapper.Map<Article>(request);
        articleDb.CreatedAt = DateTime.UtcNow;
        articleDb.UpdatedAt = DateTime.UtcNow;

        context.Add(articleDb);
        await context.SaveChangesAsync();
        return articleDb.Id;
    }

    private ArticleDto MapArticle(Article article)
    {
        return new ArticleDto(article.Id, article.Title, article.Slug,
            article.Description, article.CreatedAt, article.UpdatedAt,
            new ArticleAuthorDto(article.Author.DisplayName, article.Author.Description),
            [.. article.Tags.Select(t => t.Name)]);
    }
}