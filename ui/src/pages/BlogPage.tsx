import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, User, ArrowRight, Play, BookOpen } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: Date;
  readTime: string;
  category: string;
  type: 'article' | 'video';
  thumbnail?: string;
  tags: string[];
}

const BlogPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Getting Started with TypeScript in 2024',
      excerpt: 'Learn the fundamentals of TypeScript and why it\'s essential for modern development. This comprehensive guide covers everything from basic types to advanced patterns.',
      content: '...',
      author: 'Sarah Johnson',
      publishedAt: new Date('2024-01-15'),
      readTime: '5 min read',
      category: 'JavaScript',
      type: 'article',
      tags: ['TypeScript', 'JavaScript', 'Beginner']
    },
    {
      id: '2',
      title: 'Building Scalable APIs with .NET Core',
      excerpt: 'Best practices for creating robust and maintainable backend services using .NET Core. Learn about dependency injection, middleware, and more.',
      content: '...',
      author: 'Mike Chen',
      publishedAt: new Date('2024-01-12'),
      readTime: '8 min read',
      category: '.NET',
      type: 'article',
      tags: ['.NET', 'API', 'Backend']
    },
    {
      id: '3',
      title: 'Advanced React Patterns You Should Know',
      excerpt: 'Explore sophisticated React patterns that will level up your frontend skills including render props, compound components, and more.',
      content: '...',
      author: 'Emily Rodriguez',
      publishedAt: new Date('2024-01-10'),
      readTime: '12 min read',
      category: 'React',
      type: 'video',
      tags: ['React', 'Patterns', 'Advanced']
    },
    {
      id: '4',
      title: 'Database Design Principles for Beginners',
      excerpt: 'Understanding the fundamentals of relational database design, normalization, and best practices for SQL Server.',
      content: '...',
      author: 'David Kim',
      publishedAt: new Date('2024-01-08'),
      readTime: '10 min read',
      category: 'Database',
      type: 'article',
      tags: ['SQL Server', 'Database', 'Design']
    },
    {
      id: '5',
      title: 'Introduction to Clean Architecture',
      excerpt: 'Learn how to structure your applications using clean architecture principles for better maintainability and testability.',
      content: '...',
      author: 'Lisa Wang',
      publishedAt: new Date('2024-01-05'),
      readTime: '15 min read',
      category: 'Architecture',
      type: 'video',
      tags: ['Architecture', 'Clean Code', 'Design Patterns']
    },
    {
      id: '6',
      title: 'Git Workflow Best Practices',
      excerpt: 'Master Git with professional workflows, branching strategies, and collaboration techniques used in real-world projects.',
      content: '...',
      author: 'Alex Thompson',
      publishedAt: new Date('2024-01-03'),
      readTime: '7 min read',
      category: 'Tools',
      type: 'article',
      tags: ['Git', 'Version Control', 'Workflow']
    }
  ];

  const categories = ['all', 'JavaScript', '.NET', 'React', 'Database', 'Architecture', 'Tools'];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Developer Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Insights, tutorials, and best practices from experienced developers. 
            Stay up-to-date with the latest trends in programming.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles, videos, and topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category === 'all' ? 'All Categories' : category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map(post => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

interface BlogPostCardProps {
  post: BlogPost;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Thumbnail */}
      <div className="h-48 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          {post.type === 'video' ? (
            <div className="bg-white bg-opacity-90 rounded-full p-4">
              <Play className="h-8 w-8 text-blue-600" />
            </div>
          ) : (
            <div className="bg-white bg-opacity-90 rounded-full p-4">
              <BookOpen className="h-8 w-8 text-purple-600" />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Meta Info */}
        <div className="flex items-center justify-between mb-3">
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${
            post.type === 'video' 
              ? 'bg-red-100 text-red-700' 
              : 'bg-blue-100 text-blue-700'
          }`}>
            {post.category}
          </span>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            {post.publishedAt.toLocaleDateString()}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <User className="h-4 w-4 mr-1" />
            <span>{post.author}</span>
            <span className="mx-2">•</span>
            <span>{post.readTime}</span>
          </div>
          <Link
            to={`/blog/${post.id}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            Read More
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;