using DevLearn.Contract.Abstractions;
using Microsoft.Extensions.DependencyInjection;

namespace DevLearn.Infrastructure.Dispatchers;

public class EventPublisher : IEventPublisher
{
    private readonly IServiceProvider _serviceProvider;

    public EventPublisher(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public async Task PublishAsync<TEvent>(TEvent @event, CancellationToken cancellationToken = default)
        where TEvent : IEvent
    {
        var handlers = _serviceProvider.GetServices<IEventHandler<TEvent>>();
        await Task.WhenAll(handlers.Select(h => h.HandleAsync(@event, cancellationToken)));
    }
}
