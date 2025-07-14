import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Play, 
  BookOpen, 
  Code, 
  Users, 
  Award, 
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp
} from 'lucide-react';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Master Programming
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                One Step at a Time
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Interactive coding challenges, comprehensive tutorials, and hands-on projects 
              designed to transform you into a skilled developer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Continue Learning
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Start Learning Free
                    <Play className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    to="/blog"
                    className="inline-flex items-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Explore Articles
                    <BookOpen className="ml-2 h-5 w-5" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive learning tools designed for modern developers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Code}
              title="Interactive Code Editor"
              description="Write, test, and debug code directly in your browser with our advanced IDE"
              gradient="from-blue-500 to-blue-600"
            />
            <FeatureCard
              icon={BookOpen}
              title="Structured Learning Paths"
              description="Follow carefully crafted curricula from beginner to advanced levels"
              gradient="from-purple-500 to-purple-600"
            />
            <FeatureCard
              icon={Award}
              title="Real-world Projects"
              description="Build portfolio-worthy applications with guided project challenges"
              gradient="from-green-500 to-green-600"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <StatCard number="50,000+" label="Active Learners" />
            <StatCard number="200+" label="Coding Challenges" />
            <StatCard number="15+" label="Learning Paths" />
            <StatCard number="95%" label="Success Rate" />
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Latest Articles
              </h2>
              <p className="text-xl text-gray-600">
                Stay updated with the latest in programming
              </p>
            </div>
            <Link
              to="/blog"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
            >
              View All Articles
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <BlogCard
              title="Getting Started with TypeScript in 2024"
              excerpt="Learn the fundamentals of TypeScript and why it's essential for modern development."
              readTime="5 min read"
              category="JavaScript"
            />
            <BlogCard
              title="Building Scalable APIs with .NET Core"
              excerpt="Best practices for creating robust and maintainable backend services."
              readTime="8 min read"
              category=".NET"
            />
            <BlogCard
              title="Advanced React Patterns You Should Know"
              excerpt="Explore sophisticated React patterns that will level up your frontend skills."
              readTime="12 min read"
              category="React"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of developers who are already advancing their careers
            </p>
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  gradient: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, gradient }) => (
  <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
    <div className={`bg-gradient-to-r ${gradient} p-3 rounded-xl w-fit mb-6`}>
      <Icon className="h-6 w-6 text-white" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

interface StatCardProps {
  number: string;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ number, label }) => (
  <div className="text-center">
    <div className="text-4xl font-bold text-blue-600 mb-2">{number}</div>
    <div className="text-gray-600">{label}</div>
  </div>
);

interface BlogCardProps {
  title: string;
  excerpt: string;
  readTime: string;
  category: string;
}

const BlogCard: React.FC<BlogCardProps> = ({ title, excerpt, readTime, category }) => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
    <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50"></div>
    <div className="p-6">
      <div className="flex items-center justify-between mb-3">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
          {category}
        </span>
        <span className="text-sm text-gray-500">{readTime}</span>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 mb-4">{excerpt}</p>
      <Link
        to="/blog/1"
        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
      >
        Read More
        <ArrowRight className="ml-1 h-4 w-4" />
      </Link>
    </div>
  </div>
);

export default HomePage;