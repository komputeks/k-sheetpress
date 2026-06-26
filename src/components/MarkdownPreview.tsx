'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownPreviewProps {
  content: string;
}

export default function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-heading prose-a:text-accent-600 dark:prose-a:text-accent-400 prose-pre:bg-surface-muted dark:prose-pre:bg-white/5 prose-pre:border prose-pre:border-surface-border">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
