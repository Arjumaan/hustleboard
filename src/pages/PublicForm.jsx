import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForms } from '../context/FormContext';
import { useTasks } from '../context/TaskContext';
import { CheckCircle, AlertCircle, Send, ArrowLeft, Rocket } from 'lucide-react';

const PublicForm = () => {
    const { publicId } = useParams();
    const { forms, updateForm } = useForms();
    const { addTask } = useTasks();
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({});

    // Find form by publicId (In a real app, this would be a backend call)
    // Here we search through all forms in context if possible, or just the current workspace ones
    // Actually, for this demo, we'll assume the form exists in the context
    const form = forms.find(f => f.publicId === publicId);

    if (!form) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
            <div className="max-w-md">
                <AlertCircle size={64} className="mx-auto text-red-500 mb-6 opacity-20" />
                <h1 className="text-3xl font-bold text-white mb-4">Form Not Found</h1>
                <p className="text-slate-400 mb-8">This link may be broken or the form has been unpublished by the owner.</p>
                <Link to="/login" className="text-hustle-accent hover:underline flex items-center justify-center gap-2">
                    <ArrowLeft size={16} /> Go to HustleBoard
                </Link>
            </div>
        </div>
    );

    const handleSubmit = (e) => {
        e.preventDefault();

        // Create task from form data
        addTask({
            title: formData[form.fields[0].id] || 'New Web Submission',
            description: Object.entries(formData).map(([key, val]) => {
                const field = form.fields.find(f => f.id === key);
                return `**${field?.label}:** ${val}`;
            }).join('\n'),
            category: 'External',
            status: 'To Do',
            priority: 'Medium'
        });

        // Update response count
        updateForm(form.id, { responses: (form.responses || 0) + 1 });

        setSubmitted(true);
    };

    if (submitted) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
            <div className="max-w-md animate-scale-in">
                <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle size={40} />
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">Submission Received!</h1>
                <p className="text-slate-400 mb-10 text-lg">Thank you for your input. Our team has been notified and a task has been created automatically.</p>
                <button
                    onClick={() => setSubmitted(false)}
                    className="w-full py-4 bg-hustle-accent text-slate-900 rounded-2xl font-bold hover:bg-sky-400 transition-all shadow-xl shadow-sky-500/20"
                >
                    Submit Another Response
                </button>
                <div className="mt-12 flex items-center justify-center gap-2 text-slate-600 font-medium">
                    <span>Powered by</span>
                    <span className="text-slate-400 flex items-center gap-1"><Rocket size={14} className="text-hustle-accent" /> HustleBoard</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-950 py-20 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Branding */}
                <div className="flex items-center gap-3 mb-12 justify-center">
                    <div className="w-10 h-10 bg-gradient-to-tr from-hustle-accent to-hustle-purple rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg ring-4 ring-slate-900">
                        H
                    </div>
                    <span className="text-2xl font-black text-white tracking-tighter uppercase italic">HustleBoard</span>
                </div>

                {/* Form Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden shadow-hustle-accent/5">
                    <div className="h-3 bg-gradient-to-r from-hustle-accent via-hustle-purple to-pink-500"></div>
                    <div className="p-8 md:p-12">
                        <h1 className="text-4xl font-bold text-white mb-4">{form.name}</h1>
                        <p className="text-slate-400 text-lg mb-10 leading-relaxed">{form.description}</p>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {form.fields.map(field => (
                                <div key={field.id}>
                                    <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">
                                        {field.label} {field.required && <span className="text-hustle-accent">*</span>}
                                    </label>
                                    {field.type === 'textarea' ? (
                                        <textarea
                                            required={field.required}
                                            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-hustle-accent focus:ring-4 focus:ring-hustle-accent/10 transition-all h-32 resize-none"
                                            placeholder={`Your ${field.label.toLowerCase()}...`}
                                            onChange={e => setFormData({ ...formData, [field.id]: e.target.value })}
                                        ></textarea>
                                    ) : field.type === 'select' ? (
                                        <select
                                            required={field.required}
                                            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-hustle-accent focus:ring-4 focus:ring-hustle-accent/10 transition-all appearance-none cursor-pointer"
                                            onChange={e => setFormData({ ...formData, [field.id]: e.target.value })}
                                        >
                                            <option value="">Select an option...</option>
                                            {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            required={field.required}
                                            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-hustle-accent focus:ring-4 focus:ring-hustle-accent/10 transition-all"
                                            placeholder={`Enter ${field.label.toLowerCase()}...`}
                                            onChange={e => setFormData({ ...formData, [field.id]: e.target.value })}
                                        />
                                    )}
                                </div>
                            ))}

                            <div className="pt-6">
                                <button
                                    type="submit"
                                    className="w-full py-5 bg-hustle-accent text-slate-900 rounded-2xl font-black text-lg hover:bg-sky-400 transition-all shadow-xl shadow-sky-500/20 flex items-center justify-center gap-3 group"
                                >
                                    Submit Response <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </button>
                                <p className="text-center text-slate-600 text-xs mt-6 font-medium">Your data is secured by HustleBoard encryption.</p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicForm;
