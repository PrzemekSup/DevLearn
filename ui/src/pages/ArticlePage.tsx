import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Calendar,
  User,
  ArrowLeft,
  MessageCircle,
  Heart,
  Share2,
  BookOpen,
  Clock,
  Tag,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  likes: number;
  replies?: Comment[];
}

const ArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
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

  // Mock article data with rich content including HTML formatting
  const article = {
    id: id || "1",
    title: "Getting Started with TypeScript in 2024",
    author: "Sarah Johnson",
    publishedAt: new Date("2024-01-15"),
    readTime: "5 min read",
    category: "JavaScript",
    tags: ["TypeScript", "JavaScript", "Beginner", "Web Development"],
    likes: 42,
    views: 1520,
    content: `
TypeScript has become an <strong>essential tool</strong> for modern JavaScript development. In this comprehensive guide, we'll explore why TypeScript is <em>crucial</em> for building scalable applications and how to get started with it in 2024.

## What is TypeScript?

TypeScript is a <strong>strongly typed programming language</strong> that builds on JavaScript, giving you better tooling at any scale. It's developed and maintained by <a href="https://www.microsoft.com" target="_blank">Microsoft</a> and has gained tremendous adoption in the developer community.

![TypeScript Logo](https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop)

### Key Benefits

- <strong>Type Safety</strong>: Catch errors at <em>compile time</em> rather than runtime
- <strong>Better IDE Support</strong>: Enhanced autocomplete, refactoring, and navigation
- <strong>Improved Code Documentation</strong>: Types serve as <em>inline documentation</em>
- <strong>Scalability</strong>: Better suited for large codebases and team collaboration

For more information about TypeScript's benefits, check out the <a href="https://www.typescriptlang.org/why-create-typescript" target="_blank">official TypeScript documentation</a>.

## Setting Up Your Environment

Let's start by setting up a TypeScript development environment. You can find the complete installation guide on the <a href="https://www.typescriptlang.org/download" target="_blank">TypeScript website</a>:

\`\`\`bash
# Install TypeScript globally
npm install -g typescript

# Create a new project directory
mkdir my-typescript-project
cd my-typescript-project

# Initialize package.json
npm init -y

# Install TypeScript as a dev dependency
npm install --save-dev typescript @types/node

# Create tsconfig.json
tsc --init
\`\`\`

## Basic Types

TypeScript provides several <strong>basic types</strong> that you'll use frequently. The <a href="https://www.typescriptlang.org/docs/handbook/2/everyday-types.html" target="_blank">TypeScript Handbook</a> provides comprehensive documentation on all available types:

\`\`\`typescript
// Primitive types
let name: string = "John";
let age: number = 30;
let isActive: boolean = true;

// Arrays
let numbers: number[] = [1, 2, 3, 4, 5];
let names: string[] = ["Alice", "Bob", "Charlie"];

// Objects
interface User {
  id: number;
  name: string;
  email: string;
  isActive?: boolean; // Optional property
}

const user: User = {
  id: 1,
  name: "John Doe",
  email: "john@example.com"
};
\`\`\`

## TypeScript Adoption Statistics

The following chart shows TypeScript's <em>growing popularity</em> in the developer community. According to the <a href="https://survey.stackoverflow.com/2023/" target="_blank">Stack Overflow Developer Survey 2023</a>, TypeScript ranks among the most loved programming languages:

![TypeScript Adoption Chart](https://images.pexels.com/photos/590022/pexels-photo-590022.jpg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop)

*TypeScript usage has grown <strong>exponentially</strong>, with over <em>78% of developers</em> now using it in production applications.*

## Functions and Interfaces

Functions in TypeScript can have <strong>typed parameters</strong> and <em>return types</em>. Learn more about function types in the <a href="https://www.typescriptlang.org/docs/handbook/2/functions.html" target="_blank">official documentation</a>:

\`\`\`typescript
function greetUser(user: User): string {
  return \`Hello, \${user.name}!\`;
}

// Arrow function with types
const calculateArea = (width: number, height: number): number => {
  return width * height;
};

// Interface for function types
interface Calculator {
  (a: number, b: number): number;
}

const add: Calculator = (a, b) => a + b;
const multiply: Calculator = (a, b) => a * b;
\`\`\`

## Classes and Inheritance

TypeScript supports <strong>modern class syntax</strong> with type annotations. The <a href="https://www.typescriptlang.org/docs/handbook/2/classes.html" target="_blank">Classes documentation</a> covers all the advanced features:

\`\`\`typescript
class Animal {
  protected name: string;
  
  constructor(name: string) {
    this.name = name;
  }
  
  move(distance: number = 0): void {
    console.log(\`\${this.name} moved \${distance} meters\`);
  }
}

class Dog extends Animal {
  private breed: string;
  
  constructor(name: string, breed: string) {
    super(name);
    this.breed = breed;
  }
  
  bark(): void {
    console.log("Woof! Woof!");
  }
}

const myDog = new Dog("Buddy", "Golden Retriever");
myDog.move(10);
myDog.bark();
\`\`\`

## Development Workflow Comparison

![Development Workflow](https://images.pexels.com/photos/574071/pexels-photo-574071.jpg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop)

*Modern TypeScript development workflow with <strong>integrated tooling</strong> and <em>real-time error checking</em>.*

## Generic Types

<strong>Generics</strong> allow you to create <em>reusable components</em> that work with multiple types. Check out the comprehensive <a href="https://www.typescriptlang.org/docs/handbook/2/generics.html" target="_blank">Generics guide</a> for advanced patterns:

\`\`\`typescript
// Generic function
function identity<T>(arg: T): T {
  return arg;
}

let stringResult = identity<string>("Hello");
let numberResult = identity<number>(42);

// Generic interface
interface Repository<T> {
  create(item: T): T;
  findById(id: string): T | null;
  update(id: string, item: Partial<T>): T;
  delete(id: string): boolean;
}

// Implementation
class UserRepository implements Repository<User> {
  private users: User[] = [];
  
  create(user: User): User {
    this.users.push(user);
    return user;
  }
  
  findById(id: string): User | null {
    return this.users.find(u => u.id.toString() === id) || null;
  }
  
  update(id: string, updates: Partial<User>): User {
    const user = this.findById(id);
    if (user) {
      Object.assign(user, updates);
    }
    return user!;
  }
  
  delete(id: string): boolean {
    const index = this.users.findIndex(u => u.id.toString() === id);
    if (index > -1) {
      this.users.splice(index, 1);
      return true;
    }
    return false;
  }
}
\`\`\`

## Performance Benefits

![Performance Chart](https://images.pexels.com/photos/669610/pexels-photo-669610.jpg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop)

*Studies from <a href="https://github.com/microsoft/TypeScript/wiki/Performance" target="_blank">Microsoft Research</a> show that TypeScript can <strong>reduce bugs by up to 15%</strong> and <em>improve development speed by 20%</em>.*

## Best Practices

Here are some <strong>best practices</strong> to follow when working with TypeScript. For more detailed guidelines, visit the <a href="https://typescript-eslint.io/rules/" target="_blank">TypeScript ESLint rules</a>:

1. <strong>Enable Strict Mode</strong>: Use strict compiler options for better type checking
2. <strong>Use Interfaces for Object Shapes</strong>: Define clear contracts for your data structures
3. <strong>Leverage Union Types</strong>: Use union types for values that can be <em>multiple types</em>
4. <strong>Avoid 'any' Type</strong>: Use specific types or <em>'unknown'</em> instead of 'any'
5. <strong>Use Type Guards</strong>: Implement type guards for runtime type checking

### Configuration Example

Here's a <em>recommended configuration</em> based on the <a href="https://www.typescriptlang.org/tsconfig" target="_blank">official TSConfig reference</a>:

\`\`\`json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
\`\`\`

## Community and Resources

The TypeScript community is <strong>vibrant and helpful</strong>. Here are some valuable resources:

- <a href="https://www.typescriptlang.org/" target="_blank">Official TypeScript Website</a>
- <a href="https://github.com/microsoft/TypeScript" target="_blank">TypeScript GitHub Repository</a>
- <a href="https://stackoverflow.com/questions/tagged/typescript" target="_blank">TypeScript on Stack Overflow</a>
- <a href="https://www.reddit.com/r/typescript/" target="_blank">TypeScript Reddit Community</a>
- <a href="https://discord.gg/typescript" target="_blank">TypeScript Discord Server</a>

## Conclusion

TypeScript provides a <strong>robust foundation</strong> for building scalable JavaScript applications. By adding <em>static typing</em> to JavaScript, it helps catch errors early, improves code documentation, and enhances the development experience.

Start incorporating TypeScript into your projects <em>gradually</em>, and you'll quickly see the benefits in terms of <strong>code quality</strong> and <em>developer productivity</em>.

## Next Steps

- Explore <strong>advanced TypeScript features</strong> like conditional types and mapped types
- Learn about TypeScript with popular frameworks like <a href="https://react-typescript-cheatsheet.netlify.app/" target="_blank">React</a>, <a href="https://angular.io/guide/typescript-configuration" target="_blank">Angular</a>, or <a href="https://vuejs.org/guide/typescript/overview.html" target="_blank">Vue</a>
- Set up a TypeScript project with build tools like <a href="https://webpack.js.org/guides/typescript/" target="_blank">Webpack</a> or <a href="https://vitejs.dev/guide/features.html#typescript" target="_blank">Vite</a>
- Dive into TypeScript's <a href="https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API" target="_blank">compiler API</a> for advanced use cases

<em>Happy coding!</em>
    `,
  };

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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: "Check out this great article!",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const processTextFormatting = (text: string): string => {
    return (
      text
        // Bold text: <strong>text</strong> or **text**
        .replace(
          /\*\*(.*?)\*\*/g,
          '<strong class="font-semibold text-gray-900">$1</strong>'
        )
        .replace(
          /<strong>(.*?)<\/strong>/g,
          '<strong class="font-semibold text-gray-900">$1</strong>'
        )

        // Italic text: <em>text</em> or *text*
        .replace(
          /(?<!\*)\*([^*]+)\*(?!\*)/g,
          '<em class="italic text-gray-800">$1</em>'
        )
        .replace(/<em>(.*?)<\/em>/g, '<em class="italic text-gray-800">$1</em>')

        // External links: <a href="url" target="_blank">text</a>
        .replace(
          /<a href="([^"]*)"([^>]*)>(.*?)<\/a>/g,
          (match, href, attrs, text) => {
            const isExternal = href.startsWith("http") || href.startsWith("//");
            const targetAttr = attrs.includes("target=")
              ? attrs
              : `${attrs} target="_blank" rel="noopener noreferrer"`;
            const classes =
              "text-blue-600 hover:text-blue-800 underline font-medium transition-colors inline-flex items-center gap-1";

            if (isExternal) {
              return `<a href="${href}"${targetAttr} class="${classes}">${text}<svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></a>`;
            }
            return `<a href="${href}"${targetAttr} class="${classes}">${text}</a>`;
          }
        )
    );
  };

  const renderContent = (content: string) => {
    const lines = content.split("\n");
    const elements: JSX.Element[] = [];
    let currentCodeBlock = "";
    let currentLanguage = "";
    let inCodeBlock = false;
    let codeBlockId = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.startsWith("```")) {
        if (inCodeBlock) {
          // End of code block
          codeBlockId++;
          const blockId = `code-${codeBlockId}`;
          elements.push(
            <div key={`code-${i}`} className="relative group my-8">
              <div className="bg-gray-900 rounded-t-lg px-4 py-3 flex items-center justify-between border-b border-gray-700">
                <span className="text-gray-300 text-sm font-medium capitalize flex items-center">
                  <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                  <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-4"></span>
                  {currentLanguage || "code"}
                </span>
                <button
                  onClick={() => copyToClipboard(currentCodeBlock, blockId)}
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded hover:bg-gray-800"
                  title="Copy code"
                >
                  {copiedCode === blockId ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
              <pre className="bg-gray-900 text-gray-100 p-6 rounded-b-lg overflow-x-auto">
                <code className="text-sm leading-relaxed font-mono">
                  {currentCodeBlock}
                </code>
              </pre>
            </div>
          );
          currentCodeBlock = "";
          currentLanguage = "";
          inCodeBlock = false;
        } else {
          // Start of code block
          currentLanguage = line.slice(3).trim();
          inCodeBlock = true;
        }
      } else if (inCodeBlock) {
        currentCodeBlock += (currentCodeBlock ? "\n" : "") + line;
      } else if (line.startsWith("# ")) {
        elements.push(
          <h1
            key={i}
            className="text-4xl font-bold text-gray-900 mt-12 mb-6 first:mt-0 leading-tight"
          >
            {line.slice(2)}
          </h1>
        );
      } else if (line.startsWith("## ")) {
        elements.push(
          <h2
            key={i}
            className="text-3xl font-bold text-gray-900 mt-10 mb-5 leading-tight"
          >
            {line.slice(3)}
          </h2>
        );
      } else if (line.startsWith("### ")) {
        elements.push(
          <h3
            key={i}
            className="text-2xl font-bold text-gray-900 mt-8 mb-4 leading-tight"
          >
            {line.slice(4)}
          </h3>
        );
      } else if (line.startsWith("![")) {
        // Image handling
        const match = line.match(/!\[(.*?)\]\((.*?)\)/);
        if (match) {
          const [, alt, src] = match;
          elements.push(
            <figure key={i} className="my-10">
              <div className="relative overflow-hidden rounded-xl shadow-2xl">
                <img
                  src={src}
                  alt={alt}
                  className="w-full h-auto transition-transform duration-300 hover:scale-105"
                />
              </div>
              {alt && (
                <figcaption className="text-center text-gray-600 text-sm mt-4 italic font-medium">
                  {alt}
                </figcaption>
              )}
            </figure>
          );
        }
      } else if (
        line.startsWith("*") &&
        line.endsWith("*") &&
        !line.startsWith("**") &&
        !line.includes("<")
      ) {
        // Italic text (caption) - only if it doesn't contain HTML
        elements.push(
          <p key={i} className="text-gray-600 text-center italic my-6 text-lg">
            {line.slice(1, -1)}
          </p>
        );
      } else if (line.startsWith("- ")) {
        // List item
        const processedText = processTextFormatting(line.slice(2));
        elements.push(
          <li
            key={i}
            className="text-gray-700 leading-relaxed mb-3 ml-6 text-lg relative before:content-['•'] before:text-blue-600 before:font-bold before:absolute before:-ml-6"
            dangerouslySetInnerHTML={{ __html: processedText }}
          />
        );
      } else if (line.match(/^\d+\./)) {
        // Numbered list item
        const processedText = processTextFormatting(
          line.replace(/^\d+\.\s*/, "")
        );
        elements.push(
          <li
            key={i}
            className="text-gray-700 leading-relaxed mb-3 ml-6 text-lg"
            dangerouslySetInnerHTML={{ __html: processedText }}
          />
        );
      } else if (line.trim()) {
        // Regular paragraph
        const processedText = processTextFormatting(line);
        elements.push(
          <p
            key={i}
            className="text-gray-700 leading-relaxed mb-6 text-lg"
            dangerouslySetInnerHTML={{ __html: processedText }}
          />
        );
      }
    }

    return elements;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            to="/blog"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-6 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>

          <div className="mb-6">
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                {article.category}
              </span>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {article.publishedAt.toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {article.readTime}
              </div>
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                {article.views.toLocaleString()} views
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
                    {article.author}
                  </div>
                  <div className="text-gray-600">
                    Senior Software Engineer at Microsoft
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isLiked
                      ? "bg-red-50 text-red-600 border border-red-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
                  }`}
                >
                  <Heart
                    className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`}
                  />
                  <span className="font-medium">
                    {article.likes + (isLiked ? 1 : 0)}
                  </span>
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors border border-gray-200"
                >
                  <Share2 className="h-5 w-5" />
                  <span className="font-medium">Share</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {article.tags.map((tag) => (
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

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12">
          <div className="prose prose-lg max-w-none">
            {renderContent(article.content)}
          </div>
        </article>

        {/* Comments Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center mb-8">
            <MessageCircle className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-2xl font-bold text-gray-900">
              Comments ({comments.length})
            </h3>
          </div>

          {/* Add Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts about this article..."
              rows={4}
              className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors"
            />
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Post Comment
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
      </div>
    </div>
  );
};

interface CommentCardProps {
  comment: Comment;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
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
              {comment.timestamp.toLocaleDateString()} at{" "}
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

export default ArticlePage;
