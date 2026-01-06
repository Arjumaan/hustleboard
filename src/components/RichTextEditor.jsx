import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Code, Heading1, Heading2, List, ListOrdered, Quote, Image, Table } from 'lucide-react';

const RichTextEditor = ({ value, onChange, placeholder = 'Start typing...' }) => {
    const [showToolbar, setShowToolbar] = useState(true);

    const modules = {
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'indent': '-1' }, { 'indent': '+1' }],
                ['blockquote', 'code-block'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'align': [] }],
                ['link', 'image'],
                ['clean']
            ]
        },
        clipboard: {
            matchVisual: false
        }
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet', 'indent',
        'blockquote', 'code-block',
        'color', 'background',
        'align',
        'link', 'image'
    ];

    return (
        <div className="rich-text-editor bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
            {/* Custom Toolbar Hints */}
            <div className="bg-slate-800 border-b border-slate-700 px-4 py-2 flex items-center justify-between">
                <div className="flex items-center space-x-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Heading1 size={14} /> Headers</span>
                    <span className="flex items-center gap-1"><Code size={14} /> Code</span>
                    <span className="flex items-center gap-1"><List size={14} /> Lists</span>
                    <span className="flex items-center gap-1"><Quote size={14} /> Quotes</span>
                </div>
                <button
                    onClick={() => setShowToolbar(!showToolbar)}
                    className="text-xs text-slate-500 hover:text-white"
                >
                    {showToolbar ? 'Hide' : 'Show'} Toolbar
                </button>
            </div>

            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder}
                className={`quill-dark ${!showToolbar ? 'quill-no-toolbar' : ''}`}
            />

            <style jsx global>{`
        .quill-dark .ql-toolbar {
          background: #1e293b;
          border: none;
          border-bottom: 1px solid #334155;
        }
        
        .quill-dark .ql-container {
          background: #0f172a;
          border: none;
          font-size: 15px;
          min-height: 300px;
        }
        
        .quill-dark .ql-editor {
          color: #cbd5e1;
          min-height: 300px;
        }
        
        .quill-dark .ql-editor.ql-blank::before {
          color: #475569;
          font-style: normal;
        }
        
        .quill-dark .ql-stroke {
          stroke: #94a3b8;
        }
        
        .quill-dark .ql-fill {
          fill: #94a3b8;
        }
        
        .quill-dark .ql-picker-label {
          color: #94a3b8;
        }
        
        .quill-dark .ql-toolbar button:hover,
        .quill-dark .ql-toolbar button.ql-active {
          color: #38bdf8;
        }
        
        .quill-dark .ql-toolbar button:hover .ql-stroke,
        .quill-dark .ql-toolbar button.ql-active .ql-stroke {
          stroke: #38bdf8;
        }
        
        .quill-dark .ql-toolbar button:hover .ql-fill,
        .quill-dark .ql-toolbar button.ql-active .ql-fill {
          fill: #38bdf8;
        }
        
        .quill-dark .ql-editor pre {
          background: #1e293b;
          color: #38bdf8;
          border-radius: 8px;
          padding: 12px;
        }
        
        .quill-dark .ql-editor blockquote {
          border-left: 4px solid #38bdf8;
          padding-left: 16px;
          margin: 16px 0;
          color: #94a3b8;
        }
        
        .quill-dark .ql-editor h1,
        .quill-dark .ql-editor h2,
        .quill-dark .ql-editor h3 {
          color: #f1f5f9;
          font-weight: 700;
        }
        
        .quill-dark .ql-editor a {
          color: #38bdf8;
        }
        
        .quill-no-toolbar .ql-toolbar {
          display: none;
        }
        
        .quill-no-toolbar .ql-container {
          border-top: 1px solid #334155;
        }
      `}</style>
        </div>
    );
};

export default RichTextEditor;
