import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, LayoutDashboard } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        login(email, password);
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-hustle-dark flex items-center justify-center relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-hustle-purple/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-hustle-accent/20 rounded-full blur-[100px]" />

            <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 p-8 rounded-2xl shadow-2xl w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="bg-gradient-to-r from-hustle-accent to-hustle-purple p-3 rounded-xl">
                            <LayoutDashboard className="text-white" size={32} />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-slate-400">Enter your credentials to access HustleBoard</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-slate-300 text-sm font-medium mb-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-hustle-accent focus:ring-1 focus:ring-hustle-accent transition-all"
                            placeholder="alex@hustle.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-slate-300 text-sm font-medium mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-hustle-accent focus:ring-1 focus:ring-hustle-accent transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-hustle-accent to-hustle-purple hover:to-hustle-accent text-white font-bold py-3 rounded-xl shadow-lg shadow-hustle-purple/25 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <span>Sign In</span>
                        <ArrowRight size={20} />
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-500">
                    <p>Don't have an account? <Link to="/signup" className="text-hustle-accent cursor-pointer hover:underline">Sign up</Link></p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
