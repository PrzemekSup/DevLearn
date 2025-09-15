using DevLearn.Contract.Blog.IRepositories;
using DevLearn.Infrastructure.Modules.Blog.Entities;
using Microsoft.EntityFrameworkCore;

namespace DevLearn.Infrastructure.Modules.Blog.Repositories;

public class LikeRepository(BlogDbContext context) : ILikeRepository
{
    /// <inheritdoc />
    public async Task AddAsync(int entityType, Guid entityId, string userId)
    {
        context.Likes.Add(new Like()
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            EntityId = entityId,
            EntityType = entityType
        });
        await context.SaveChangesAsync();
    }

    /// <inheritdoc />
    public async Task RemoveAsync(int entityType, Guid entityId, string userId)
    {
        var like = await context.Likes.FirstOrDefaultAsync(x => x.UserId == userId && x.EntityType == entityType && x.EntityId == entityId);
        if (like != null)
        {
            context.Likes.Remove(like);
            await context.SaveChangesAsync();
        }
    }

    /// <inheritdoc />
    public async Task<bool> Exist(int entityType, Guid entityId, string userId)
    {
        var like = await context.Likes.FirstOrDefaultAsync(x => x.UserId == userId && x.EntityType == entityType && x.EntityId == entityId);
        return like != null;
    }
}
