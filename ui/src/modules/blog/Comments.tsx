import React, { useState } from "react";
import { User, MessageCircle, Heart } from "lucide-react";
import { TextArea } from "../../components/inputs/TextArea";

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  likes: number;
  replies?: Comment[];
}

export const Comments = () => {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: "John Doe",
      content:
        "Great article! TypeScript has really improved my development workflow. The type safety is invaluable for large projects.",
      timestamp: new Date("2024-01-16T10:30:00"),
      likes: 5,
    },
    {
      id: "2",
      author: "Jane Smith",
      content:
        "I love how you explained the interface concept. Coming from JavaScript, this was exactly what I needed to understand.",
      timestamp: new Date("2024-01-16T14:15:00"),
      likes: 3,
    },
    {
      id: "3",
      author: "Alex Johnson",
      content:
        "Would love to see a follow-up article on advanced TypeScript patterns like conditional types and mapped types!",
      timestamp: new Date("2024-01-17T09:20:00"),
      likes: 8,
    },
  ]);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        author: "You",
        content: newComment,
        timestamp: new Date(),
        likes: 0,
      };
      setComments([...comments, comment]);
      setNewComment("");
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
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Dodaj komentarz
          </button>
        </div>
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
  comment: Comment;
}

const CommentCard = ({ comment }: CommentCardProps) => {
  const [isLiked, setIsLiked] = useState(false);

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
              {comment.timestamp.toLocaleDateString()} o{" "}
              {comment.timestamp.toLocaleTimeString()}
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsLiked(!isLiked)}
          className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors ${
            isLiked
              ? "bg-red-50 text-red-600 border border-red-200"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
          <span>{comment.likes + (isLiked ? 1 : 0)}</span>
        </button>
      </div>
      <p className="text-gray-700 leading-relaxed">{comment.content}</p>
    </div>
  );
};
