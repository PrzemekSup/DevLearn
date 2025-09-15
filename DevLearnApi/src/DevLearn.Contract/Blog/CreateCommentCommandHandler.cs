using DevLearn.Contract.Abstractions;
using DevLearn.Contract.Blog.Dtos;
using DevLearn.Contract.Blog.IRepositories;
using DevLearn.Helpers;

namespace DevLearn.Contract.Blog;

public class CreateCommentCommandHandler(ICommentRepository commentRepository, IArticleRepository articleRepository) : ICommandHandler<CreateCommentCommand, ValidationStateDto>
{
    public async Task<ValidationStateDto> HandleAsync(CreateCommentCommand command, CancellationToken cancellationToken = default)
    {
        var validation = await Validate(command.Request, command.Author);
        if (!validation.Success)
        {
            // todo: logger errorMessage
            return validation;
        }

        await commentRepository.CreateAsync(command.Request, command.Author);
        return new ValidationStateDto(true, "Komentarz został dodany", []);
    }

    private async Task<ValidationStateDto> Validate(CreateCommentRequest request, string author)
    {
        var isSuccess = true;
        var errorMessages = new List<string>();
        var article = await articleRepository.GetAsync(request.ArticleId);
        if (article == null)
        {
            var errorMessage = "Coś poszło nie tak. Nie odnaleziono artykułu dla komentarza.";
            isSuccess = false;
            errorMessages.Add(errorMessage);
        }

        if (string.IsNullOrEmpty(author) || author.Length > 50)
        {
            var errorMessage = $"Nieprawidłowa nazwa autora komentarza ({author})";
            isSuccess = false;
            errorMessages.Add(errorMessage);
        }

        if (string.IsNullOrEmpty(request.Content) || request.Content.Length > 1000)
        {
            var errorMessage = string.IsNullOrWhiteSpace(request.Content)
                ? "Brak komentarza, jaki powinien zostać dodany"
                : $"Zbyt długi komentarz. Maksymalnie dopuszcza się 1000 znaków, obecny komentarz ma {request.Content.Length}";
            isSuccess = false;
            errorMessages.Add(errorMessage);
        }

        if (request.ParentCommentId.HasValue)
        {
            var comment = commentRepository.Get(request.ArticleId, request.ParentCommentId.Value, null);
            if (comment == null)
            {
                var errorMessage = $"Komentarz na który próbujesz odpowiedzieć, nie istnieje. ({request.ArticleId}; {request.ParentCommentId})";
                isSuccess = false;
                errorMessages.Add(errorMessage);
            }
        }

        return isSuccess ? new ValidationStateDto(true, string.Empty, []) : new ValidationStateDto(false, string.Empty, errorMessages.ToArray());
    }
}
