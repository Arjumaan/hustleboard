import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Plus, MoreHorizontal, Trash2, Layout, Calendar } from 'lucide-react';
import SortableTaskCard from './SortableTaskCard';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import NewTaskModal from './NewTaskModal';
import TaskDetailModal from './TaskDetailModal';
import CalendarView from './CalendarView';
import { DndContext, closestCorners, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import { useActivity } from '../context/ActivityContext';

const Dashboard = () => {
    const { tasks, getStats, addTask, updateTaskStatus, updateTask, deleteTask, setSearchQuery, clearTasksByStatus } = useTasks();
    const { user } = useAuth();
    const { logActivity } = useActivity();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [activeId, setActiveId] = useState(null);
    const [viewMode, setViewMode] = useState('board'); // 'board' or 'calendar'
    const menuRef = useRef(null);

    const stats = getStats();
    const categories = ['To Do', 'In Progress', 'Done'];

    // Update searchQuery in context, but using a local tasks filter for the board for drag/drop visual stability 
    // (Filter logic is handled by Context usually, but for DnD we need full list to move items)
    // For simplicity, we just use 'tasks' from context directly here and filter in render for columns.

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Require 8px movement before drag starts (prevents accidental drag on click)
            },
        })
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveMenu(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (!over) {
            setActiveId(null);
            return;
        }

        const activeTask = tasks.find(t => t.id === active.id);
        const overContainer = over.data.current?.sortable?.containerId || over.id; // 'To Do', etc.

        // If dropped over a column directly (the container)
        if (categories.includes(overContainer)) {
            if (activeTask.status !== overContainer) {
                updateTaskStatus(activeTask.id, overContainer);
                logActivity('TASK_MOVED', activeTask.id, activeTask.title, { from: activeTask.status, to: overContainer });
            }
        }
        // If dropped over another item
        else {
            const overTask = tasks.find(t => t.id === over.id);
            if (overTask && activeTask.status !== overTask.status) {
                updateTaskStatus(activeTask.id, overTask.status);
                logActivity('TASK_MOVED', activeTask.id, activeTask.title, { from: activeTask.status, to: overTask.status });
            }
        }

        setActiveId(null);
    };

    const statsDisplay = [
        { label: 'Total Tasks', value: stats.total.value, change: stats.total.change, color: 'from-blue-500 to-cyan-500' },
        { label: 'In Progress', value: stats.inProgress.value, change: stats.inProgress.change, color: 'from-purple-500 to-pink-500' },
        { label: 'Completed', value: stats.completed.value, change: stats.completed.change, color: 'from-green-500 to-emerald-500' },
    ];

    return (
        <div className="flex-1 min-h-screen bg-hustle-dark lg:ml-64 p-4 lg:p-8">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-white">Welcome, {user?.name || 'Guest'}! 👋</h2>
                    <p className="text-slate-400 mt-1">Here's what's happening today.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none max-w-xs">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search..."
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-full text-sm text-white focus:outline-none focus:border-hustle-accent w-full transition-all"
                        />
                    </div>
                    <div className="flex bg-slate-800 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('board')}
                            className={`p-2 rounded-md transition-colors ${viewMode === 'board' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                        >
                            <Layout size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('calendar')}
                            className={`p-2 rounded-md transition-colors ${viewMode === 'calendar' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                        >
                            <Calendar size={18} />
                        </button>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-hustle-accent hover:bg-sky-400 text-slate-900 px-4 py-2.5 rounded-full font-bold transition-all shadow-lg active:scale-95">
                        <Plus size={18} />
                        <span>New Task</span>
                    </button>
                </div>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-10">
                {statsDisplay.map((stat, idx) => (
                    <div key={idx} className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 p-6 rounded-2xl relative overflow-hidden group hover:bg-slate-800 transition-all">
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full blur-2xl transform translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform duration-500`}></div>
                        <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">{stat.label}</h3>
                        <div className="flex items-end space-x-3">
                            <span className="text-3xl lg:text-4xl font-black text-white">{stat.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            {viewMode === 'calendar' ? (
                <div className="mb-10 animate-fade-in">
                    <CalendarView onTaskClick={setSelectedTask} />
                </div>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10 animate-fade-in">
                        {categories.map((cat) => {
                            const categoryTasks = tasks.filter(t => t.status === cat);
                            return (
                                <div key={cat} className="flex flex-col h-full">
                                    {/* Column Header */}
                                    <div className="flex justify-between items-center mb-4 px-2">
                                        <div className="flex items-center space-x-2">
                                            <div className={`w-2 h-2 rounded-full ${cat === 'To Do' ? 'bg-slate-500' : cat === 'In Progress' ? 'bg-hustle-purple' : 'bg-hustle-accent'}`}></div>
                                            <h3 className="font-bold text-slate-200 tracking-tight">{cat}</h3>
                                            <span className="bg-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full text-slate-500 border border-slate-700/50">{categoryTasks.length}</span>
                                        </div>
                                        <div className="flex space-x-1 relative">
                                            <button onClick={() => setIsModalOpen(true)} className="p-1 hover:bg-slate-800 rounded text-slate-400"><Plus size={16} /></button>
                                            <button onClick={() => setActiveMenu(activeMenu === cat ? null : cat)} className={`p-1 hover:bg-slate-800 rounded transition-colors ${activeMenu === cat ? 'text-white' : 'text-slate-400'}`}><MoreHorizontal size={16} /></button>
                                            {activeMenu === cat && (
                                                <div ref={menuRef} className="absolute right-0 top-8 w-40 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-10 overflow-hidden">
                                                    <button onClick={() => { clearTasksByStatus(cat); setActiveMenu(null); }} className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-slate-700/50 flex items-center space-x-2">
                                                        <Trash2 size={14} /> <span>Clear All</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Droppable Column */}
                                    <SortableContext id={cat} items={categoryTasks} strategy={verticalListSortingStrategy}>
                                        <div className="space-y-4 min-h-[500px]" >
                                            {categoryTasks.map(task => (
                                                <SortableTaskCard key={task.id} id={task.id} {...task} onClick={() => setSelectedTask(task)} />
                                            ))}
                                            {categoryTasks.length === 0 && (
                                                <div className="border-2 border-dashed border-slate-800 rounded-xl p-8 text-center bg-slate-800/20">
                                                    <p className="text-slate-500 text-sm">No tasks here</p>
                                                </div>
                                            )}
                                        </div>
                                    </SortableContext>
                                </div>
                            );
                        })}
                    </div>

                    <DragOverlay>
                        {activeId ? <TaskCard {...tasks.find(t => t.id === activeId)} /> : null}
                    </DragOverlay>
                </DndContext>
            )}

            <NewTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={addTask} />
            <TaskDetailModal
                task={selectedTask}
                isOpen={!!selectedTask}
                onClose={() => setSelectedTask(null)}
                onUpdate={updateTask}
                onDelete={(id) => { deleteTask(id); setSelectedTask(null); }}
            />
        </div>
    );
};

export default Dashboard;
