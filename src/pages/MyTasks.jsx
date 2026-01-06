import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import TaskCard from '../components/TaskCard';
import { Search, Filter, ArrowUp } from 'lucide-react';

const MyTasks = () => {
    const { tasks } = useTasks();
    const [filter, setFilter] = useState('All');
    const [sort, setSort] = useState('date'); // 'date' or 'priority'

    const filteredTasks = tasks.filter(task => {
        if (filter === 'All') return true;
        return task.status === filter;
    });

    const sortedTasks = [...filteredTasks].sort((a, b) => {
        if (sort === 'priority') {
            const priorityMap = { 'High': 3, 'Medium': 2, 'Low': 1 };
            return priorityMap[b.priority] - priorityMap[a.priority];
        }
        // Sort by Date (Generic string comparison for simplest format, ideally parse dates)
        return new Date(a.dueDate) - new Date(b.dueDate);
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Done': return 'bg-green-500/20 text-green-400';
            case 'In Progress': return 'bg-purple-500/20 text-purple-400';
            case 'To Do': return 'bg-slate-700 text-slate-300';
            default: return 'bg-slate-700 text-slate-300';
        }
    };

    return (
        <div className="flex-1 min-h-screen bg-hustle-dark lg:ml-64 p-4 lg:p-8">
            <header className="mb-10">
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 italic">Personal Command</h1>
                <p className="text-slate-400 font-medium">Focused view of your specific assignments.</p>
            </header>

            {/* Controls */}
            <div className="flex justify-between items-center mb-6 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2">
                        <Filter size={16} className="text-slate-400" />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="bg-transparent text-slate-300 text-sm focus:outline-none"
                        >
                            <option value="All">All Status</option>
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                        </select>
                    </div>

                    <div className="flex items-center space-x-2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2">
                        <ArrowUp size={16} className="text-slate-400" />
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="bg-transparent text-slate-300 text-sm focus:outline-none"
                        >
                            <option value="date">Due Date</option>
                            <option value="priority">Priority</option>
                        </select>
                    </div>
                </div>

                <div className="text-slate-400 text-sm">
                    Showing <span className="text-white font-bold">{sortedTasks.length}</span> tasks
                </div>
            </div>

            {/* List View */}
            <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="p-4">Task Name</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Priority</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Due Date</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                        {sortedTasks.map(task => (
                            <tr key={task.id} className="hover:bg-slate-800/50 transition-colors group">
                                <td className="p-4 font-medium text-slate-200">{task.title}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
                                        {task.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <span className={`font-medium ${task.priority === 'High' ? 'text-red-400' : task.priority === 'Medium' ? 'text-yellow-400' : 'text-green-400'}`}>
                                        {task.priority}
                                    </span>
                                </td>
                                <td className="p-4 text-slate-400">{task.category}</td>
                                <td className="p-4 text-slate-400">{task.dueDate}</td>
                                <td className="p-4 text-right">
                                    <button className="text-hustle-accent hover:text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {sortedTasks.length === 0 && (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-slate-500">
                                    No tasks found matching current filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyTasks;
