import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Code, Image, Table, List, Quote, Heading, Type } from 'lucide-react';

const BlockBasedEditor = ({ value, onChange, placeholder = 'Start typing...' }) => {
    const [showHelper, setShowHelper] = useState(true);

    const handlePaste = (e) => {
        // Allow default paste behavior
    };

    const insertBlock = (blockType) => {
        const templates = {
            heading: '# Heading\n\n',
            code: '\n```javascript\n// Your code here\n```\n\n',
            list: '\n- Item 1\n- Item 2\n- Item 3\n\n',
            quote: '\n> Important note\n\n',
            table: '\n| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n\n',
            image: '\n![Alt text](https://via.placeholder.com/400)\n\n'
        };

        onChange(value + (templates[blockType] || ''));
    };

    return (
        <div className="block-editor">
            {/* Block Insert Toolbar */}
            {showHelper && (
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 mb-4 flex flex-wrap gap-2">
                    <button
                        onClick={() => insertBlock('heading')}
                        className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-slate-300 transition-colors"
                        title="Add Heading"
                    >
                        <Heading size={16} /> Heading
                    </button>
                    <button
                        onClick={() => insertBlock('code')}
                        className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-slate-300 transition-colors"
                        title="Add Code Block"
                    >
                        <Code size={16} /> Code
                    </button>
                    <button
                        onClick={() => insertBlock('list')}
                        className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-slate-300 transition-colors"
                        title="Add List"
                    >
                        <List size={16} /> List
                    </button>
                    <button
                        onClick={() => insertBlock('quote')}
                        className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-slate-300 transition-colors"
                        title="Add Quote"
                    >
                        <Quote size={16} /> Quote
                    </button>
                    <button
                        onClick={() => insertBlock('table')}
                        className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-slate-300 transition-colors"
                        title="Add Table"
                    >
                        <Table size={16} /> Table
                    </button>
                    <button
                        onClick={() => insertBlock('image')}
                        className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-slate-300 transition-colors"
                        title="Add Image"
                    >
                        <Image size={16} /> Image
                    </button>
                    <button
                        onClick={() => setShowHelper(false)}
                        className="ml-auto text-xs text-slate-500 hover:text-white px-2"
                    >
                        Hide
                    </button>
                </div>
            )}

            {!showHelper && (
                <button
                    onClick={() => setShowHelper(true)}
                    className="mb-2 text-xs text-slate-500 hover:text-hustle-accent flex items-center gap-1"
                >
                    <Type size={12} /> Show formatting tools
                </button>
            )}

            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onPaste={handlePaste}
                placeholder={placeholder + '\n\nTip: Use Markdown for formatting'}
                className="w-full h-full min-h-[400px] bg-slate-900 border border-slate-700 rounded-xl p-6 text-lg text-slate-300 resize-none focus:outline-none focus:border-hustle-accent placeholder-slate-700 leading-relaxed font-mono"
            />
        </div>
    );
};

// Custom components for rendering
const MarkdownRenderer = ({ content }) => {
    return (
        <div className="prose prose-invert prose-lg max-w-none">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                            <SyntaxHighlighter
                                style={vscDarkPlus}
                                language={match[1]}
                                PreTag="div"
                                className="rounded-xl"
                                {...props}
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        ) : (
                            <code className="bg-slate-800 px-1.5 py-0.5 rounded text-hustle-accent text-sm" {...props}>
                                {children}
                            </code>
                        );
                    },
                    h1: ({ children }) => <h1 className="text-4xl font-bold text-white mb-4 mt-8">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-3xl font-bold text-white mb-3 mt-6">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-2xl font-bold text-white mb-2 mt-4">{children}</h3>,
                    blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-hustle-accent pl-4 py-2 my-4 bg-slate-800/50 rounded-r-lg italic text-slate-400">
                            {children}
                        </blockquote>
                    ),
                    table: ({ children }) => (
                        <div className="overflow-x-auto my-4">
                            <table className="min-w-full border border-slate-700 rounded-lg overflow-hidden">
                                {children}
                            </table>
                        </div>
                    ),
                    thead: ({ children }) => <thead className="bg-slate-800">{children}</thead>,
                    th: ({ children }) => <th className="border border-slate-700 px-4 py-2 text-left font-semibold">{children}</th>,
                    td: ({ children }) => <td className="border border-slate-700 px-4 py-2">{children}</td>,
                    a: ({ children, href }) => (
                        <a href={href} className="text-hustle-accent hover:underline" target="_blank" rel="noopener noreferrer">
                            {children}
                        </a>
                    ),
                    img: ({ src, alt }) => (
                        <img src={src} alt={alt} className="rounded-xl my-4 max-w-full shadow-lg" />
                    )
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export { BlockBasedEditor, MarkdownRenderer };
