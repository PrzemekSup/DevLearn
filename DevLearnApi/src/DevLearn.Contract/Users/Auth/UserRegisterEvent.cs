using DevLearn.Contract.Abstractions;

namespace DevLearn.Contract.Users.Auth;

public record UserRegisterEvent(RegisterUserDto RegisterUser) : IEvent;
