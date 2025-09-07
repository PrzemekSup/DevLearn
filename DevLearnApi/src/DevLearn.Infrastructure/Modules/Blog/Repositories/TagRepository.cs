using DevLearn.Contract.Blog.Dtos;
using DevLearn.Contract.Blog.IRepositories;
using DevLearn.Infrastructure.Modules.Blog.Entities;
using Microsoft.EntityFrameworkCore;

namespace DevLearn.Infrastructure.Modules.Blog.Repositories;

public class TagRepository(BlogDbContext context) : ITagRepository
{
    public async Task<TagDto[]> GetAsync()
    {
        var tags = await context.Tags.ToListAsync();
        return [.. tags.Select(x => new TagDto(x.Id, x.Name))];
    }

    public async Task<bool> ExistsAsync(Guid[] Ids)
    {
        var tags = await context.Tags.Where(x => Ids.Contains(x.Id)).ToListAsync();
        return tags.Count == Ids.Length;
    }
}
