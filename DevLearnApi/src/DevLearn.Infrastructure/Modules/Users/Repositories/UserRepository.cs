using DevLearn.Contract.User.Dtos;
using DevLearn.Contract.User.IRepository;
using DevLearn.Infrastructure.Modules.Users.Entities;
using Microsoft.EntityFrameworkCore;

namespace DevLearn.Infrastructure.Modules.Users.Repositories;

public class UserRepository(UsersDbContext context) : IUserRepository
{
    public async Task<UserDetailsDto?> Get(string id)
    {
        var user = await context.Users.FirstOrDefaultAsync(x => x.Id == id);
        if (user == null)
        {
            return null;
        }

        return new UserDetailsDto(user.Id, user.UserName!);
    }
}
