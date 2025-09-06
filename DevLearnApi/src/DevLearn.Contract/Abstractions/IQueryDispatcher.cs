namespace DevLearn.Contract.Abstractions;

public interface IQueryDispatcher
{
    Task<TResponse> DispatchAsync<TRequest, TResponse>(TRequest request, CancellationToken cancellationToken = default)
        where TRequest : IQuery<TResponse>;
}
