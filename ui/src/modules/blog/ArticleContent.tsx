import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { ArticleContent } from "../../api/client";

interface IArticleContentProps {
  contents: ArticleContent[];
}

export const ArticleContentComponent = ({ contents }: IArticleContentProps) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

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
          (_, href, attrs, text) => {
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
    <article className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12">
      <div className="prose prose-lg max-w-none">
        {renderContent(contents.map((content) => content.content).join("\n\n"))}
      </div>
    </article>
  );
};
