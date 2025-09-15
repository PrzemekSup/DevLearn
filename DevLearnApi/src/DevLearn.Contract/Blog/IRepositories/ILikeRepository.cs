namespace DevLearn.Contract.Blog.IRepositories;

public interface ILikeRepository
{
    /// <summary>
    /// Register "like" click in database
    /// </summary>
    Task AddAsync(int entityType, Guid entityId, string userId);

    /// <summary>
    /// Deletes "like" click in database
    /// </summary>
    Task RemoveAsync(int entityType, Guid entityId, string userId);

    /// <summary>
    /// Verifies if user already liked this entity.
    /// </summary>
    Task<bool> Exist(int entityType, Guid entityId, string userId);
}
