import React, { useState } from 'react';
import { useDocs } from '../context/DocsContext';
import { FileText, Plus, Trash2, Search, Clock, Edit3, Eye, Save, Code } from 'lucide-react';
import { BlockBasedEditor, MarkdownRenderer } from '../components/BlockBasedEditor';
import { useActivity } from '../context/ActivityContext';

const Docs = () => {
    const { documents, createDoc, updateDoc, deleteDoc } = useDocs();
    const { logActivity } = useActivity();
    const [activeDocId, setActiveDocId] = useState(documents[0]?.id || null);
    const [search, setSearch] = useState('');
    const [mode, setMode] = useState('edit'); // 'edit' or 'preview'

    const activeDoc = documents.find(d => d.id === activeDocId);

    const handleCreate = () => {
        const newId = createDoc();
        setActiveDocId(newId);
        setMode('edit');
        logActivity('DOC_CREATED', newId, 'Untitled Document');
    };

    const filteredDocs = documents.filter(doc =>
        doc.title.toLowerCase().includes(search.toLowerCase()) ||
        doc.content.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex-1 min-h-screen bg-hustle-dark lg:ml-64 flex overflow-hidden">
            {/* Sidebar List */}
            <div className="w-80 border-r border-slate-700 bg-slate-800/20 flex flex-col">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <FileText className="text-hustle-accent" /> Knowledge Base
                        </h2>
                        <button
                            onClick={handleCreate}
                            className="p-2 bg-hustle-accent/10 text-hustle-accent rounded-lg hover:bg-hustle-accent hover:text-white transition-colors"
                        >
                            <Plus size={18} />
                        </button>
                    </div>

                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search docs..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-hustle-accent"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-3 space-y-1">
                    {filteredDocs.map(doc => (
                        <button
                            key={doc.id}
                            onClick={() => setActiveDocId(doc.id)}
                            className={`w-full text-left p-3 rounded-xl transition-all group relative ${activeDocId === doc.id
                                ? 'bg-slate-700/50 border border-slate-600'
                                : 'hover:bg-slate-800 border border-transparent'
                                }`}
                        >
                            <h3 className={`font-medium truncate pr-6 ${activeDocId === doc.id ? 'text-white' : 'text-slate-300'}`}>
                                {doc.title || 'Untitled'}
                            </h3>
                            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                <Clock size={10} /> {doc.lastEdited}
                            </p>

                            <button
                                onClick={(e) => { e.stopPropagation(); deleteDoc(doc.id); }}
                                className="absolute right-2 top-3 p-1 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 size={14} />
                            </button>
                        </button>
                    ))}

                    {filteredDocs.length === 0 && (
                        <div className="text-center py-10 text-slate-500 text-sm">
                            No documents found.
                        </div>
                    )}
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 flex flex-col bg-hustle-dark relative">
                {activeDoc ? (
                    <div className="h-full flex flex-col max-w-5xl mx-auto w-full p-8 md:p-12">

                        {/* Toolbar */}
                        <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
                            <input
                                type="text"
                                value={activeDoc.title}
                                onChange={(e) => updateDoc(activeDoc.id, { title: e.target.value })}
                                placeholder="Untitled Document"
                                className="text-3xl md:text-4xl font-bold bg-transparent text-white border-none focus:outline-none placeholder-slate-600 flex-1 mr-4"
                            />
                            <div className="flex items-center space-x-2 bg-slate-800 p-1 rounded-lg">
                                <button
                                    onClick={() => setMode('edit')}
                                    className={`p-2 rounded-md transition-colors flex items-center gap-2 text-sm font-medium ${mode === 'edit' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                                >
                                    <Edit3 size={16} /> Edit
                                </button>
                                <button
                                    onClick={() => setMode('preview')}
                                    className={`p-2 rounded-md transition-colors flex items-center gap-2 text-sm font-medium ${mode === 'preview' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                                >
                                    <Eye size={16} /> Preview
                                </button>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {mode === 'edit' ? (
                                <BlockBasedEditor
                                    value={activeDoc.content}
                                    onChange={(content) => {
                                        updateDoc(activeDoc.id, { content });
                                        // Log edit activity periodically or on key points (for demo we log on change)
                                        if (Math.random() > 0.95) logActivity('DOC_EDITED', activeDoc.id, activeDoc.title);
                                    }}
                                    placeholder="# Start writing with blocks..."
                                />
                            ) : (
                                <div className="bg-slate-900/50 rounded-xl border border-slate-700 p-8">
                                    <MarkdownRenderer content={activeDoc.content} />
                                </div>
                            )}
                        </div>

                        <div className="absolute bottom-6 right-6 text-xs text-slate-600">
                            {activeDoc.content.split(/\s+/).filter(Boolean).length} words • Autosaved
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                        <Code size={48} className="mb-4 text-slate-700" />
                        <p className="text-lg">Select a document or create a new one.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Docs;
