using DevLearn.Contract.Abstractions;
using DevLearn.Contract.User.Dtos;

namespace DevLearn.Contract.User;

public record GetUserDetailsQuery(string Id)
    : IQuery<UserDetailsDto?>;
