using DevLearn.Contract.Abstractions;
using DevLearn.Contract.Blog.IRepositories;

namespace DevLearn.Contract.Blog;

public class CreateArticleCommandHandler(
    IArticleRepository repository
) : ICommandHandler<CreateArticleCommand, Guid>
{
    public Task<Guid> HandleAsync(CreateArticleCommand command, CancellationToken cancellationToken = default)
    {
        return repository.CreateAsync(command.Request);
    }
}
