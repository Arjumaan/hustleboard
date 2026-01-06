import React, { useMemo } from 'react';
import { useTasks } from '../context/TaskContext';
import { format, addDays, differenceInDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';

const TimelineView = () => {
    const { tasks } = useTasks();
    const [currentDate, setCurrentDate] = React.useState(new Date());

    // Get week range
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    // Filter tasks with due dates
    const tasksWithDates = useMemo(() => {
        return tasks.filter(task => task.dueDate).map(task => {
            try {
                // Parse date (handling different formats)
                const dueDate = new Date(task.dueDate);
                const startDate = task.startDate ? new Date(task.startDate) : addDays(dueDate, -3);

                return {
                    ...task,
                    parsedDueDate: dueDate,
                    parsedStartDate: startDate,
                    duration: differenceInDays(dueDate, startDate) || 1
                };
            } catch (e) {
                return null;
            }
        }).filter(Boolean);
    }, [tasks]);

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'bg-red-500/80 border-red-600';
            case 'Medium': return 'bg-yellow-500/80 border-yellow-600';
            default: return 'bg-green-500/80 border-green-600';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Done': return 'bg-green-500/20';
            case 'In Progress': return 'bg-blue-500/20';
            default: return 'bg-slate-700/20';
        }
    };

    const calculatePosition = (task) => {
        const weekStartTime = weekStart.getTime();
        const weekEndTime = weekEnd.getTime();
        const taskStartTime = task.parsedStartDate.getTime();
        const taskEndTime = task.parsedDueDate.getTime();

        // Calculate percentage position within the week
        const totalDuration = weekEndTime - weekStartTime;
        const left = ((taskStartTime - weekStartTime) / totalDuration) * 100;
        const width = ((taskEndTime - taskStartTime) / totalDuration) * 100;

        return {
            left: Math.max(0, Math.min(100, left)),
            width: Math.max(2, Math.min(100 - left, width))
        };
    };

    const goToPreviousWeek = () => {
        setCurrentDate(addDays(currentDate, -7));
    };

    const goToNextWeek = () => {
        setCurrentDate(addDays(currentDate, 7));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    return (
        <div className="flex-1 min-h-screen bg-hustle-dark lg:ml-64 p-4 lg:p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Timeline View</h1>
                <p className="text-slate-400">Gantt-style visualization of tasks and projects</p>
            </div>

            {/* Controls */}
            <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-xl p-4 mb-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <button
                        onClick={goToPreviousWeek}
                        className="p-2 bg-slate-900 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={goToToday}
                        className="px-4 py-2 bg-hustle-accent/10 hover:bg-hustle-accent/20 text-hustle-accent rounded-lg transition-colors font-medium"
                    >
                        Today
                    </button>
                    <button
                        onClick={goToNextWeek}
                        className="p-2 bg-slate-900 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                    <div className="text-white font-semibold ml-4">
                        {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
                    </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span>High Priority</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <span>Medium</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span>Low</span>
                    </div>
                </div>
            </div>

            {/* Timeline Grid */}
            <div className="bg-slate-800/30 border border-slate-700 rounded-xl overflow-hidden">
                {/* Header Row - Days */}
                <div className="grid grid-cols-8 bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
                    <div className="p-4 border-r border-slate-700 text-sm font-semibold text-slate-300">
                        Task
                    </div>
                    {weekDays.map(day => {
                        const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                        return (
                            <div
                                key={day.toISOString()}
                                className={`p-4 text-center border-r border-slate-700 last:border-0 ${isToday ? 'bg-hustle-accent/10' : ''
                                    }`}
                            >
                                <div className={`text-xs font-medium ${isToday ? 'text-hustle-accent' : 'text-slate-500'}`}>
                                    {format(day, 'EEE')}
                                </div>
                                <div className={`text-sm font-semibold ${isToday ? 'text-hustle-accent' : 'text-white'}`}>
                                    {format(day, 'd')}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Task Rows */}
                <div className="divide-y divide-slate-700/50">
                    {tasksWithDates.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">
                            <p className="text-lg">No tasks with due dates</p>
                            <p className="text-sm mt-2">Add due dates to your tasks to see them on the timeline</p>
                        </div>
                    ) : (
                        tasksWithDates.map((task, index) => {
                            const position = calculatePosition(task);
                            const isVisible = position.left < 100 && position.left + position.width > 0;

                            return (
                                <div key={task.id} className="grid grid-cols-8 hover:bg-slate-800/50 transition-colors">
                                    {/* Task Info Column */}
                                    <div className="p-4 border-r border-slate-700">
                                        <div className="font-medium text-white text-sm truncate">{task.title}</div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(task.status)} text-slate-400`}>
                                                {task.status}
                                            </span>
                                            {task.assignees?.length > 0 && (
                                                <div className="flex items-center text-xs text-slate-500">
                                                    <Users size={12} className="mr-1" />
                                                    {task.assignees.length}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Timeline Column (7 days) */}
                                    <div className="col-span-7 relative h-16">
                                        {/* Grid lines */}
                                        {weekDays.map((day, dayIndex) => (
                                            <div
                                                key={dayIndex}
                                                className="absolute top-0 bottom-0 border-r border-slate-700/30"
                                                style={{ left: `${(dayIndex / 7) * 100}%` }}
                                            />
                                        ))}

                                        {/* Task Bar */}
                                        {isVisible && (
                                            <div
                                                className="absolute top-2 bottom-2 z-10"
                                                style={{
                                                    left: `${position.left}%`,
                                                    width: `${position.width}%`
                                                }}
                                            >
                                                <div
                                                    className={`h-full rounded-lg border-2 shadow-lg hover:shadow-xl transition-all cursor-pointer group ${getPriorityColor(
                                                        task.priority
                                                    )}`}
                                                    title={`${task.title} (${format(task.parsedStartDate, 'MMM d')} - ${format(
                                                        task.parsedDueDate,
                                                        'MMM d'
                                                    )})`}
                                                >
                                                    <div className="px-2 py-1 text-xs font-medium text-white truncate opacity-90 group-hover:opacity-100">
                                                        {task.title}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Today indicator */}
                                        {weekDays.some(day => format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')) && (
                                            <div
                                                className="absolute top-0 bottom-0 w-0.5 bg-hustle-accent z-20 pointer-events-none"
                                                style={{
                                                    left: `${((new Date().getTime() - weekStart.getTime()) / (weekEnd.getTime() - weekStart.getTime())) * 100}%`
                                                }}
                                            >
                                                <div className="absolute -top-1 -left-1 w-2 h-2 bg-hustle-accent rounded-full"></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Summary Stats */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                    <div className="text-2xl font-bold text-white">{tasksWithDates.length}</div>
                    <div className="text-sm text-slate-400">Tasks This Week</div>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                    <div className="text-2xl font-bold text-green-400">
                        {tasksWithDates.filter(t => t.status === 'Done').length}
                    </div>
                    <div className="text-sm text-slate-400">Completed</div>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                    <div className="text-2xl font-bold text-blue-400">
                        {tasksWithDates.filter(t => t.status === 'In Progress').length}
                    </div>
                    <div className="text-sm text-slate-400">In Progress</div>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                    <div className="text-2xl font-bold text-yellow-400">
                        {tasksWithDates.filter(t => new Date(t.parsedDueDate) < new Date() && t.status !== 'Done').length}
                    </div>
                    <div className="text-sm text-slate-400">Overdue</div>
                </div>
            </div>
        </div>
    );
};

export default TimelineView;
