import React, { useState } from 'react';
import { LayoutDashboard, CheckSquare, BarChart2, Settings, LogOut, Briefcase, FileText, Users, ChevronDown, PlusCircle, BookOpen, GanttChart, Bell, Zap, ClipboardList, Timer, Play, Pause, RotateCcw, Menu, X as CloseIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWorkspace } from '../context/WorkspaceContext';
import { useActivity } from '../context/ActivityContext';
import { useFocus } from '../context/FocusContext';

const Sidebar = () => {
    const location = useLocation();
    const { logout } = useAuth();
    const { workspaces, activeWorkspace, setActiveWorkspaceId, addWorkspace } = useWorkspace();
    const { onlineUsers } = useActivity();
    const { isActive: isTimerActive, timeLeft, mode, toggleTimer, resetTimer, formatTime } = useFocus();
    const [isWsMenuOpen, setIsWsMenuOpen] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const menuItems = [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/projects', icon: Briefcase, label: 'Projects' },
        { path: '/my-tasks', icon: CheckSquare, label: 'My Tasks' },
        { path: '/docs', icon: FileText, label: 'Docs' },
        { path: '/wiki', icon: BookOpen, label: 'Wiki' },
        { path: '/team', icon: Users, label: 'Team' },
        { path: '/analytics', icon: BarChart2, label: 'Analytics' },
        { path: '/activity', icon: Bell, label: 'Activity' },
        { path: '/automation', icon: Zap, label: 'Automation' },
        { path: '/forms', icon: ClipboardList, label: 'Forms' },
        { path: '/timeline', icon: GanttChart, label: 'Timeline' },
        { path: '/settings', icon: Settings, label: 'Settings' },
    ];

    const isActive = (path) => {
        if (path === '/' && location.pathname === '/') return true;
        if (path !== '/' && location.pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden fixed top-6 right-6 z-[60] bg-hustle-accent text-slate-900 p-3 rounded-2xl shadow-xl shadow-sky-500/20 active:scale-95 transition-transform"
            >
                <Menu size={24} />
            </button>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] lg:hidden animate-fade-in"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <div className={`w-64 h-screen bg-hustle-secondary border-r border-slate-700 flex flex-col fixed left-0 top-0 z-[80] transition-all duration-300 lg:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Close button for mobile */}
                <button
                    onClick={() => setIsMobileOpen(false)}
                    className="lg:hidden absolute top-6 -right-14 text-white p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <CloseIcon size={24} />
                </button>

                {/* Workspace Switcher */}
                <div className="p-4 border-b border-slate-700 relative">
                    <button
                        onClick={() => setIsWsMenuOpen(!isWsMenuOpen)}
                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded bg-gradient-to-tr from-hustle-accent to-hustle-purple flex items-center justify-center text-white font-bold text-lg">
                                {activeWorkspace.name.charAt(0)}
                            </div>
                            <div className="text-left overflow-hidden">
                                <h2 className="text-sm font-bold text-white truncate">{activeWorkspace.name}</h2>
                                <p className="text-xs text-slate-400 capitalize">{activeWorkspace.type}</p>
                            </div>
                        </div>
                        <ChevronDown size={16} className="text-slate-400" />
                    </button>

                    {isWsMenuOpen && (
                        <div className="absolute top-16 left-4 right-4 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-slide-in-down">
                            <div className="p-2 space-y-1">
                                {workspaces.map(ws => (
                                    <button
                                        key={ws.id}
                                        onClick={() => { setActiveWorkspaceId(ws.id); setIsWsMenuOpen(false); }}
                                        className={`w-full flex items-center space-x-2 p-2 rounded-lg text-sm ${activeWorkspace.id === ws.id ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                                            }`}
                                    >
                                        <div className="w-2 h-2 rounded-full bg-hustle-accent"></div>
                                        <span className="truncate">{ws.name}</span>
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => {
                                    const name = prompt('Workspace Name:');
                                    if (name) addWorkspace(name);
                                    setIsWsMenuOpen(false);
                                }}
                                className="w-full p-3 bg-slate-900 text-slate-400 text-xs font-semibold hover:text-white flex items-center justify-center border-t border-slate-700"
                            >
                                <PlusCircle size={14} className="mr-2" /> Create Workspace
                            </button>
                        </div>
                    )}
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive(item.path)
                                ? 'bg-gradient-to-r from-hustle-accent/20 to-hustle-purple/20 text-hustle-accent shadow-lg shadow-hustle-accent/10 border border-hustle-accent/20'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <item.icon size={20} className={isActive(item.path) ? 'text-hustle-accent' : 'group-hover:scale-110 transition-transform'} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Focus Mode Timer */}
                <div className="mx-4 mb-4 p-4 bg-slate-800/50 rounded-2xl border border-slate-700/30">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                            <Timer size={14} className={isTimerActive ? 'text-hustle-accent animate-pulse' : 'text-slate-600'} />
                            {mode === 'focus' ? 'Deep Work' : 'Break'}
                        </div>
                        <button onClick={resetTimer} className="text-slate-600 hover:text-slate-300 transition-colors">
                            <RotateCcw size={14} />
                        </button>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-2xl font-black text-white tabular-nums tracking-tighter">
                            {formatTime(timeLeft)}
                        </span>
                        <button
                            onClick={toggleTimer}
                            className={`p-2 rounded-full transition-all shadow-lg ${isTimerActive
                                ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 shadow-orange-500/10'
                                : 'bg-hustle-accent text-slate-900 hover:bg-sky-400 shadow-sky-500/20'
                                }`}
                        >
                            {isTimerActive ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                        </button>
                    </div>
                </div>

                {/* Team Presence */}
                <div className="px-4 py-4 border-t border-slate-700">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-2">Team Presence</h3>
                    <div className="space-y-2">
                        {onlineUsers.map(u => (
                            <div key={u.id} className="flex items-center justify-between group cursor-pointer hover:bg-slate-800 p-2 rounded-lg transition-colors">
                                <div className="flex items-center space-x-3">
                                    <div className="relative">
                                        <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full border border-slate-700" />
                                        <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-hustle-secondary ${u.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                                            }`}></div>
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-medium text-slate-300 truncate group-hover:text-white transition-colors">{u.name}</p>
                                        <p className="text-[10px] text-slate-500 truncate">{u.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 border-t border-slate-700">
                    <button
                        onClick={logout}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
