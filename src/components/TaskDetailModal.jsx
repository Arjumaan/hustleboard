import React, { useState } from 'react';
import { X, CheckSquare, MessageSquare, Clock, AlignLeft, Send, Trash2, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useActivity } from '../context/ActivityContext';
import { formatDistanceToNow } from 'date-fns';

const TaskDetailModal = ({ task, isOpen, onClose, onUpdate, onDelete }) => {
    const { user } = useAuth();
    const { logActivity, getTargetActivity } = useActivity();
    const [newSubtask, setNewSubtask] = useState('');
    const [newComment, setNewComment] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const activities = getTargetActivity(task?.id);

    if (!isOpen || !task) return null;

    const toggleSubtask = (subtaskId) => {
        const updatedSubtasks = task.subtasks.map(s =>
            s.id === subtaskId ? { ...s, completed: !s.completed } : s
        );
        onUpdate(task.id, { subtasks: updatedSubtasks });
    };

    const addSubtask = (e) => {
        e.preventDefault();
        if (!newSubtask.trim()) return;
        const subtask = { id: Date.now(), text: newSubtask, completed: false };
        onUpdate(task.id, { subtasks: [...(task.subtasks || []), subtask] });
        setNewSubtask('');
    };

    const addComment = (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        const comment = {
            id: Date.now(),
            text: newComment,
            user: user?.name || 'User',
            avatar: user?.avatar,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        onUpdate(task.id, { comments: [...(task.comments || []), comment] });
        setNewComment('');
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex justify-end">
            <div className="w-full max-w-2xl bg-hustle-dark border-l border-slate-700 h-full p-8 overflow-y-auto shadow-2xl transform transition-transform animate-slide-in-right">
                {/* Header Options */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${task.status === 'Done' ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-300'
                            }`}>
                            {task.status}
                        </span>
                        <button
                            onClick={() => onDelete(task.id)}
                            className="p-2 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                {/* Title */}
                <input
                    type="text"
                    value={task.title}
                    onChange={(e) => onUpdate(task.id, { title: e.target.value })}
                    className="w-full bg-transparent text-3xl font-bold text-white mb-6 border-none focus:ring-0 p-0 placeholder-slate-600"
                    placeholder="Task Title"
                />

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="text-slate-500 text-sm font-medium mb-1 flex items-center gap-2"><Clock size={14} /> Due Date</label>
                        <div className="text-slate-300 font-medium">{task.dueDate}</div>
                    </div>
                    <div>
                        <label className="text-slate-500 text-sm font-medium mb-1">Priority</label>
                        <div className={`inline-block px-2 py-0.5 rounded text-sm ${task.priority === 'High' ? 'text-red-400 bg-red-400/10' : 'text-sky-400 bg-sky-400/10'
                            }`}>
                            {task.priority}
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                    <h3 className="text-slate-200 font-semibold mb-3 flex items-center gap-2">
                        <AlignLeft size={18} /> Description
                    </h3>
                    <textarea
                        value={task.description}
                        onChange={(e) => onUpdate(task.id, { description: e.target.value })}
                        className="w-full h-32 bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-slate-300 focus:outline-none focus:border-hustle-accent resize-none placeholder-slate-500"
                        placeholder="Add a more detailed description..."
                    />
                </div>

                {/* Subtasks / Checklist */}
                <div className="mb-8">
                    <h3 className="text-slate-200 font-semibold mb-3 flex items-center gap-2">
                        <CheckSquare size={18} /> Checklist
                    </h3>

                    <div className="space-y-2 mb-3">
                        {task.subtasks?.map(sub => (
                            <div key={sub.id} className="flex items-center group">
                                <button
                                    onClick={() => toggleSubtask(sub.id)}
                                    className={`flex-shrink-0 w-5 h-5 rounded border mr-3 flex items-center justify-center transition-all ${sub.completed ? 'bg-hustle-accent border-hustle-accent text-hustle-dark' : 'border-slate-500 hover:border-hustle-accent'
                                        }`}
                                >
                                    {sub.completed && <X size={14} className="rotate-45" />} {/* Using X rotated as checkmark */}
                                </button>
                                <span className={`flex-1 text-slate-300 ${sub.completed ? 'line-through text-slate-500' : ''}`}>
                                    {sub.text}
                                </span>
                                <button
                                    onClick={() => onUpdate(task.id, { subtasks: task.subtasks.filter(s => s.id !== sub.id) })}
                                    className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 p-1"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={addSubtask} className="flex items-center gap-2">
                        <PlusButton />
                        <input
                            type="text"
                            value={newSubtask}
                            onChange={(e) => setNewSubtask(e.target.value)}
                            placeholder="Add an item"
                            className="bg-transparent text-sm text-white focus:outline-none flex-1 py-2"
                        />
                    </form>
                </div>

                {/* Comments & Activity */}
                <div className="mb-8">
                    <h3 className="text-slate-200 font-semibold mb-4 flex items-center gap-2">
                        <MessageSquare size={18} /> Activity & Comments
                    </h3>

                    <div className="space-y-6 mb-6">
                        {/* Combine and sort activities and comments */}
                        {[
                            ...(task.comments || []).map(c => ({ ...c, feedType: 'comment' })),
                            ...(activities || []).map(a => ({ ...a, feedType: 'activity' }))
                        ]
                            .sort((a, b) => new Date(a.timestamp || a.id) - new Date(b.timestamp || b.id))
                            .map((item, idx) => (
                                <div key={idx} className="flex gap-3">
                                    {item.feedType === 'comment' ? (
                                        <>
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-hustle-accent to-hustle-purple flex items-center justify-center text-xs font-bold text-white shrink-0">
                                                {item.user.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-white font-medium text-sm">{item.user}</span>
                                                    <span className="text-slate-500 text-xs">{item.timestamp}</span>
                                                </div>
                                                <div className="bg-slate-800 rounded-lg rounded-tl-none p-3 mt-1 text-slate-300 text-sm border border-slate-700/50">
                                                    {item.text.split(' ').map((word, i) => (
                                                        word.startsWith('@')
                                                            ? <span key={i} className="text-hustle-accent font-semibold">{word} </span>
                                                            : word + ' '
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex items-center gap-3 w-full pl-11 py-1">
                                            <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                                            <p className="text-xs text-slate-500 italic">
                                                <span className="text-slate-400 not-italic font-medium">{item.userName}</span>
                                                {' '}{item.type === 'TASK_MOVED' ? `moved this task to ${item.metadata.to}` : 'updated this task'}
                                                <span className="ml-2 opacity-50">• {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}</span>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}

                        {/* Typing Indicator Simulation */}
                        {isTyping && (
                            <div className="flex gap-3 animate-pulse">
                                <div className="w-8 h-8 rounded-full bg-slate-800"></div>
                                <div className="bg-slate-800/50 rounded-lg rounded-tl-none p-2 px-4 text-xs text-slate-500">
                                    Someone is typing...
                                </div>
                            </div>
                        )}
                    </div>

                    <form onSubmit={(e) => { addComment(e); logActivity('COMMENT_ADDED', task.id, task.title); }} className="relative">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => {
                                setNewComment(e.target.value);
                                if (!isTyping) {
                                    setIsTyping(true);
                                    setTimeout(() => setIsTyping(false), 2000);
                                }
                            }}
                            placeholder="Write a comment... (use @ for mentions)"
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-4 pr-12 py-3 text-white focus:outline-none focus:border-hustle-accent shadow-inner placeholder-slate-600"
                        />
                        <button type="submit" className="absolute right-2 top-2 p-1.5 bg-hustle-accent text-slate-900 rounded-lg hover:bg-sky-400 transition-all active:scale-95">
                            <Send size={16} />
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

// Helper for the Plus Icon since I can't import Plus from lucide twice in same line sometimes depending on version
const PlusButton = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

export default TaskDetailModal;
