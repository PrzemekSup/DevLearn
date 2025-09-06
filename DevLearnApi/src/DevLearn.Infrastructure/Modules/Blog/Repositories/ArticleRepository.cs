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
            .Include(x => x.Category)
            .Include(x => x.Tags)
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
            .Include(x => x.Category)
            .Include(x => x.Tags)
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
    public async Task<ArticleDetailsDto?> Get(string slug)
    {
        var article = await context.Articles
            .Include(x => x.Author)
            .Include(x => x.ArticleContents)
            .Include(x => x.Category)
            .Include(x => x.Tags)
            .FirstOrDefaultAsync(x => x.Slug == slug);

        if (article == null)
        {
            return null;
        }

        var articleDto = MapArticle(article);
        var contents = article.ArticleContents.OrderBy(x => x.BlockOrder)
            .Select(x => new Contract.Blog.Dtos.ArticleContent(x.BlockOrder, x.Content))
            .ToArray();

        return new ArticleDetailsDto(articleDto, contents, article.Likes);
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

    private static ArticleDto MapArticle(Article article)
    {
        return new ArticleDto(article.Id, article.Title, article.Slug,
            article.Description, article.CreatedAt, article.UpdatedAt,
            new ArticleAuthorDto(article.Author.DisplayName, article.Author.Description),
            article.Category.Name, [.. article.Tags.Select(t => t.Name)], article.ReadTimeInMins, article.Views);
    }
}