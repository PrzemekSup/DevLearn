using System.ComponentModel.DataAnnotations;

namespace DevLearn.Contract.User.Dtos;

public class UserDetailsDto(string userId, string userName)
{
    [Required] public string UserId { get; set; } = userId;
    [Required] public string UserName { get; set; } = userName;
}
