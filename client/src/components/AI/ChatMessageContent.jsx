import React, { useState } from 'react';
import { Copy, Check, Code as CodeIcon, Terminal } from 'lucide-react';

const CodeBlock = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 text-xs font-mono shadow-lg">
      {/* Code Header */}
      <div className="px-3.5 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-slate-400">
        <span className="flex items-center gap-1.5 font-sans font-semibold text-[11px] text-indigo-300 uppercase">
          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
          {language || 'code'}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-1 transition-all text-[10px] cursor-pointer"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
          <span>{copied ? 'Copied!' : 'Copy Code'}</span>
        </button>
      </div>

      {/* Code Snippet Container */}
      <div className="p-3.5 overflow-x-auto text-slate-200 leading-relaxed font-mono selection:bg-indigo-600 selection:text-white">
        <pre className="whitespace-pre">{code}</pre>
      </div>
    </div>
  );
};

const ChatMessageContent = ({ content = '' }) => {
  if (!content) return null;

  // Split text by markdown code blocks (```lang ... ```)
  const codeBlockRegex = /```(\w*)\n?([\s\S]*?)```/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', text: content.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'code', language: match[1] || 'javascript', code: match[2].trim() });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push({ type: 'text', text: content.slice(lastIndex) });
  }

  // Simple Markdown text renderer for bold, lists, headers, inline code
  const renderTextSegment = (text, segKey) => {
    const lines = text.split('\n');

    return (
      <div key={segKey} className="space-y-1.5">
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} className="h-1.5" />;

          // Headers: ### Header or ## Header
          if (line.startsWith('### ')) {
            return (
              <h4 key={idx} className="text-sm font-bold text-white pt-2 pb-0.5 border-b border-slate-800/60">
                {formatInlineMarkdown(line.replace('### ', ''))}
              </h4>
            );
          }
          if (line.startsWith('## ')) {
            return (
              <h3 key={idx} className="text-base font-extrabold text-indigo-300 pt-2 pb-1">
                {formatInlineMarkdown(line.replace('## ', ''))}
              </h3>
            );
          }

          // Bullet point lists (- or *)
          if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
            const cleanLine = line.trim().replace(/^[-*]\s+/, '');
            return (
              <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                <span>{formatInlineMarkdown(cleanLine)}</span>
              </div>
            );
          }

          // Numbered lists (1. 2. 3.)
          const numMatch = line.trim().match(/^(\d+)\.\s+(.*)/);
          if (numMatch) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="font-mono text-indigo-400 font-bold text-[11px] shrink-0 mt-0.5">
                  {numMatch[1]}.
                </span>
                <span>{formatInlineMarkdown(numMatch[2])}</span>
              </div>
            );
          }

          // Standard paragraph text
          return <p key={idx}>{formatInlineMarkdown(line)}</p>;
        })}
      </div>
    );
  };

  // Helper for inline markdown: bold (**text**), inline code (`code`), italics (*text*)
  const formatInlineMarkdown = (str) => {
    const tokens = str.split(/(\*\*.*?\*\*|`.*?`|\*.*?\*)/g);

    return tokens.map((token, i) => {
      if (token.startsWith('**') && token.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-white">
            {token.slice(2, -2)}
          </strong>
        );
      }
      if (token.startsWith('`') && token.endsWith('`')) {
        return (
          <code key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 font-mono text-[11px] border border-slate-700/60">
            {token.slice(1, -1)}
          </code>
        );
      }
      if (token.startsWith('*') && token.endsWith('*')) {
        return (
          <em key={i} className="italic text-slate-300">
            {token.slice(1, -1)}
          </em>
        );
      }
      return token;
    });
  };

  return (
    <div className="space-y-2">
      {parts.map((part, index) => {
        if (part.type === 'code') {
          return <CodeBlock key={index} code={part.code} language={part.language} />;
        }
        return renderTextSegment(part.text, index);
      })}
    </div>
  );
};

export default ChatMessageContent;
