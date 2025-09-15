using AutoMapper;
using DevLearn.Contract.Blog.Dtos;
using DevLearn.Contract.Blog.IRepositories;
using DevLearn.Infrastructure.Modules.Blog.Entities;
using Microsoft.EntityFrameworkCore;

namespace DevLearn.Infrastructure.Modules.Blog.Repositories;

public class ArticleRepository(BlogDbContext context, IMapper mapper) : IArticleRepository
{
    /// <inheritdoc/>
    public async Task<ArticleListResponse> GetAsync(int page = 1, int pageSize = 10)
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
    public async Task<ArticleListResponse> SearchAsync(List<string> tags, int page = 1, int pageSize = 10)
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
    public async Task<ArticleDetailsDto?> GetAsync(string slug, string? currentUserId)
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

        return new ArticleDetailsDto(articleDto, contents, GetLikeDto(article.Id, currentUserId));
    }

    /// <inheritdoc/>
    public async Task<ArticleDto?> GetAsync(Guid id)
    {
        var article = await context.Articles
            .Include(x => x.Author)
            .Include(x => x.Category)
            .Include(x => x.Tags)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (article == null)
        {
            return null;
        }

        return MapArticle(article);
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

    public async Task<string?> GetAuthorAsync(Guid authorId)
    {
        var author = await context.Authors.FirstOrDefaultAsync(x => x.Id.Equals(authorId));
        return author != null ? author.DisplayName : null;
    }

    private static ArticleDto MapArticle(Article article)
    {
        return new ArticleDto(article.Id, article.Title, article.Slug,
            article.Description, article.CreatedAt, article.UpdatedAt,
            new ArticleAuthorDto(article.Author.DisplayName, article.Author.Description),
            article.Category.Name, [.. article.Tags.Select(t => t.Name)], article.ReadTimeInMins, article.Views);
    }

    private LikeDto GetLikeDto(Guid articleId, string? currentUserId)
    {
        var likes = context.Likes
            .Count(x => x.EntityType == (int)LikeEntityType.Article && x.EntityId == articleId);
        var isLiked = currentUserId != null
            ? context.Likes
                .FirstOrDefault(x => x.EntityType == (int)LikeEntityType.Article && x.EntityId == articleId && x.UserId == currentUserId)
            : null;
        return new LikeDto(likes, isLiked != null);
    }
}