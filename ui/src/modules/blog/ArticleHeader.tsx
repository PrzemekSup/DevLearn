import { Calendar, User, Heart, BookOpen, Clock, Tag } from "lucide-react";
import { ArticleDto, LikeDto } from "../../api/client";
import { LinkGetBack } from "../../components/common/Links";
import { ButtonShare } from "../../components/common/ButtonShare";
import { useSetArticleLike } from "../../api/hooks/BlogApiHooks";
import { useState } from "react";

interface IArticleHeaderProps {
  article: ArticleDto;
  likes: LikeDto;
}

export const ArticleHeader = ({ article, likes }: IArticleHeaderProps) => {
  const [isLiked, setIsLiked] = useState<boolean>(likes.isLikedByCurrentUser);
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: "Zobacz ten artykuł!",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link skopiowany do schowka!");
    }
  };

  const commentLikeMutation = useSetArticleLike(
    (data) => {
      if (!data.success) {
        alert(data.errors?.join(". ") ?? "");
        setIsLiked((liked) => !liked);
      }
    },
    (error) => {
      alert(error);
      setIsLiked((liked) => !liked);
    }
  );

  const handleIsLikedChange = (isLiked: boolean) => {
    commentLikeMutation.mutateAsync({ entityId: article.id, isLiked });
    setIsLiked(isLiked);
  };

  const likesWithoutUser = likes.likes - (likes.isLikedByCurrentUser ? 1 : 0);

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <LinkGetBack to="/blog" text="Powrót do strony głównej" />

        <div className="mb-6">
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
              {article.category}
            </span>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {article.createdAt?.toLocaleDateString()}
            </div>
            {article.readTimeInMins && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {article.readTimeInMins} minut czytania
              </div>
            )}
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-1" />
              {article.views?.toLocaleString()} wyświetleń
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {article.title}
          </h1>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full mr-4">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-lg">
                  {article.articleAuthor.displayName}
                </div>
                <div className="text-gray-600">
                  {article.articleAuthor.description}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleIsLikedChange(!isLiked)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isLiked
                    ? "bg-red-50 text-red-600 border border-red-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
                }`}
              >
                <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
                <span className="font-medium">
                  {likesWithoutUser + (isLiked ? 1 : 0)}
                </span>
              </button>
              <ButtonShare onClick={handleShare} />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {article.tags?.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-200 transition-colors"
            >
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
