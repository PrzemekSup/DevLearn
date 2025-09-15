using DevLearn.Contract.Blog.Dtos;

namespace DevLearn.Contract.Blog.IRepositories;

public interface ITagRepository
{
    /// <summary>
    /// Retrieves all tags.
    /// </summary>
    /// <returns>Array of tags.</returns>
    Task<TagDto[]> GetAsync();

    /// <summary>
    /// Verify if all provided tags exists.
    /// </summary>
    /// <param name="Ids">Identifiers of verified tags.</param>
    /// <returns>True when all exist, false if any of them does not exist.</returns>
    Task<bool> ExistsAsync(Guid[] Ids);
}
