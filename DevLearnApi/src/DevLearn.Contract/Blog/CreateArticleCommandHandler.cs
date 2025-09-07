using DevLearn.Contract.Abstractions;
using DevLearn.Contract.Blog.Dtos;
using DevLearn.Contract.Blog.IRepositories;
using DevLearn.Helpers;

namespace DevLearn.Contract.Blog;

public class CreateArticleCommandHandler(
    IArticleRepository repository,
    ITagRepository tagRepository
) : ICommandHandler<CreateArticleCommand, ValidationStateDto>
{
    public async Task<ValidationStateDto> HandleAsync(CreateArticleCommand command, CancellationToken cancellationToken = default)
    {
        var validation = await Validate(command.Request);
        if (!validation.Success)
        {
            // todo: logger (errorMessage)
            return validation;
        }

        await repository.CreateAsync(command.Request);
        return new ValidationStateDto(true, "Dodano nowy komentarz", []);
    }

    public async Task<ValidationStateDto> Validate(CreateArticleRequest request)
    {
        var isSuccess = true;
        var errorMessages = new List<string>();
        if (string.IsNullOrEmpty(request.Title) || request.Title.Length > 500)
        {
            var errorMessage = string.IsNullOrWhiteSpace(request.Title)
                ? "Brak nagłówka, jaki powinien zostać dodany"
                : $"Zbyt długi nagłówek. Maksymalnie dopuszcza się 500 znaków, obecny nagłówek ma {request.Title.Length}";
            isSuccess = false;
            errorMessages.Add(errorMessage);
        }

        if (string.IsNullOrEmpty(request.Description) || request.Description.Length > 1000)
        {
            var errorMessage = string.IsNullOrWhiteSpace(request.Description)
                ? "Brak wstępu"
                : $"Zbyt długi wstęp. Maksymalnie dopuszcza się 1000 znaków, obecny wstęp ma {request.Description.Length}";
            isSuccess = false;
            errorMessages.Add(errorMessage);
        }

        if (string.IsNullOrEmpty(request.Slug) || request.Slug.Length > 200)
        {
            var errorMessage = string.IsNullOrWhiteSpace(request.Slug)
                ? "Brak linku do artykułu"
                : $"Zbyt długi link. Maksymalnie dopuszcza się 200 znaków, obecny link ma {request.Slug.Length}";
            isSuccess = false;
            errorMessages.Add(errorMessage);
        }

        var categoryExist = await tagRepository.ExistsAsync([request.CategoryId]).ConfigureAwait(false);

        if (!categoryExist)
        {
            var errorMessage = $"Nieprawidłowa kategoria ({request.CategoryId})";
            isSuccess = false;
            errorMessages.Add(errorMessage);
        }

        var author = repository.GetAuthorAsync(request.AuthorId);
        if (author == null)
        {
            var errorMessage = $"Niepoprawna wartość dla autora {request.AuthorId}";
            isSuccess = false;
            errorMessages.Add(errorMessage);
        }

        return isSuccess ? new ValidationStateDto(true, string.Empty, []) : new ValidationStateDto(false, string.Empty, errorMessages.ToArray());
    }
}
