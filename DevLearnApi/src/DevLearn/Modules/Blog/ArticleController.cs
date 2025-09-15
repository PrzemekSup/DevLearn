using DevLearn.Contract.Abstractions;
using DevLearn.Contract.Blog;
using DevLearn.Contract.Blog.Dtos;
using DevLearn.Contract.User;
using DevLearn.Contract.User.Dtos;
using DevLearn.Helpers;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DevLearn.Modules.Blog;

[ApiController]
[Route("api/[controller]")]
public class ArticleController(IQueryDispatcher queryDispatcher, ICommandDispatcher commandDispatcher) : ControllerBase
{
    [HttpGet]
    public async Task<ArticleListResponse> Get([FromQuery] List<string> tags, int? page, int? pageSize)
    {
        var query = new GetArticlesQuery(page, pageSize, tags);
        var articles = await queryDispatcher.DispatchAsync<GetArticlesQuery, ArticleListResponse>(query);
        return articles;
    }

    [HttpGet("{slug}")]
    public async Task<ArticleDetailsDto?> Get(string slug)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var query = new GetArticleQuery(slug, userId);
        var article = await queryDispatcher.DispatchAsync<GetArticleQuery, ArticleDetailsDto?>(query);
        if (article == null)
        {
            this.Response.StatusCode = StatusCodes.Status404NotFound;
            return null;
        }

        return article;
    }

    [HttpPost]
    public async Task<ValidationStateDto> Create([FromBody] CreateArticleRequest request)
    {
        var command = new CreateArticleCommand(request);
        var result = await commandDispatcher.DispatchAsync<CreateArticleCommand, ValidationStateDto>(command);
        return result;
    }

    [HttpGet("like/{articleId}/{isLiked}")]
    public async Task<ValidationStateDto> AddArticleLike(Guid articleId, bool isLiked)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return new ValidationStateDto(false, string.Empty, ["Tylko zalogowani użytkownicy mogą dodawać polubienia."]);
        }

        var command = new AddLikeCommand((int)LikeEntityType.Article, articleId, userId, isLiked);
        var result = await commandDispatcher.DispatchAsync<AddLikeCommand, ValidationStateDto>(command);
        return result;
    }

    [HttpGet("comments/{articleId}")]
    public async Task<CommentResponseDto[]> GetComments(string articleId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var guidArticleId = Guid.Parse(articleId);
        var query = new GetCommentsQuery(guidArticleId, userId);
        var comments = await queryDispatcher.DispatchAsync<GetCommentsQuery, CommentResponseDto[]>(query);
        return comments;
    }

    [HttpPost("comment")]
    public async Task<ValidationStateDto> CreateComment([FromBody] CreateCommentRequest request)
    {
        var author = "Niezalogowany użytkownik.";
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId != null)
        {
            var query = new GetUserDetailsQuery(userId);
            var user = await queryDispatcher.DispatchAsync<GetUserDetailsQuery, UserDetailsDto?>(query);
            if (user != null)
            {
                author = user.UserName;
            }
        }

        var command = new CreateCommentCommand(request, author);
        var result = await commandDispatcher.DispatchAsync<CreateCommentCommand, ValidationStateDto>(command);
        return result;
    }

    [HttpGet("comment/like/{commentId}/{isLiked}")]
    public async Task<ValidationStateDto> AddCommentLike(Guid commentId, bool isLiked)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return new ValidationStateDto(false, string.Empty, ["Tylko zalogowani użytkownicy mogą dodawać polubienia."]);
        }

        var command = new AddLikeCommand((int)LikeEntityType.ArticleComment, commentId, userId, isLiked);
        var result = await commandDispatcher.DispatchAsync<AddLikeCommand, ValidationStateDto>(command);
        return result;
    }
}
