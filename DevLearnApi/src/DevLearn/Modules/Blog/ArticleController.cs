using DevLearn.Contract.Abstractions;
using DevLearn.Contract.Blog;
using DevLearn.Contract.Blog.Dtos;
using Microsoft.AspNetCore.Mvc;

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

    [HttpPost]
    public async Task<Guid> Create([FromBody] CreateArticleRequest request)
    {
        var command = new CreateArticleCommand(request);
        var newArticleQuid = await commandDispatcher.DispatchAsync<CreateArticleCommand, Guid>(command);
        return newArticleQuid;
    }
}
