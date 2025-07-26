import React from "react";

interface FormattedMessageContentProps {
  content: string;
  isUser?: boolean;
  isSystemMessage?: boolean;
}

// Utility function to render formatted message content
function renderFormattedContent(content: string) {
  // Split by lines for block-level formatting
  const lines = content.split("\n");
  return lines.map((line, idx) => {
    // Bullet points
    if (/^\s*[-•]\s+/.test(line)) {
      return (
        <li key={idx} className="ml-5 list-disc text-sm">
          {renderInlineFormatting(line.replace(/^\s*[-•]\s+/, ""))}
        </li>
      );
    }
    // Headings (e.g., **Title:**)
    if (/^\*\*.+\*\*/.test(line)) {
      return (
        <div key={idx} className="font-semibold text-base mt-2 mb-1">
          {renderInlineFormatting(line)}
        </div>
      );
    }
    // Italic (e.g., _text_)
    if (/^_.+_$/.test(line)) {
      return (
        <div key={idx} className="italic text-xs opacity-75 mt-1 mb-1">
          {renderInlineFormatting(line)}
        </div>
      );
    }
    // Default paragraph
    return (
      <div key={idx} className="text-sm mt-1 mb-1">
        {renderInlineFormatting(line)}
      </div>
    );
  });
}

// Utility for inline formatting (bold, italic, links)
function renderInlineFormatting(text: string) {
  // Bold (**text**)
  text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  // Italic (_text_)
  text = text.replace(/_(.+?)_/g, "<em>$1</em>");
  // Links [text](url)
  text = text.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-primary underline" target="_blank" rel="noopener noreferrer">$1</a>'
  );
  return <span dangerouslySetInnerHTML={{ __html: text }} />;
}

export const FormattedMessageContent = ({
  content,
  isUser = false,
  isSystemMessage = false,
}: FormattedMessageContentProps) => {
  return (
    <div className={`text-sm ${isSystemMessage ? "font-medium" : ""}`}>
      {/* Enhanced formatting rendering */}
      {Array.isArray(
        content.split("\n").filter((l) => /^\s*[-•]\s+/.test(l))
      ) && content.split("\n").some((l) => /^\s*[-•]\s+/.test(l)) ? (
        <ul className="mb-1">{renderFormattedContent(content)}</ul>
      ) : (
        renderFormattedContent(content)
      )}
    </div>
  );
};
