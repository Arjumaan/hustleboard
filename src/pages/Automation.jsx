import React, { useState } from 'react';
import { useAutomation } from '../context/AutomationContext';
import { Zap, Plus, Play, Trash2, ToggleLeft, ToggleRight, CheckCircle, Clock, ArrowRight, Settings2 } from 'lucide-react';

const Automation = () => {
    const { rules, addRule, toggleRule, deleteRule } = useAutomation();
    const [isAdding, setIsAdding] = useState(false);
    const [newRule, setNewRule] = useState({
        name: '',
        trigger: 'TASK_STATUS_CHANGED',
        condition: { status: 'Done' },
        action: 'COMPLETE_ALL_SUBTASKS'
    });

    const triggerOptions = [
        { value: 'TASK_STATUS_CHANGED', label: 'When task status changes' },
        { value: 'TASK_CREATED', label: 'When a task is created' },
        { value: 'TASK_OVERDUE', label: 'When a task becomes overdue' }
    ];

    const actionOptions = [
        { value: 'COMPLETE_ALL_SUBTASKS', label: 'Complete all subtasks' },
        { value: 'SET_PRIORITY_HIGH', label: 'Set priority to High' },
        { value: 'ARCHIVE_TASK', label: 'Archive the task' }
    ];

    const handleAddRule = (e) => {
        e.preventDefault();
        if (!newRule.name) return;
        addRule(newRule);
        setIsAdding(false);
        setNewRule({
            name: '',
            trigger: 'TASK_STATUS_CHANGED',
            condition: { status: 'Done' },
            action: 'COMPLETE_ALL_SUBTASKS'
        });
    };

    return (
        <div className="flex-1 min-h-screen bg-hustle-dark lg:ml-64 p-4 lg:p-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                            <Zap className="text-yellow-400 fill-yellow-400/20" size={32} /> Automations
                        </h1>
                        <p className="text-slate-400">Streamline your workflow with smart rules and triggers.</p>
                    </div>
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-2 bg-hustle-accent hover:bg-sky-400 text-slate-900 px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-sky-500/20 active:scale-95"
                    >
                        <Plus size={20} /> Create Rule
                    </button>
                </div>

                {/* Add Rule Form */}
                {isAdding && (
                    <div className="mb-8 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 animate-slide-in-down shadow-2xl backdrop-blur-xl">
                        <h2 className="text-xl font-bold text-white mb-6">Create New Automation</h2>
                        <form onSubmit={handleAddRule} className="grid md:grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-400 mb-2">Automation Name</label>
                                <input
                                    type="text"
                                    value={newRule.name}
                                    onChange={e => setNewRule({ ...newRule, name: e.target.value })}
                                    placeholder="e.g., Auto-assign on High Priority"
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-hustle-accent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Trigger</label>
                                <select
                                    value={newRule.trigger}
                                    onChange={e => setNewRule({ ...newRule, trigger: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-hustle-accent appearance-none cursor-pointer"
                                >
                                    {triggerOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Action</label>
                                <select
                                    value={newRule.action}
                                    onChange={e => setNewRule({ ...newRule, action: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-hustle-accent appearance-none cursor-pointer"
                                >
                                    {actionOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-span-2 flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsAdding(false)}
                                    className="px-6 py-2.5 text-slate-400 hover:text-white transition-colors font-semibold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 bg-hustle-accent text-slate-900 rounded-xl font-bold hover:bg-sky-400 transition-all shadow-lg shadow-sky-500/20"
                                >
                                    Save Automation
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Rules List */}
                <div className="grid gap-4">
                    {rules.length === 0 ? (
                        <div className="py-20 text-center bg-slate-800/20 border-2 border-dashed border-slate-800 rounded-3xl">
                            <Zap size={64} className="mx-auto mb-4 text-slate-700 opacity-20" />
                            <p className="text-slate-500 text-lg">No automations set up yet.</p>
                            <button onClick={() => setIsAdding(true)} className="mt-4 text-hustle-accent hover:underline font-bold">Create your first rule</button>
                        </div>
                    ) : (
                        rules.map(rule => (
                            <div key={rule.id} className={`bg-slate-800/40 border ${rule.enabled ? 'border-slate-700/50' : 'border-slate-800 opacity-60'} rounded-2xl p-6 transition-all hover:bg-slate-800/60 group`}>
                                <div className="flex justify-between items-start gap-6">
                                    <div className="flex gap-4">
                                        <div className={`mt-1 p-2 rounded-lg ${rule.enabled ? 'bg-yellow-400/10 text-yellow-500' : 'bg-slate-700 text-slate-500'}`}>
                                            <Zap size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-1">{rule.name}</h3>
                                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                                <Play size={14} className="text-slate-500" />
                                                <span className="bg-slate-900 border border-slate-700 px-2 py-0.5 rounded text-slate-300">
                                                    {triggerOptions.find(o => o.value === rule.trigger)?.label}
                                                </span>
                                                <ArrowRight size={14} className="text-slate-600" />
                                                <span className="bg-hustle-accent/10 border border-hustle-accent/20 px-2 py-0.5 rounded text-hustle-accent">
                                                    {actionOptions.find(o => o.value === rule.action)?.label}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => toggleRule(rule.id)}
                                            className={`transition-colors ${rule.enabled ? 'text-hustle-accent' : 'text-slate-600'}`}
                                        >
                                            {rule.enabled ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                                        </button>
                                        <button
                                            onClick={() => deleteRule(rule.id)}
                                            className="text-slate-600 hover:text-red-400 transition-colors p-2"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Automation Tips */}
                <div className="mt-12 grid md:grid-cols-3 gap-6">
                    <div className="p-6 bg-slate-800/20 border border-slate-700/30 rounded-2xl">
                        <CheckCircle className="text-green-500 mb-3" size={24} />
                        <h4 className="text-white font-bold mb-2">Efficiency</h4>
                        <p className="text-sm text-slate-400 leading-relaxed">Let HustleBoard handle repetitive tasks so you can focus on building.</p>
                    </div>
                    <div className="p-6 bg-slate-800/20 border border-slate-700/30 rounded-2xl">
                        <Clock className="text-cyan-500 mb-3" size={24} />
                        <h4 className="text-white font-bold mb-2">Time Saving</h4>
                        <p className="text-sm text-slate-400 leading-relaxed">Save up to 4 hours per week by automating manual task updates.</p>
                    </div>
                    <div className="p-6 bg-slate-800/20 border border-slate-700/30 rounded-2xl">
                        <Settings2 className="text-hustle-purple mb-3" size={24} />
                        <h4 className="text-white font-bold mb-2">Control</h4>
                        <p className="text-sm text-slate-400 leading-relaxed">Custom rules tailored to your team's specific workflow needs.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Automation;
