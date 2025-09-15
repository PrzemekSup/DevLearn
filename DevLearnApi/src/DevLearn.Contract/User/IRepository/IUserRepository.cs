using DevLearn.Contract.User.Dtos;

namespace DevLearn.Contract.User.IRepository;

public interface IUserRepository
{
    Task<UserDetailsDto?> Get(string id);

}
