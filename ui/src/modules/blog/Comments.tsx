import React, { useState } from "react";
import { User, MessageCircle, Heart } from "lucide-react";
import { TextArea } from "../../components/inputs/TextArea";
import {
  useAddComment,
  useGetComments,
  useSetCommentLike,
} from "../../api/hooks/BlogApiHooks";
import { Loader } from "../../components/common/Loader";
import { Error } from "../../components/common/Error";
import { CommentResponseDto } from "../../api/client";

interface ICommentsProps {
  articleId: string;
}

export const Comments = ({ articleId }: ICommentsProps) => {
  const [newComment, setNewComment] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const commentMutation = useAddComment(
    (data) => {
      if (data.success) {
        setErrorMessage("");
        setNewComment("");
      } else {
        setErrorMessage(data.errors?.join(". ") ?? "");
      }
      setIsLoading(false);
    },
    (error) => {
      setErrorMessage(error);
      setIsLoading(false);
    }
  );

  const { data, error, isLoading: isDataLoading } = useGetComments(articleId);
  if (isDataLoading) {
    return <Loader />;
  }

  if (error || !data) {
    return (
      <Error
        message={
          error?.message || "Wystąpił problem z załadowaniem komentarzy."
        }
      />
    );
  }

  const comments = data;

  const handleCommentSubmit = (
    e: React.FormEvent,
    parentCommentId?: string
  ) => {
    e.preventDefault();
    if (newComment.trim()) {
      setIsLoading(true);
      commentMutation.mutateAsync({
        articleId,
        content: newComment,
        parentCommentId,
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center mb-8">
        <MessageCircle className="h-6 w-6 text-blue-600 mr-3" />
        <h3 className="text-2xl font-bold text-gray-900">
          Komentarze ({comments.length})
        </h3>
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleCommentSubmit} className="mb-8">
        <TextArea
          id="newComment"
          label=""
          placeholder="Podziel się swoimi myślami na temat tego artykułu..."
          value={newComment}
          onChange={(value) => setNewComment(value)}
          disabled={false}
          rows={4}
        />
        <div className="flex justify-end mt-4">
          {isLoading ? (
            <Loader />
          ) : (
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Dodaj komentarz
            </button>
          )}
        </div>
        {errorMessage && <Error message={errorMessage} />}
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

interface CommentCardProps {
  comment: CommentResponseDto;
}

const CommentCard = ({ comment }: CommentCardProps) => {
  const [isLiked, setIsLiked] = useState(comment.likes.isLikedByCurrentUser);

  const commentLikeMutation = useSetCommentLike(
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

  const handleLikedChanged = (isLiked: boolean) => {
    console.log("ste to ", isLiked);
    setIsLiked(isLiked);
    commentLikeMutation.mutateAsync({ entityId: comment.id, isLiked });
  };

  const likesWithoutUser =
    comment.likes.likes - (comment.likes.isLikedByCurrentUser ? 1 : 0);

  return (
    <div className="border-l-4 border-blue-100 pl-6 py-4 bg-gray-50 rounded-r-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-blue-400 to-purple-500 p-2 rounded-full mr-3">
            <User className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">{comment.author}</div>
            <div className="text-sm text-gray-500">
              {comment.createdAt.toLocaleDateString()} o{" "}
              {comment.createdAt.toLocaleTimeString()}
            </div>
          </div>
        </div>
        <button
          onClick={() => handleLikedChanged(!isLiked)}
          className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors ${
            isLiked
              ? "bg-red-50 text-red-600 border border-red-200"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
          <span>{likesWithoutUser + (isLiked ? 1 : 0)}</span>
        </button>
      </div>
      <p className="text-gray-700 leading-relaxed">{comment.content}</p>
    </div>
  );
};
