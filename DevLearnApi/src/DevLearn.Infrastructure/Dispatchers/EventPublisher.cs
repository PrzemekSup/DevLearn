using DevLearn.Contract.Abstractions;
using Microsoft.Extensions.DependencyInjection;

namespace DevLearn.Infrastructure.Dispatchers;

public class EventPublisher(IServiceProvider serviceProvider) : IEventPublisher
{
    public async Task PublishAsync<TEvent>(TEvent @event, CancellationToken cancellationToken = default)
        where TEvent : IEvent
    {
        var handlers = serviceProvider.GetServices<IEventHandler<TEvent>>();
        await Task.WhenAll(handlers.Select(h => h.HandleAsync(@event, cancellationToken)));
    }
}
