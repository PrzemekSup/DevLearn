using DevLearn.Contract.Abstractions;
using DevLearn.Helpers;

namespace DevLearn.Contract.Blog;

public record AddLikeCommand(int EntityType, Guid EntityId, string UserId, bool IsLiked)
    : ICommand<ValidationStateDto>;
