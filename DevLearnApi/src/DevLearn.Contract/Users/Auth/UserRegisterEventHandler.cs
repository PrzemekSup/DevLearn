using DevLearn.Contract.Abstractions;

namespace DevLearn.Contract.Users.Auth;

public class UserRegisterEventHandler : IEventHandler<UserRegisterEvent>
{
    public async Task HandleAsync(UserRegisterEvent @event, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }
}
