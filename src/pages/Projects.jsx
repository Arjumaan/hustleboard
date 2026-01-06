import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { Filter, Plus, Download, Upload, Table, Calendar, LayoutList, ChevronDown, X } from 'lucide-react';

const Projects = () => {
    const { tasks, getMilestones, getTasksByMilestone, updateTask } = useTasks();
    const [viewMode, setViewMode] = useState('table'); // 'table', 'list', 'calendar'
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');
    const [sortBy, setSortBy] = useState('dueDate'); // 'dueDate', 'priority', 'title'
    const [showFilters, setShowFilters] = useState(false);

    const milestones = getMilestones();

    // Apply filters and sorting
    let filteredTasks = tasks;
    if (filterStatus !== 'all') {
        filteredTasks = filteredTasks.filter(t => t.status === filterStatus);
    }
    if (filterPriority !== 'all') {
        filteredTasks = filteredTasks.filter(t => t.priority === filterPriority);
    }

    // Sort
    filteredTasks = [...filteredTasks].sort((a, b) => {
        if (sortBy === 'dueDate') return new Date(a.dueDate) - new Date(b.dueDate);
        if (sortBy === 'priority') {
            const priorityOrder = { High: 3, Medium: 2, Low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return 0;
    });

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            default: return 'bg-green-500/20 text-green-400 border-green-500/30';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Done': return 'bg-green-500/20 text-green-400';
            case 'In Progress': return 'bg-blue-500/20 text-blue-400';
            default: return 'bg-slate-700 text-slate-400';
        }
    };

    const handleInlineEdit = (taskId, field, value) => {
        updateTask(taskId, { [field]: value });
    };

    return (
        <div className="flex-1 min-h-screen bg-hustle-dark lg:ml-64 p-4 lg:p-8">
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Workspace Database</h1>
                <p className="text-slate-400">Manage structure, filters, and cross-workspace reporting.</p>
            </div>

            {/* Toolbar */}
            <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        {/* View Switcher */}
                        <div className="flex bg-slate-900 p-1 rounded-lg">
                            <button
                                onClick={() => setViewMode('table')}
                                className={`p-2 rounded-md transition-colors ${viewMode === 'table' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
                                title="Table View"
                            >
                                <Table size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
                                title="List View"
                            >
                                <LayoutList size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode('calendar')}
                                className={`p-2 rounded-md transition-colors ${viewMode === 'calendar' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
                                title="Calendar View"
                            >
                                <Calendar size={18} />
                            </button>
                        </div>

                        {/* Filters */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                        >
                            <Filter size={16} /> Filters
                            {(filterStatus !== 'all' || filterPriority !== 'all') && (
                                <span className="bg-hustle-accent text-white text-xs px-2 py-0.5 rounded-full">
                                    {[filterStatus !== 'all', filterPriority !== 'all'].filter(Boolean).length}
                                </span>
                            )}
                        </button>

                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 text-sm focus:outline-none focus:border-hustle-accent"
                        >
                            <option value="dueDate">Sort by Due Date</option>
                            <option value="priority">Sort by Priority</option>
                            <option value="title">Sort by Title</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-sm">
                            <Download size={16} /> Export CSV
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-sm">
                            <Upload size={16} /> Import
                        </button>
                    </div>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-slate-700 flex gap-4">
                        <div>
                            <label className="block text-xs text-slate-500 mb-2">Status</label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 text-sm focus:outline-none focus:border-hustle-accent"
                            >
                                <option value="all">All Status</option>
                                <option value="To Do">To Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Done</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 mb-2">Priority</label>
                            <select
                                value={filterPriority}
                                onChange={(e) => setFilterPriority(e.target.value)}
                                className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 text-sm focus:outline-none focus:border-hustle-accent"
                            >
                                <option value="all">All Priorities</option>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>
                        <button
                            onClick={() => { setFilterStatus('all'); setFilterPriority('all'); }}
                            className="self-end px-3 py-2 text-sm text-slate-500 hover:text-white flex items-center gap-1"
                        >
                            <X size={14} /> Clear
                        </button>
                    </div>
                )}
            </div>

            {/* Milestones Overview */}
            {milestones.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-slate-400 mb-3">Milestones</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {milestones.map(milestone => {
                            const milestoneTasks = getTasksByMilestone(milestone);
                            const completed = milestoneTasks.filter(t => t.status === 'Done').length;
                            const progress = Math.round((completed / milestoneTasks.length) * 100);

                            return (
                                <div key={milestone} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                                    <h4 className="font-semibold text-white mb-2">{milestone}</h4>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 bg-slate-700 rounded-full h-2 overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-hustle-accent to-hustle-purple h-full transition-all"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-slate-400">{progress}%</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">{completed} of {milestoneTasks.length} tasks</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Table View */}
            {viewMode === 'table' && (
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-800 border-b border-slate-700">
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Task</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Status</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Priority</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Due Date</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Milestone</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Assignees</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Tags</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTasks.map(task => (
                                    <tr key={task.id} className="border-b border-slate-700/50 hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-white">{task.title}</div>
                                            <div className="text-sm text-slate-500">{task.category}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={task.status}
                                                onChange={(e) => handleInlineEdit(task.id, 'status', e.target.value)}
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)} bg-transparent border-none cursor-pointer`}
                                            >
                                                <option value="To Do">To Do</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Done">Done</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                                                {task.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-400">{task.dueDate}</td>
                                        <td className="px-6 py-4 text-sm text-slate-400">{task.milestone || '-'}</td>
                                        <td className="px-6 py-4">
                                            {task.assignees?.length > 0 ? (
                                                <div className="flex -space-x-2">
                                                    {task.assignees.slice(0, 3).map((userId, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="w-8 h-8 rounded-full bg-gradient-to-tr from-hustle-accent to-hustle-purple flex items-center justify-center text-white text-xs font-bold border-2 border-slate-800"
                                                        >
                                                            U{idx + 1}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-sm text-slate-600">Unassigned</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {task.tags?.slice(0, 2).map(tag => (
                                                    <span key={tag} className="px-2 py-0.5 bg-slate-700 text-slate-400 rounded text-xs">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
                <div className="space-y-3">
                    {filteredTasks.map(task => (
                        <div key={task.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-hustle-accent/50 transition-all">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-white mb-2">{task.title}</h3>
                                    <div className="flex items-center gap-3 text-sm">
                                        <span className={`px-2 py-0.5 rounded-full ${getStatusColor(task.status)}`}>
                                            {task.status}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded-full border ${getPriorityColor(task.priority)}`}>
                                            {task.priority}
                                        </span>
                                        <span className="text-slate-500">{task.dueDate}</span>
                                        {task.milestone && <span className="text-slate-400">📍 {task.milestone}</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Calendar View Placeholder */}
            {viewMode === 'calendar' && (
                <div className="text-center py-20 text-slate-500">
                    <Calendar size={64} className="mx-auto mb-4 text-slate-700" />
                    <p className="text-lg">Calendar view with timeline visualization</p>
                    <p className="text-sm text-slate-600">Coming soon...</p>
                </div>
            )}
        </div>
    );
};

export default Projects;
