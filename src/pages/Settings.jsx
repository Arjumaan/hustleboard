import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Bell, Save } from 'lucide-react';

const Settings = () => {
    const { user, updateUser } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        role: 'Product Designer (Mock)',
        notifications: true
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        updateUser({ name: formData.name });
        alert('Settings saved!');
    };

    return (
        <div className="flex-1 min-h-screen bg-hustle-dark ml-64 p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                <p className="text-slate-400">Manage your profile and preferences.</p>
            </header>

            <div className="max-w-3xl space-y-8">
                {/* Profile Section */}
                <section className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden p-6">
                    <div className="flex items-center space-x-4 mb-8">
                        <img src={user?.avatar} alt="User" className="w-20 h-20 rounded-full border-4 border-slate-700" />
                        <div>
                            <h3 className="text-xl font-bold text-white">{user?.name}</h3>
                            <p className="text-slate-400 text-sm">Member since 2023</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-slate-400 text-sm font-medium mb-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 text-slate-500" size={18} />
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-hustle-accent focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-slate-400 text-sm font-medium mb-1">Email Address</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={formData.email}
                                        disabled
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-500 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-700/50 pt-6">
                            <h4 className="text-white font-semibold mb-4 flex items-center gap-2"><Bell size={18} /> Notifications</h4>
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <div className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.notifications ? 'bg-hustle-accent' : 'bg-slate-600'}`} onClick={() => setFormData({ ...formData, notifications: !formData.notifications })}>
                                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${formData.notifications ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </div>
                                <span className="text-slate-300">Enable email notifications</span>
                            </label>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button className="bg-hustle-accent hover:bg-sky-400 text-slate-900 font-bold px-6 py-2.5 rounded-lg flex items-center space-x-2 transition-all shadow-lg shadow-sky-500/20">
                                <Save size={18} />
                                <span>Save Changes</span>
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    );
};

export default Settings;
