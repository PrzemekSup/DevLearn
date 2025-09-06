namespace DevLearn.Contract.Abstractions;

public interface IQueryHandler<TQuery, TResponse>
    where TQuery : IQuery<TResponse>
{
    Task<TResponse> HandleAsync(TQuery request, CancellationToken cancellationToken = default);
}
