import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts markdown-like text to HTML for rendering AI responses.
 * Handles: **bold**, *italic*, `code`, bullet lists, numbered lists,
 * headings, newlines, and links.
 */
export function formatMarkdown(text: string): string {
  let html = text;

  // Escape HTML entities first to prevent XSS
  html = html
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">");

  // Code blocks (``` ... ```)
  html = html.replace(
    /```(\w*)\n([\s\S]*?)```/g,
    '<pre class="msg-code-block"><code>$2</code></pre>'
  );

  // Inline code (`code`)
  html = html.replace(/`([^`]+)`/g, '<code class="msg-inline-code">$1</code>');

  // Bold (**text** or __text__)
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/__(.+?)__/g, "<strong>$1</strong>");

  // Italic (*text* or _text_) - but not inside words with underscores
  html = html.replace(/(?<!\w)\*([^*\n]+)\*(?!\w)/g, "<em>$1</em>");
  html = html.replace(/(?<!\w)_([^_\n]+)_(?!\w)/g, "<em>$1</em>");

  // Headings (### Heading)
  html = html.replace(/^### (.+)$/gm, '<h4 class="msg-heading">$1</h4>');
  html = html.replace(/^## (.+)$/gm, '<h3 class="msg-heading">$1</h3>');
  html = html.replace(/^# (.+)$/gm, '<h2 class="msg-heading">$1</h2>');

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr class="msg-hr"/>');

  // Unordered lists - group consecutive lines starting with - or *
  html = html.replace(
    /((?:^[\t ]*[-*] .+$(?:\n|$))+)/gm,
    (match) => {
      const items = match
        .trim()
        .split(/\n/)
        .map((line) => `<li>${line.replace(/^[\t ]*[-*] /, "")}</li>`)
        .join("");
      return `<ul class="msg-list">${items}</ul>`;
    }
  );

  // Ordered lists - group consecutive lines starting with 1. 2. etc
  html = html.replace(
    /((?:^[\t ]*\d+\. .+$(?:\n|$))+)/gm,
    (match) => {
      const items = match
        .trim()
        .split(/\n/)
        .map((line) => `<li>${line.replace(/^[\t ]*\d+\. /, "")}</li>`)
        .join("");
      return `<ol class="msg-list">${items}</ol>`;
    }
  );

  // Links [text](url)
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="msg-link">$1</a>'
  );

  // Convert double newlines to paragraph breaks
  html = html.replace(/\n\n/g, "</p><p>");

  // Convert single newlines to <br/> (but not inside list/pre blocks)
  html = html.replace(
    /(?<!<\/?(?:ul|ol|li|pre|code|h[2-4]|hr)[^>]*>)\n(?!<\/?(?:ul|ol|li|pre|code|h[2-4])[^>]*>)/g,
    "<br/>"
  );

  // Wrap in paragraph if not already wrapped in a block element
  if (!/^<(?:ul|ol|pre|h[2-4]|hr|p)/.test(html.trim())) {
    html = `<p>${html}</p>`;
  }

  // Remove empty <p></p>
  html = html.replace(/<p><\/p>/g, "");
  // Merge adjacent paragraphs
  html = html.replace(/<\/p>\s*<p>/g, '<br class="msg-paragraph-break"/>');

  return html;
}
