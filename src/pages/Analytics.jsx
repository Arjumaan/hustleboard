import React from 'react';
import { useTasks } from '../context/TaskContext';
import { useFocus } from '../context/FocusContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { ArrowUp } from 'lucide-react';

const Analytics = () => {
    const { tasks } = useTasks();
    const { completedSessions } = useFocus();

    const total = tasks.length;
    const inProgress = tasks.filter(t => t.status === 'In Progress').length;
    const completed = tasks.filter(t => t.status === 'Done').length;
    const todo = tasks.filter(t => t.status === 'To Do').length;

    const focusHours = (completedSessions.length * 25) / 60;
    const totalIntensity = (completed / (total || 1)) * 100;

    const statusData = [
        { name: 'To Do', value: todo, color: '#94a3b8' },
        { name: 'In Progress', value: inProgress, color: '#818cf8' },
        { name: 'Done', value: completed, color: '#38bdf8' },
    ];

    const priorityData = [
        { name: 'High', value: tasks.filter(t => t.priority === 'High').length },
        { name: 'Medium', value: tasks.filter(t => t.priority === 'Medium').length },
        { name: 'Low', value: tasks.filter(t => t.priority === 'Low').length },
    ];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-800 border border-slate-700 p-2 rounded-lg shadow-xl">
                    <p className="text-white text-sm font-bold">{`${label} : ${payload[0].value}`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="flex-1 min-h-screen bg-hustle-dark lg:ml-64 p-4 lg:p-8">
            <header className="mb-10">
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 italic">Intelligence Lab</h1>
                <p className="text-slate-400">Velocity tracking and focus session reporting.</p>
            </header>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-3xl">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Throughput</p>
                    <h2 className="text-3xl font-black text-white">{completed} <span className="text-sm text-slate-500 font-medium italic">tasks</span></h2>
                    <div className="mt-4 flex items-center gap-2 text-xs text-green-400 font-bold">
                        <ArrowUp size={12} /> +12% from last week
                    </div>
                </div>
                <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-3xl">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Work Intensity</p>
                    <h2 className="text-3xl font-black text-white">{totalIntensity.toFixed(1)}<span className="text-sm text-slate-500 font-medium italic text-xl">%</span></h2>
                    <div className="mt-4 w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div className="h-full bg-hustle-accent" style={{ width: `${totalIntensity}%` }}></div>
                    </div>
                </div>
                <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-3xl">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Deep Work</p>
                    <h2 className="text-3xl font-black text-white">{focusHours.toFixed(1)} <span className="text-sm text-slate-500 font-medium italic">hrs</span></h2>
                    <div className="mt-4 flex items-center gap-2 text-xs text-hustle-purple font-bold">
                        {completedSessions.length} sessions completed
                    </div>
                </div>
                <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-3xl">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Open Issues</p>
                    <h2 className="text-3xl font-black text-white">{todo + inProgress}</h2>
                    <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 font-bold uppercase tracking-widest">
                        Needs attention
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Task Completion Status */}
                <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-6">Task Distribution</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center space-x-6 mt-4">
                        {statusData.map((entry) => (
                            <div key={entry.name} className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                                <span className="text-slate-400 text-sm">{entry.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Priority Breakdown */}
                <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-6">Tasks by Priority</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={priorityData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                                <XAxis type="number" stroke="#94a3b8" />
                                <YAxis dataKey="name" type="category" stroke="#94a3b8" />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1e293b' }} />
                                <Bar dataKey="value" fill="#38bdf8" radius={[0, 4, 4, 0]} barSize={20}>
                                    {
                                        priorityData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.name === 'High' ? '#f472b6' : entry.name === 'Medium' ? '#fbbf24' : '#38bdf8'} />
                                        ))
                                    }
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Productivity Trend (Mock data for visuals) */}
                <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-md border border-slate-700/50 p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-6">Productivity Trend (Last 7 Days)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={[
                                    { day: 'Mon', tasks: 4 }, { day: 'Tue', tasks: 3 }, { day: 'Wed', tasks: 7 },
                                    { day: 'Thu', tasks: 5 }, { day: 'Fri', tasks: 8 }, { day: 'Sat', tasks: 2 }, { day: 'Sun', tasks: 4 }
                                ]}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="day" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="tasks" stroke="#818cf8" strokeWidth={3} dot={{ r: 4, fill: '#1e293b', strokeWidth: 2 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
