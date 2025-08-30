using DevLearn.Contract.Abstractions;
using DevLearn.Contract.Blog.Dtos;

namespace DevLearn.Contract.Blog;

public record CreateArticleCommand(CreateArticleRequest Request)
    : ICommand<Guid>;
