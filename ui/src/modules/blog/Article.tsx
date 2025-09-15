import { useParams } from "react-router-dom";
import { useGetArticleBySlug } from "../../api/hooks/BlogApiHooks";
import { Error } from "../../components/common/Error";
import { Comments } from "./Comments";
import { ArticleContentComponent } from "./ArticleContent";
import { ArticleHeader } from "./ArticleHeader";
import { Loader } from "../../components/common/Loader";

export const Article = () => {
  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading } = useGetArticleBySlug(id || "");

  if (isLoading) {
    return <Loader />;
  }

  if (error || !data || !data.article) {
    return (
      <Error message={error?.message || "Nie udało się wczytać artykułu"} />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ArticleHeader article={data.article} likes={data.likes} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ArticleContentComponent contents={data.contents} />
        <Comments articleId={data.article.id} />
      </div>
    </div>
  );
};
