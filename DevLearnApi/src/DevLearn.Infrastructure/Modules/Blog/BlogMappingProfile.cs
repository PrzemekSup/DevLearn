using AutoMapper;
using DevLearn.Infrastructure.Modules.Blog.Entities;
using BlogContract = DevLearn.Contract.Blog.Dtos;

namespace DevLearn.Infrastructure.Modules.Blog;

public class BlogMappingProfile : Profile
{
    public BlogMappingProfile()
    {
        CreateMap<BlogContract.CreateArticleRequest, Article>()
            .ForMember(a => a.Id, opts => opts.MapFrom(a => Guid.NewGuid()))
            .ForMember(a => a.Views, opts => opts.MapFrom(a => 0))
            .ForMember(a => a.ArticleContents, opts => opts.MapFrom(a => a.Contents.ToList()));

        CreateMap<BlogContract.ArticleContent, ArticleContent>()
            .ForMember(a => a.Id, opts => opts.MapFrom(a => Guid.NewGuid()));
    }
}
