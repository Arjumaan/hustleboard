import React from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isSameDay, addDays } from 'date-fns';
import { useTasks } from '../context/TaskContext';

const CalendarView = ({ onTaskClick }) => {
    const { tasks } = useTasks();
    const currentDate = new Date(); // In a real app, manage this state to navigate months

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const getPriorityColor = (p) => {
        switch (p) {
            case 'High': return 'bg-red-500 text-white';
            case 'Medium': return 'bg-yellow-500 text-black';
            default: return 'bg-green-500 text-white';
        }
    };

    return (
        <div className="bg-slate-800/20 rounded-2xl border border-slate-700 overflow-hidden">
            <div className="grid grid-cols-7 bg-slate-800 border-b border-slate-700">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-4 text-center text-slate-400 font-semibold text-sm uppercase tracking-wider">
                        {day}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 auto-rows-fr">
                {days.map((day, idx) => {
                    // Rudimentary date parsing from string "Oct 25" or "2023-10-25" to match mockup simplicity
                    // In prod, use standard ISO dates everywhere. Here we try to match simplistic mock dates if possible or assume current month for demo.
                    // For this specific demo, we'll just filter items that *might* match or stick to showing all for demo if date parsing fails.
                    // Let's assume the user enters standard dates in the modal for now or we won't see them on the calendar correctly without parsing logic.

                    // Better logic: Filter tasks that "look like" they belong to this day. 
                    // Since our mock data uses "Oct 25", we need a parser or standard date objects.
                    // I updated the context to save normalized Date strings, let's look for match.

                    const dayStringShort = format(day, 'MMM d'); // "Oct 25"
                    const dayStringISO = format(day, 'yyyy-MM-dd'); // "2026-01-06"

                    const dayTasks = tasks.filter(t => t.dueDate === dayStringShort || t.dueDate.includes(dayStringShort) || t.dueDate === dayStringISO);

                    return (
                        <div
                            key={day.toString()}
                            className={`min-h-[120px] p-2 border-b border-r border-slate-700/50 transition-colors hover:bg-slate-800/30 ${!isSameMonth(day, monthStart) ? 'bg-slate-900/50 text-slate-600' : 'text-slate-300'
                                }`}
                        >
                            <div className={`text-right text-sm mb-2 ${isSameDay(day, new Date()) ? 'bg-hustle-accent text-slate-900 w-6 h-6 rounded-full flex items-center justify-center ml-auto font-bold' : ''}`}>
                                {format(day, 'd')}
                            </div>

                            <div className="space-y-1">
                                {dayTasks.map(task => (
                                    <button
                                        key={task.id}
                                        onClick={() => onTaskClick(task)}
                                        className={`w-full text-left text-xs px-2 py-1 rounded shadow-sm truncate opacity-90 hover:opacity-100 transition-opacity ${getPriorityColor(task.priority)}`}
                                    >
                                        {task.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarView;
