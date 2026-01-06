import React, { useState } from 'react';
import { useForms } from '../context/FormContext';
import { Layout, Plus, Trash2, BarChart3, Eye, Share2 } from 'lucide-react';

const Forms = () => {
    const { forms, addForm, deleteForm, updateForm } = useForms();
    const [isCreating, setIsCreating] = useState(false);
    const [newForm, setNewForm] = useState({
        name: '',
        description: '',
        fields: [
            { id: '1', label: 'Task Title', type: 'text', required: true },
            { id: '2', label: 'Email Address', type: 'text', required: true }
        ]
    });

    const handleCreate = (e) => {
        e.preventDefault();
        if (!newForm.name) return;
        addForm(newForm);
        setIsCreating(false);
        setNewForm({ name: '', description: '', fields: [{ id: '1', label: 'Task Title', type: 'text', required: true }] });
    };

    return (
        <div className="flex-1 min-h-screen bg-hustle-dark lg:ml-64 p-4 lg:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                            <Layout className="text-hustle-accent" size={32} /> Intake Forms
                        </h1>
                        <p className="text-slate-400">Create public forms to collect information and auto-create tasks.</p>
                    </div>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="flex items-center gap-2 bg-hustle-accent hover:bg-sky-400 text-slate-900 px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-sky-500/20"
                    >
                        <Plus size={20} /> Create Form
                    </button>
                </div>

                {/* Grid for forms */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {forms.map(form => (
                        <div key={form.id} className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden hover:bg-slate-800/60 transition-all group">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${form.status === 'published' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                                        }`}>
                                        {form.status}
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => deleteForm(form.id)} className="text-slate-500 hover:text-red-400"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{form.name}</h3>
                                <p className="text-sm text-slate-400 mb-6 line-clamp-2">{form.description}</p>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-slate-900/50 rounded-xl p-3 text-center border border-slate-700/30">
                                        <p className="text-2xl font-bold text-white">{form.responses}</p>
                                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Responses</p>
                                    </div>
                                    <div className="bg-slate-900/50 rounded-xl p-3 text-center border border-slate-700/30">
                                        <p className="text-2xl font-bold text-white">{form.fields.length}</p>
                                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Fields</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-900/50 p-4 border-t border-slate-700/30 grid grid-cols-3 divide-x divide-slate-700/50">
                                <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-hustle-accent transition-colors">
                                    <Eye size={16} />
                                    <span className="text-[10px] font-bold">Preview</span>
                                </button>
                                <button onClick={() => {
                                    alert(`Public Link: https://hustleboard.app/f/${form.publicId}`);
                                }} className="flex flex-col items-center gap-1 text-slate-400 hover:text-hustle-accent transition-colors">
                                    <Share2 size={16} />
                                    <span className="text-[10px] font-bold">Copy Link</span>
                                </button>
                                <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-hustle-accent transition-colors">
                                    <BarChart3 size={16} />
                                    <span className="text-[10px] font-bold">Analytics</span>
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Empty State / Create Card */}
                    {isCreating ? (
                        <div className="bg-slate-800/80 border-2 border-hustle-accent border-dashed rounded-2xl p-6 animate-pulse">
                            <p className="text-center text-hustle-accent font-bold">Creating form...</p>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsCreating(true)}
                            className="bg-slate-800/10 border-2 border-dashed border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 hover:border-slate-700 hover:bg-slate-800/20 transition-all text-slate-500 hover:text-slate-400"
                        >
                            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
                                <Plus size={24} />
                            </div>
                            <span className="font-bold">New Intake Form</span>
                        </button>
                    )}
                </div>

                {/* Create Modal Simulation */}
                {isCreating && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <div className="bg-hustle-dark border border-slate-700 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl animate-scale-in">
                            <div className="p-8 border-b border-slate-800 flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-white">Design New Form</h2>
                                <button onClick={() => setIsCreating(false)}><Trash2 size={24} className="text-slate-500 hover:text-red-400" /></button>
                            </div>
                            <form onSubmit={handleCreate} className="p-8 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 mb-2 uppercase tracking-widest">Form Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-hustle-accent"
                                        placeholder="e.g., Bug Report, Design Request"
                                        value={newForm.name}
                                        onChange={e => setNewForm({ ...newForm, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 mb-2 uppercase tracking-widest">Description</label>
                                    <textarea
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-hustle-accent h-24 resize-none"
                                        placeholder="Explain what this form is for..."
                                        value={newForm.description}
                                        onChange={e => setNewForm({ ...newForm, description: e.target.value })}
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreating(false)}
                                        className="px-6 py-2.5 text-slate-400 hover:text-white font-bold"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-hustle-accent hover:bg-sky-400 text-slate-900 px-8 py-2.5 rounded-xl font-bold transition-all"
                                    >
                                        Create & Publish
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Forms;
