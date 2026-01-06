import React, { useState } from 'react';
import { useTeam } from '../context/TeamContext';
import { Mail, UserPlus, BarChart2, Trash2, Edit2, Shield } from 'lucide-react';

const Team = () => {
    const { members, addMember, updateMember, removeMember } = useTeam();
    const [isAdding, setIsAdding] = useState(false);
    const [newMember, setNewMember] = useState({
        name: '',
        designation: '',
        email: '',
        role: 'Member',
        capacity: 40
    });

    const handleAdd = (e) => {
        e.preventDefault();
        addMember({
            ...newMember,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newMember.name)}&background=random&color=fff`
        });
        setIsAdding(false);
        setNewMember({ name: '', designation: '', email: '', role: 'Member', capacity: 40 });
    };

    return (
        <div className="flex-1 min-h-screen bg-hustle-dark lg:ml-64 p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 italic tracking-tight">Team Portal</h1>
                        <p className="text-slate-400 font-medium">Manage workforce operations and resource capacity.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl px-6 py-2 flex items-center gap-3">
                            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Total Members</span>
                            <span className="text-white text-2xl font-black">{members.length}</span>
                        </div>
                        <button
                            onClick={() => setIsAdding(true)}
                            className="flex items-center gap-2 bg-hustle-accent hover:bg-sky-400 text-slate-900 px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-sky-500/20"
                        >
                            <UserPlus size={20} /> Add Member
                        </button>
                    </div>
                </header>

                {/* Team Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {members.map(member => (
                        <div key={member.id} className="bg-slate-800/40 border border-slate-700/50 rounded-3xl overflow-hidden hover:bg-slate-800/60 transition-all group relative">
                            {/* Role Badge */}
                            <div className={`absolute top-4 right-4 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${member.role === 'Admin' ? 'bg-red-500/10 text-red-400' : 'bg-hustle-purple/10 text-hustle-purple'
                                }`}>
                                <Shield size={10} /> {member.role}
                            </div>

                            <div className="p-8 pb-4 flex flex-col items-center text-center">
                                <div className="relative mb-6">
                                    <img src={member.avatar} alt={member.name} className="w-24 h-24 rounded-full ring-4 ring-slate-700/50 group-hover:ring-hustle-accent/50 transition-all" />
                                    <div className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-4 border-slate-800 ${member.status === 'online' ? 'bg-green-500' : member.status === 'away' ? 'bg-yellow-500' : 'bg-slate-600'
                                        }`}></div>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                                <p className="text-slate-400 font-medium text-sm mb-6">{member.designation}</p>

                                {/* Capacity Bar */}
                                <div className="w-full bg-slate-900/50 rounded-full h-2 mb-2 overflow-hidden border border-slate-700/30">
                                    <div
                                        className={`h-full transition-all duration-1000 ${(member.tasksAssigned * 5) / member.capacity > 0.8 ? 'bg-red-500' : 'bg-hustle-accent'
                                            }`}
                                        style={{ width: `${Math.min(100, (member.tasksAssigned * 5 * 100) / member.capacity)}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between w-full text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-6">
                                    <span>Capacity</span>
                                    <span className={member.tasksAssigned * 5 > member.capacity ? 'text-red-400' : 'text-slate-300'}>
                                        {member.tasksAssigned * 5}h / {member.capacity}h
                                    </span>
                                </div>

                                <div className="w-full grid grid-cols-2 gap-3">
                                    <a href={`mailto:${member.email}`} className="flex items-center justify-center gap-2 py-2.5 bg-slate-900 border border-slate-700/50 hover:border-hustle-accent/30 rounded-xl text-slate-400 hover:text-white transition-all text-xs font-bold">
                                        <Mail size={14} /> Email
                                    </a>
                                    <button className="flex items-center justify-center gap-2 py-2.5 bg-slate-900 border border-slate-700/50 hover:border-hustle-accent/30 rounded-xl text-slate-400 hover:text-white transition-all text-xs font-bold">
                                        <BarChart2 size={14} /> Stats
                                    </button>
                                </div>
                            </div>

                            {/* Management Overlay */}
                            <div className="bg-slate-900/40 p-3 flex justify-center gap-6 border-t border-slate-700/30 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="text-slate-500 hover:text-hustle-accent"><Edit2 size={16} /></button>
                                <button onClick={() => removeMember(member.id)} className="text-slate-500 hover:text-red-400"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))}

                    {/* Add Member Simulation Card */}
                    {isAdding && (
                        <div className="bg-slate-800/80 border-2 border-hustle-accent border-dashed rounded-3xl p-6 flex flex-col justify-center animate-pulse">
                            <div className="w-16 h-16 bg-slate-700/50 rounded-full mx-auto mb-4"></div>
                            <div className="h-4 bg-slate-700/50 rounded w-3/4 mx-auto mb-2"></div>
                            <div className="h-3 bg-slate-700/50 rounded w-1/2 mx-auto"></div>
                        </div>
                    )}
                </div>

                {/* Add Member Modal */}
                {isAdding && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
                        <div className="bg-hustle-dark border border-slate-700 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl animate-scale-in">
                            <div className="p-10 border-b border-slate-800 flex justify-between items-center">
                                <div>
                                    <h2 className="text-3xl font-black text-white italic underline decoration-hustle-accent decoration-4 underline-offset-8">New Member</h2>
                                    <p className="text-slate-500 mt-2">Add a professional to your workspace.</p>
                                </div>
                                <button onClick={() => setIsAdding(false)}><Trash2 size={24} className="text-slate-600 hover:text-red-400" /></button>
                            </div>
                            <form onSubmit={handleAdd} className="p-10 space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Full Name</label>
                                        <input
                                            type="text" required
                                            className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-hustle-accent transition-all"
                                            placeholder="Enter name..."
                                            value={newMember.name}
                                            onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Designation</label>
                                        <input
                                            type="text" required
                                            className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-hustle-accent transition-all"
                                            placeholder="e.g. Designer"
                                            value={newMember.designation}
                                            onChange={e => setNewMember({ ...newMember, designation: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Role</label>
                                        <select
                                            className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-hustle-accent transition-all appearance-none"
                                            value={newMember.role}
                                            onChange={e => setNewMember({ ...newMember, role: e.target.value })}
                                        >
                                            <option value="Member">Member</option>
                                            <option value="Admin">Admin</option>
                                        </select>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Email Address</label>
                                        <input
                                            type="email" required
                                            className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-hustle-accent transition-all"
                                            placeholder="email@company.com"
                                            value={newMember.email}
                                            onChange={e => setNewMember({ ...newMember, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="pt-6 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsAdding(false)}
                                        className="flex-1 py-4 text-slate-500 hover:text-white font-bold transition-colors"
                                    >
                                        Discard
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[2] bg-hustle-accent hover:bg-sky-400 text-slate-900 py-4 rounded-2xl font-black text-lg transition-all shadow-xl shadow-sky-500/20"
                                    >
                                        Invite to Team
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Team;
