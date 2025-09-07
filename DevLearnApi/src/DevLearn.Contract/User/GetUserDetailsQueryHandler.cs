using DevLearn.Contract.Abstractions;
using DevLearn.Contract.User.Dtos;
using DevLearn.Contract.User.IRepository;

namespace DevLearn.Contract.User;

public class GetUserDetailsQueryHandler(IUserRepository userRepository)
    : IQueryHandler<GetUserDetailsQuery, UserDetailsDto?>
{
    public Task<UserDetailsDto?> HandleAsync(GetUserDetailsQuery request, CancellationToken cancellationToken)
    {
        return userRepository.Get(request.Id);
    }
}
