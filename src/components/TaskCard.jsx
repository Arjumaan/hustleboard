import React, { useState, useRef, useEffect } from 'react';
import { Trash2, ArrowRight, MoreVertical, Edit, MoveRight } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

const TaskCard = ({ id, title, category, status, priority, dueDate, onClick }) => {
    const { deleteTask, updateTaskStatus } = useTasks();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getPriorityColor = (p) => {
        switch (p) {
            case 'High': return 'bg-red-500/20 text-red-400 border-red-500/20';
            case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20';
            default: return 'bg-green-500/20 text-green-400 border-green-500/20';
        }
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        if (window.confirm('Delete this task?')) {
            deleteTask(id);
        }
        setMenuOpen(false);
    };

    const handleMove = (e, newStatus) => {
        e.stopPropagation();
        updateTaskStatus(id, newStatus);
        setMenuOpen(false);
    };

    const handleMenuToggle = (e) => {
        e.stopPropagation();
        setMenuOpen(!menuOpen);
    };

    return (
        <div
            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 hover:border-hustle-purple/50 transition-all duration-300 hover:shadow-lg hover:shadow-hustle-purple/10 group relative cursor-pointer"
        >
            <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-semibold px-2 py-1 rounded-md bg-slate-700 text-slate-300 border border-slate-600">
                    {category}
                </span>
                <div className="flex items-center space-x-2">
                    <div className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(priority)}`}>
                        {priority}
                    </div>
                    {/* 3-Dot Menu */}
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={handleMenuToggle}
                            className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"
                            title="More options"
                        >
                            <MoreVertical size={16} />
                        </button>

                        {menuOpen && (
                            <div className="absolute right-0 top-8 w-40 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl z-50 overflow-hidden animate-slide-in-down">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onClick?.(); }}
                                    className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 flex items-center space-x-2"
                                >
                                    <Edit size={14} />
                                    <span>Edit Details</span>
                                </button>

                                {status !== 'Done' && (
                                    <>
                                        {status === 'To Do' && (
                                            <button
                                                onClick={(e) => handleMove(e, 'In Progress')}
                                                className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 flex items-center space-x-2"
                                            >
                                                <MoveRight size={14} />
                                                <span>Move to In Progress</span>
                                            </button>
                                        )}
                                        {status === 'In Progress' && (
                                            <button
                                                onClick={(e) => handleMove(e, 'Done')}
                                                className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 flex items-center space-x-2"
                                            >
                                                <MoveRight size={14} />
                                                <span>Move to Done</span>
                                            </button>
                                        )}
                                    </>
                                )}

                                <button
                                    onClick={handleDelete}
                                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 flex items-center space-x-2 border-t border-slate-700"
                                >
                                    <Trash2 size={14} />
                                    <span>Delete Task</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <h3 className="text-slate-100 font-semibold mb-2 group-hover:text-hustle-accent transition-colors">{title}</h3>

            <div className="flex justify-between items-center text-xs text-slate-400 mt-4">
                <span>Due: {dueDate}</span>
            </div>
        </div>
    );
};

export default TaskCard;
