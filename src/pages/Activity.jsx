import React from 'react';
import { useActivity } from '../context/ActivityContext';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, FileText, Book, MessageSquare, ArrowRight, User } from 'lucide-react';

const Activity = () => {
    const { activities } = useActivity();

    const getActivityIcon = (type) => {
        switch (type) {
            case 'TASK_CREATED':
            case 'TASK_MOVED':
                return <CheckCircle size={16} className="text-hustle-accent" />;
            case 'DOC_EDITED':
            case 'DOC_CREATED':
                return <FileText size={16} className="text-hustle-purple" />;
            case 'WIKI_CREATED':
            case 'WIKI_EDITED':
                return <Book size={16} className="text-yellow-400" />;
            case 'COMMENT_ADDED':
                return <MessageSquare size={16} className="text-blue-400" />;
            default:
                return <User size={16} className="text-slate-400" />;
        }
    };

    const getActivityDescription = (activity) => {
        switch (activity.type) {
            case 'TASK_MOVED':
                return `moved task "${activity.targetName}" from ${activity.metadata.from} to ${activity.metadata.to}`;
            case 'COMMENT_ADDED':
                return `commented on "${activity.targetName}"`;
            case 'TASK_CREATED':
                return `created a new task "${activity.targetName}"`;
            case 'DOC_CREATED':
                return `created a new document "${activity.targetName}"`;
            case 'DOC_EDITED':
                return `edited the document "${activity.targetName}"`;
            case 'WIKI_CREATED':
                return `added a new wiki page "${activity.targetName}"`;
            case 'WIKI_EDITED':
                return `updated the wiki page "${activity.targetName}"`;
            default:
                return `performed an action on ${activity.targetName}`;
        }
    };

    return (
        <div className="flex-1 min-h-screen bg-hustle-dark lg:ml-64 p-4 lg:p-8">
            <div className="mb-10">
                <h1 className="text-4xl font-bold text-white mb-2">Workspace Activity</h1>
                <p className="text-slate-400">Keep track of every change across your workspace.</p>
            </div>

            <div className="max-w-4xl bg-slate-800/30 border border-slate-700 rounded-2xl overflow-hidden backdrop-blur-sm">
                <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-white">Recent Updates</h2>
                    <button className="text-sm text-hustle-accent hover:underline">Mark all as read</button>
                </div>

                <div className="divide-y divide-slate-700/50">
                    {activities.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">
                            <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                            <p>No activity recorded yet.</p>
                        </div>
                    ) : (
                        activities.map((activity) => (
                            <div key={activity.id} className="p-6 hover:bg-slate-800/50 transition-colors group">
                                <div className="flex gap-4">
                                    <div className="relative">
                                        {activity.userAvatar ? (
                                            <img src={activity.userAvatar} alt={activity.userName} className="w-10 h-10 rounded-full border border-slate-700" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-700 to-slate-800 flex items-center justify-center text-slate-400 font-bold">
                                                {activity.userName.charAt(0)}
                                            </div>
                                        )}
                                        <div className="absolute -bottom-1 -right-1 bg-slate-900 rounded-full p-1 border border-slate-700 shadow-lg">
                                            {getActivityIcon(activity.type)}
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="text-white font-medium">
                                                {activity.userName}
                                                <span className="text-slate-400 font-normal"> {getActivityDescription(activity)}</span>
                                            </p>
                                            <span className="text-xs text-slate-500 whitespace-nowrap ml-4">
                                                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 mt-3 cursor-pointer">
                                            <div className="px-3 py-1 bg-slate-800 rounded-lg text-xs text-slate-400 border border-slate-700 group-hover:border-hustle-accent/50 group-hover:text-hustle-accent transition-all flex items-center gap-2">
                                                <span>View Details</span>
                                                <ArrowRight size={12} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Activity;
