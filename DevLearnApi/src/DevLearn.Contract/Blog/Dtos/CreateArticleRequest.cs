namespace DevLearn.Contract.Blog.Dtos;

public record CreateArticleRequest(string Title, string Description, string Slug, Guid AuthorId, bool IsAccepted, CreateArticleTextContent[] TextContents);

public record CreateArticleTextContent(int BlockOrder, string Text);

public enum ArticleContentType
{
    Text,
    Code,
    Image,
    Video
}
