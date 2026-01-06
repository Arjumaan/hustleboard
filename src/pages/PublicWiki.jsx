import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useWiki } from '../context/WikiContext';
import { MarkdownRenderer } from '../components/BlockBasedEditor';
import { Book, Clock, Globe, ArrowLeft, Loader2, FileX } from 'lucide-react';

const PublicWiki = () => {
    const { publicId } = useParams();
    const { pages } = useWiki();

    // In a real app, this would be a filtered fetch from the backend
    const page = pages.find(p => p.publicId === publicId && p.isPublished);

    if (!page) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 bg-slate-900 rounded-3xl flex items-center justify-center mb-8 border border-slate-800">
                    <FileX size={48} className="text-slate-700" />
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">Content Protected or Not Found</h1>
                <p className="text-slate-400 max-w-md mb-10 text-lg leading-relaxed">
                    This knowledge base page is either private, unpublished, or has moved to a new location.
                </p>
                <Link to="/login" className="px-8 py-3 bg-hustle-accent text-slate-900 rounded-xl font-bold hover:bg-sky-400 transition-all shadow-xl shadow-sky-500/20">
                    Sign in to HustleBoard
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 font-sans selection:bg-hustle-accent selection:text-hustle-dark">
            {/* Minimalist Top Nav */}
            <nav className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-gradient-to-tr from-hustle-accent to-hustle-purple rounded-lg flex items-center justify-center text-white font-black text-sm">H</div>
                        <span className="text-xl font-black text-white italic tracking-tighter transition-opacity group-hover:opacity-80">HustleBoard</span>
                    </Link>
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800">
                            <Globe size={10} className="text-hustle-accent" /> Public Documentation
                        </span>
                    </div>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="max-w-4xl mx-auto px-6 py-20">
                {/* Meta Header */}
                <div className="mb-12 border-b border-slate-900 pb-12">
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">
                        <span className="flex items-center gap-1.5"><Clock size={14} /> Updated {new Date(page.updatedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1.5"><Book size={14} /> Knowledge Base</span>
                    </div>
                    <h1 className="text-6xl font-black text-white mb-6 leading-tight tracking-tight">
                        {page.title}
                    </h1>
                    {page.tags && page.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {page.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-slate-900 text-hustle-accent rounded-lg text-[10px] font-black uppercase tracking-widest border border-hustle-accent/20">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Markdown Content */}
                <div className="bg-slate-900/20 rounded-[2.5rem] p-4 md:p-8 -mx-4 md:-mx-8">
                    <MarkdownRenderer content={page.content} />
                </div>

                {/* Footer / CTA */}
                <footer className="mt-32 pt-12 border-t border-slate-900 text-center">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-10 max-w-2xl mx-auto">
                        <h3 className="text-2xl font-bold text-white mb-4 italic">Built for modern builders.</h3>
                        <p className="text-slate-400 mb-8">This documentation was created and shared using HustleBoard – the unified workspace for ambitious teams.</p>
                        <Link to="/signup" className="inline-flex items-center gap-2 text-hustle-accent font-black uppercase tracking-widest text-sm hover:underline">
                            Get your own workspace <RocketIcon />
                        </Link>
                    </div>
                    <p className="mt-12 text-slate-600 text-xs font-medium">
                        &copy; 2026 HustleBoard Intelligence. All rights reserved.
                    </p>
                </footer>
            </main>
        </div>
    );
};

const RocketIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
        <path d="m9 15 3 3"></path>
        <path d="M9.5 10.5 11 9"></path>
        <path d="M15 13 13.5 14.5"></path>
    </svg>
);

export default PublicWiki;
