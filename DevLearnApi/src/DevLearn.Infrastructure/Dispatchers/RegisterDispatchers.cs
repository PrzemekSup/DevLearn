using DevLearn.Contract.Abstractions;
using Microsoft.Extensions.DependencyInjection;

namespace DevLearn.Infrastructure.Dispatchers;

public static class RegisterDispatchers
{
    public static void Register(IServiceCollection services)
    {
        var eventHandlers = typeof(IEventHandler<>).Assembly.GetTypes()
            .Where(x => x.GetInterfaces().Any(x => x.IsGenericType && x.GetGenericTypeDefinition() == typeof(IEventHandler<>)));

        foreach (var type in eventHandlers)
        {
            var eventType = type.GetInterfaces().Single(x => x.IsGenericType && x.GetGenericTypeDefinition() == typeof(IEventHandler<>));
            services.Add(new ServiceDescriptor(eventType, type, ServiceLifetime.Scoped));
        }
        services.AddScoped<IEventPublisher, EventPublisher>();

        var queryHandlers = typeof(IQueryHandler<,>).Assembly.GetTypes()
            .Where(x => x.GetInterfaces().Any(x => x.IsGenericType && x.GetGenericTypeDefinition() == typeof(IQueryHandler<,>)));
        foreach (var type in queryHandlers)
        {
            var queryType = type.GetInterfaces().Single(x => x.IsGenericType && x.GetGenericTypeDefinition() == typeof(IQueryHandler<,>));
            services.Add(new ServiceDescriptor(queryType, type, ServiceLifetime.Scoped));
        }
        services.AddScoped<IQueryDispatcher, QueryDispatcher>();

        var commandHandlers = typeof(ICommandHandler<,>).Assembly.GetTypes()
            .Where(x => x.GetInterfaces().Any(x => x.IsGenericType && x.GetGenericTypeDefinition() == typeof(ICommandHandler<,>)));
        foreach (var type in commandHandlers)
        {
            var commandType = type.GetInterfaces().Single(x => x.IsGenericType && x.GetGenericTypeDefinition() == typeof(ICommandHandler<,>));
            services.Add(new ServiceDescriptor(commandType, type, ServiceLifetime.Scoped));
        }
        services.AddScoped<ICommandDispatcher, CommandDispatcher>();
    }
}
