import React, { useState } from 'react';
import { useWiki } from '../context/WikiContext';
import { FileText, Plus, Search, Tag, Link2, ArrowLeft, Trash2, MoreVertical, FileCheck, Share2, Globe, Eye } from 'lucide-react';
import { MarkdownRenderer } from '../components/BlockBasedEditor';
import { useActivity } from '../context/ActivityContext';

const Wiki = () => {
    const { pages, templates, createPage, updatePage, deletePage, searchPages, getAllTags } = useWiki();
    const { logActivity } = useActivity();
    const [activePageId, setActivePageId] = useState(pages[0]?.id || null);
    const [search, setSearch] = useState('');
    const [selectedTag, setSelectedTag] = useState(null);
    const [showTemplates, setShowTemplates] = useState(false);

    const activePage = pages.find(p => p.id === activePageId);
    const displayPages = selectedTag
        ? pages.filter(p => p.tags.includes(selectedTag))
        : searchPages(search);
    const allTags = getAllTags();

    const handleCreatePage = (templateId = null) => {
        const newId = createPage(templateId);
        setActivePageId(newId);
        setShowTemplates(false);
        logActivity('WIKI_CREATED', newId, 'New Wiki Page');
    };

    const handleAddTag = () => {
        const tag = prompt('Enter tag name:');
        if (tag && activePage) {
            updatePage(activePage.id, {
                tags: [...new Set([...activePage.tags, tag.toLowerCase()])]
            });
        }
    };

    const handleRemoveTag = (tag) => {
        if (activePage) {
            updatePage(activePage.id, {
                tags: activePage.tags.filter(t => t !== tag)
            });
        }
    };

    return (
        <div className="flex-1 min-h-screen bg-hustle-dark lg:ml-64 flex">
            {/* Sidebar */}
            <div className="w-80 border-r border-slate-700 bg-slate-800/20 flex flex-col">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <FileText className="text-hustle-accent" /> Wiki
                        </h2>
                        <div className="relative">
                            <button
                                onClick={() => setShowTemplates(!showTemplates)}
                                className="p-2 bg-hustle-accent/10 text-hustle-accent rounded-lg hover:bg-hustle-accent hover:text-white transition-colors"
                            >
                                <Plus size={18} />
                            </button>

                            {showTemplates && (
                                <div className="absolute right-0 top-12 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                                    <div className="p-2">
                                        <button
                                            onClick={() => handleCreatePage()}
                                            className="w-full text-left px-4 py-3 text-sm text-white hover:bg-slate-700 rounded-lg flex items-center gap-2 mb-2"
                                        >
                                            <FileText size={16} /> Blank Page
                                        </button>
                                        <div className="border-t border-slate-700 my-2 pt-2">
                                            <p className="text-xs text-slate-500 px-2 mb-2">From Template</p>
                                            {templates.map(template => (
                                                <button
                                                    key={template.id}
                                                    onClick={() => handleCreatePage(template.id)}
                                                    className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-lg flex items-center gap-2"
                                                >
                                                    <FileCheck size={14} /> {template.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search wiki..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setSelectedTag(null); }}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-hustle-accent"
                        />
                    </div>

                    {/* Tags */}
                    <div className="mb-4">
                        <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                            <Tag size={12} /> Tags
                        </p>
                        <div className="flex flex-wrap gap-1">
                            {allTags.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => { setSelectedTag(selectedTag === tag ? null : tag); setSearch(''); }}
                                    className={`text-xs px-2 py-1 rounded-full transition-colors ${selectedTag === tag
                                        ? 'bg-hustle-accent text-white'
                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-3 space-y-1">
                    {displayPages.map(page => (
                        <button
                            key={page.id}
                            onClick={() => setActivePageId(page.id)}
                            className={`w-full text-left p-3 rounded-xl transition-all group relative ${activePageId === page.id
                                ? 'bg-slate-700/50 border border-slate-600'
                                : 'hover:bg-slate-800 border border-transparent'
                                }`}
                        >
                            <h3 className={`font-medium truncate pr-6 ${activePageId === page.id ? 'text-white' : 'text-slate-300'}`}>
                                {page.title || 'Untitled'}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                {page.tags.slice(0, 2).map(tag => (
                                    <span key={tag} className="text-xs px-1.5 py-0.5 bg-slate-700 text-slate-400 rounded">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <button
                                onClick={(e) => { e.stopPropagation(); if (window.confirm('Delete this page?')) deletePage(page.id); }}
                                className="absolute right-2 top-3 p-1 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 size={14} />
                            </button>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col bg-hustle-dark overflow-hidden">
                {activePage ? (
                    <div className="flex-1 flex">
                        {/* Editor */}
                        <div className="flex-1 p-8 overflow-y-auto">
                            <input
                                type="text"
                                value={activePage.title}
                                onChange={(e) => updatePage(activePage.id, { title: e.target.value })}
                                placeholder="Page Title"
                                className="text-4xl font-bold bg-transparent text-white border-none focus:outline-none placeholder-slate-600 w-full mb-6"
                            />

                            {/* Tags */}
                            <div className="flex items-center gap-2 mb-6">
                                {activePage.tags.map(tag => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm flex items-center gap-2"
                                    >
                                        <Tag size={12} /> {tag}
                                        <button
                                            onClick={() => handleRemoveTag(tag)}
                                            className="hover:text-red-400"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                                <button
                                    onClick={handleAddTag}
                                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full text-sm"
                                >
                                    + Tag
                                </button>
                            </div>

                            <textarea
                                value={activePage.content}
                                onChange={(e) => {
                                    updatePage(activePage.id, { content: e.target.value });
                                    if (Math.random() > 0.95) logActivity('WIKI_EDITED', activePage.id, activePage.title);
                                }}
                                placeholder="Start writing... Use [[Page Name]] to link to other pages"
                                className="w-full min-h-[500px] bg-slate-900 border border-slate-700 rounded-xl p-6 text-lg text-slate-300 resize-none focus:outline-none focus:border-hustle-accent placeholder-slate-700 leading-relaxed font-mono"
                            />
                        </div>

                        {/* Right Sidebar - Links & Backlinks */}
                        <div className="w-80 border-l border-slate-700 bg-slate-800/20 p-6 overflow-y-auto">
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2">
                                    <Globe size={14} /> Publish Settings
                                </h3>
                                <div className="p-4 bg-slate-900/50 border border-slate-700/50 rounded-xl mb-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-xs font-bold text-slate-500 uppercase">Public Access</span>
                                        <button
                                            onClick={() => updatePage(activePage.id, { isPublished: !activePage.isPublished })}
                                            className={`w-10 h-5 rounded-full p-1 transition-colors ${activePage.isPublished ? 'bg-hustle-accent' : 'bg-slate-700'}`}
                                        >
                                            <div className={`w-3 h-3 bg-white rounded-full transition-transform ${activePage.isPublished ? 'translate-x-5' : 'translate-x-0'}`} />
                                        </button>
                                    </div>

                                    {activePage.isPublished && (
                                        <div className="space-y-3">
                                            <button
                                                onClick={() => {
                                                    const url = `${window.location.origin}/kb/${activePage.publicId}`;
                                                    navigator.clipboard.writeText(url);
                                                    alert('Public link copied!');
                                                }}
                                                className="w-full flex items-center justify-center gap-2 py-2 bg-hustle-accent/10 hover:bg-hustle-accent/20 text-hustle-accent rounded-lg text-xs font-bold transition-all border border-hustle-accent/20"
                                            >
                                                <Share2 size={12} /> Copy Public Link
                                            </button>
                                            <a
                                                href={`/kb/${activePage.publicId}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full flex items-center justify-center gap-2 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition-all border border-slate-700"
                                            >
                                                <Eye size={12} /> View Live Page
                                            </a>
                                        </div>
                                    )}
                                </div>

                                <h3 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2">
                                    <Link2 size={14} /> Linked Pages
                                </h3>
                                {activePage.linkedPages.length > 0 ? (
                                    <div className="space-y-2">
                                        {activePage.linkedPages.map(linkedId => {
                                            const linkedPage = pages.find(p => p.id === linkedId);
                                            return linkedPage ? (
                                                <button
                                                    key={linkedId}
                                                    onClick={() => setActivePageId(linkedId)}
                                                    className="w-full text-left p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors"
                                                >
                                                    {linkedPage.title}
                                                </button>
                                            ) : null;
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-600">No outgoing links</p>
                                )}
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2">
                                    <ArrowLeft size={14} /> Backlinks
                                </h3>
                                {activePage.backlinks.length > 0 ? (
                                    <div className="space-y-2">
                                        {activePage.backlinks.map(backlinkId => {
                                            const backlinkPage = pages.find(p => p.id === backlinkId);
                                            return backlinkPage ? (
                                                <button
                                                    key={backlinkId}
                                                    onClick={() => setActivePageId(backlinkId)}
                                                    className="w-full text-left p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors"
                                                >
                                                    {backlinkPage.title}
                                                </button>
                                            ) : null;
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-600">No backlinks</p>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-500">
                        <div className="text-center">
                            <FileText size={64} className="mx-auto mb-4 text-slate-700" />
                            <p className="text-lg font-medium">Select a page or create a new one</p>
                            <p className="text-sm text-slate-600 mt-2">Build your knowledge base with wiki-style links</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wiki;
