using DevLearn.Contract.Abstractions;
using Microsoft.Extensions.DependencyInjection;

namespace DevLearn.Infrastructure.Dispatchers;

public class QueryDispatcher(IServiceProvider serviceProvider) : IQueryDispatcher
{
    public Task<TResponse> DispatchAsync<TRequest, TResponse>(
        TRequest request,
        CancellationToken cancellationToken = default)
        where TRequest : IQuery<TResponse>
    {
        var handler = serviceProvider.GetRequiredService<IQueryHandler<TRequest, TResponse>>();
        return handler.HandleAsync(request, cancellationToken);
    }
}
