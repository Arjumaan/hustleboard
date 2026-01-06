import React, { useState, useEffect, useRef } from 'react';
import { Search, Command, FileText, CheckSquare, Book, Zap, ArrowRight, X, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { useDocs } from '../context/DocsContext';
import { useWiki } from '../context/WikiContext';

const GlobalSearch = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [recentSearches, setRecentSearches] = useState(() => {
        const saved = localStorage.getItem('hustleboard_recent_searches');
        return saved ? JSON.parse(saved) : [];
    });

    const { tasks } = useTasks();
    const { documents } = useDocs();
    const { pages: wikiPages } = useWiki();
    const navigate = useNavigate();
    const inputRef = useRef(null);

    // Filtered items based on query
    const results = query.length > 1 ? [
        ...tasks.map(t => ({ id: t.id, title: t.title, type: 'task', icon: CheckSquare, path: '/', color: 'text-hustle-accent' })),
        ...documents.map(d => ({ id: d.id, title: d.title, type: 'doc', icon: FileText, path: '/docs', color: 'text-hustle-purple' })),
        ...wikiPages.map(p => ({ id: p.id, title: p.title, type: 'wiki', icon: Book, path: '/wiki', color: 'text-yellow-400' })),
    ].filter(item => item.title.toLowerCase().includes(query.toLowerCase())).slice(0, 8) : [];

    const commands = [
        { title: 'Create New Task', icon: PlusIcon, action: () => { navigate('/'); setIsOpen(false); }, shortcut: 'N' },
        { title: 'Open Analytics', icon: Zap, action: () => { navigate('/analytics'); setIsOpen(false); }, shortcut: 'A' },
        { title: 'Workspace Settings', icon: Command, action: () => { navigate('/settings'); setIsOpen(false); }, shortcut: 'S' },
    ].filter(c => c.title.toLowerCase().includes(query.toLowerCase()));

    const allItems = [...results, ...commands];

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 10);
            setSelectedIndex(0);
        }
    }, [isOpen]);

    const handleSelect = (item) => {
        if (item.action) {
            item.action();
        } else {
            navigate(item.path);
            setIsOpen(false);
            // Save to recent
            if (!recentSearches.find(r => r.title === item.title)) {
                const updatedRecent = [item, ...recentSearches].slice(0, 5);
                setRecentSearches(updatedRecent);
                localStorage.setItem('hustleboard_recent_searches', JSON.stringify(updatedRecent));
            }
        }
        setQuery('');
    };

    if (!isOpen) return (
        <button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 left-6 lg:left-72 bg-slate-800/80 backdrop-blur-md border border-slate-700/50 px-4 py-2.5 rounded-full flex items-center gap-3 text-slate-400 hover:text-white hover:border-hustle-accent transition-all shadow-2xl z-40 group"
        >
            <Search size={18} className="group-hover:text-hustle-accent transition-colors" />
            <span className="text-sm font-medium pr-2">Search everywhere</span>
            <kbd className="bg-slate-900 px-2 py-0.5 rounded text-[10px] font-bold border border-slate-700 flex items-center gap-1 group-hover:bg-hustle-accent group-hover:text-hustle-dark group-hover:border-hustle-accent transition-all">
                <Command size={10} /> K
            </kbd>
        </button>
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 backdrop-blur-md bg-black/40 animate-fade-in">
            <div className="w-full max-w-2xl bg-slate-900/90 border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden animate-slide-in-down">
                {/* Search Input */}
                <div className="flex items-center p-6 border-b border-slate-800 gap-4">
                    <Search className="text-slate-500" size={24} />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search tasks, documents, commands..."
                        className="bg-transparent border-none focus:ring-0 text-xl text-white placeholder-slate-600 flex-1 outline-none"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <div className="flex items-center gap-2">
                        <kbd className="bg-slate-800 px-2 py-1 rounded text-[10px] font-bold border border-slate-700 text-slate-500">ESC</kbd>
                        <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
                    {query.length === 0 && recentSearches.length > 0 && (
                        <div className="mb-6">
                            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-2 px-3 flex items-center gap-2">
                                <Clock size={12} /> Recent Searches
                            </p>
                            {recentSearches.map((item, idx) => (
                                <SearchItem key={idx} item={item} onSelect={handleSelect} />
                            ))}
                        </div>
                    )}

                    {allItems.length > 0 ? (
                        <>
                            {results.length > 0 && (
                                <div className="mb-6">
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-2 px-3">Search Results</p>
                                    {results.map((item, idx) => (
                                        <SearchItem key={idx} item={item} onSelect={handleSelect} />
                                    ))}
                                </div>
                            )}

                            {commands.length > 0 && (
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-2 px-3">Quick Actions</p>
                                    {commands.map((cmd, idx) => (
                                        <SearchItem key={idx} item={cmd} onSelect={handleSelect} isCommand />
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        query.length > 1 && (
                            <div className="py-12 text-center text-slate-500">
                                <p className="text-lg">No results found for "<span className="text-white">{query}</span>"</p>
                                <p className="text-sm mt-2 font-mono">Try searching for tasks, docs, or wiki pages.</p>
                            </div>
                        )
                    )}

                    {query.length === 0 && recentSearches.length === 0 && (
                        <div className="py-10 text-center text-slate-500">
                            <Command size={48} className="mx-auto mb-4 opacity-20" />
                            <p className="text-lg">Type to start searching...</p>
                            <div className="mt-6 flex flex-wrap justify-center gap-3">
                                <ShortcutTip label="Search Tasks" shortcut="Type 'task name'" />
                                <ShortcutTip label="Find Docs" shortcut="Type 'project'" />
                                <ShortcutTip label="New Item" shortcut="Type 'create'" />
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-slate-800/30 p-4 border-t border-slate-800 flex justify-between items-center px-6">
                    <div className="flex gap-4 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        <span className="flex items-center gap-1"><ArrowRight size={10} className="rotate-90" /> Navigate</span>
                        <span className="flex items-center gap-1"><ArrowRight size={10} className="-rotate-90" /> Navigate</span>
                        <span className="flex items-center gap-1"><kbd className="bg-slate-800 border border-slate-700 px-1 py-0.5 rounded text-slate-400">ENTER</kbd> Open</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">HustleBoard Intelligence™</div>
                </div>
            </div>
        </div>
    );
};

const SearchItem = ({ item, onSelect, isCommand }) => {
    return (
        <button
            onClick={() => onSelect(item)}
            className="w-full text-left p-3 rounded-2xl hover:bg-hustle-accent/10 transition-all flex items-center justify-between group"
        >
            <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl bg-slate-800 border border-slate-700 group-hover:border-hustle-accent/50 group-hover:bg-hustle-accent/20 transition-all ${item.color || 'text-slate-400'}`}>
                    <item.icon size={20} />
                </div>
                <div>
                    <p className="text-slate-200 font-medium group-hover:text-white transition-colors">{item.title}</p>
                    <p className="text-xs text-slate-500 capitalize">{item.type || 'Action'}</p>
                </div>
            </div>
            {item.shortcut && (
                <kbd className="bg-slate-800 border border-slate-700 text-slate-600 px-2 py-1 rounded text-[10px] font-bold group-hover:text-hustle-accent group-hover:border-hustle-accent transition-all">
                    {item.shortcut}
                </kbd>
            )}
            <ArrowRight size={16} className="text-slate-700 group-hover:text-hustle-accent -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
        </button>
    );
};

const ShortcutTip = ({ label, shortcut }) => (
    <div className="bg-slate-800/50 border border-slate-700/50 px-3 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-bold text-slate-400">
        <span>{label}</span>
        <span className="text-slate-600">•</span>
        <span className="text-slate-500 italic font-medium">{shortcut}</span>
    </div>
);

const PlusIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

export default GlobalSearch;
