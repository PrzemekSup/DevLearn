using DevLearn.Contract.Abstractions;
using DevLearn.Contract.Blog.Dtos;
using DevLearn.Helpers;

namespace DevLearn.Contract.Blog;

public record CreateCommentCommand(CreateCommentRequest Request, string Author)
    : ICommand<ValidationStateDto>;
