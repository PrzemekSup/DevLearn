using DevLearn.Contract.Abstractions;
using DevLearn.Contract.Blog.Dtos;
using DevLearn.Contract.Blog.IRepositories;
using DevLearn.Helpers;

namespace DevLearn.Contract.Blog;

public class AddLikeCommandHandler(ILikeRepository likeRepository, IArticleRepository articleRepository, ICommentRepository commentRepository)
    : ICommandHandler<AddLikeCommand, ValidationStateDto>
{
    public async Task<ValidationStateDto> HandleAsync(AddLikeCommand command, CancellationToken cancellationToken = default)
    {
        var validation = await Validate(command.EntityType, command.EntityId, command.UserId, command.IsLiked);
        if (!validation.Success)
        {
            // todo: logger (errorMessage)
            return validation;
        }

        if (command.IsLiked)
        {
            await likeRepository.AddAsync(command.EntityType, command.EntityId, command.UserId);
        }
        else
        {
            await likeRepository.RemoveAsync(command.EntityType, command.EntityId, command.UserId);
        }
        return new ValidationStateDto(true, "Lubisz to!", []);
    }

    public async Task<ValidationStateDto> Validate(int entityType, Guid entityId, string userId, bool isLiked)
    {
        var exist = await likeRepository.Exist(entityType, entityId, userId);
        if (exist == isLiked)
        {
            var errorMessage = exist ? "Ten element został już polubiony" : "Polubienie zostało wcześniej usunięte";
            return new ValidationStateDto(false, string.Empty, [errorMessage]);
        }

        switch (entityType)
        {
            case (int)LikeEntityType.Article:
                var article = await articleRepository.GetAsync(entityId);
                if (article == null)
                {
                    return new ValidationStateDto(false, string.Empty, [$"Nie odnaleziono artykułu o id '{entityId}'."]);
                }
                return new ValidationStateDto(true, string.Empty, []);
            case (int)LikeEntityType.ArticleComment:
                var comment = commentRepository.Get(entityId, null);
                if (comment == null)
                {
                    return new ValidationStateDto(false, string.Empty, [$"Nie odnaleziono komentarza o id '{entityId}'."]);
                }
                return new ValidationStateDto(true, string.Empty, []);
            default:
                return new ValidationStateDto(false, string.Empty, [$"Wartość {entityType} nie istnieje dla {nameof(LikeEntityType)}"]);
        }
    }
}
