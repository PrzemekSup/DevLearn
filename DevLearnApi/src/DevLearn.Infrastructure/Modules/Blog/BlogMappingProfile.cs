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
            .ForMember(a => a.ArticleContents, opts => opts.MapFrom(a => a.TextContents));

        CreateMap<BlogContract.CreateArticleTextContent, ArticleContent>()
            .ForMember(a => a.Id, opts => opts.MapFrom(a => Guid.NewGuid()))
            .ForMember(a => a.BlockType, opts => opts.MapFrom(a => ArticleContentType.Text))
            .ForMember(a => a.Content, opts => opts.MapFrom(a => a.Text));
    }
}
