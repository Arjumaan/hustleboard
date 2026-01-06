import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Mail, Lock, User, ArrowRight, CheckCircle } from 'lucide-react';

const SignupPage = () => {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            signup({
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            navigate('/');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error for this field
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: ''
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-hustle-dark via-slate-900 to-hustle-secondary flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-hustle-accent/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-hustle-purple/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 relative z-10">
                {/* Left Side - Features */}
                <div className="hidden md:flex flex-col justify-center text-white space-y-8">
                    <div>
                        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-hustle-accent to-hustle-purple bg-clip-text text-transparent">
                            HustleBoard
                        </h1>
                        <p className="text-xl text-slate-300">Your all-in-one workspace for maximum productivity</p>
                    </div>

                    <div className="space-y-6">
                        {[
                            'Multi-workspace organization',
                            'Advanced task & project management',
                            'Internal wiki with bi-directional links',
                            'Database views with custom fields',
                            'Timeline & Gantt visualizations',
                            'Real-time collaboration'
                        ].map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-3 group">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-hustle-accent/20 to-hustle-purple/20 border border-hustle-accent/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <CheckCircle className="text-hustle-accent" size={20} />
                                </div>
                                <span className="text-slate-300 group-hover:text-white transition-colors">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side - Signup Form */}
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 md:p-12 shadow-2xl">
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="text-hustle-accent" size={24} />
                            <h2 className="text-3xl font-bold text-white">Create Account</h2>
                        </div>
                        <p className="text-slate-400">Start your productivity journey today</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name Field */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className={`w-full bg-slate-900/50 border ${errors.name ? 'border-red-500' : 'border-slate-700'} rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-hustle-accent transition-colors`}
                                />
                            </div>
                            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className={`w-full bg-slate-900/50 border ${errors.email ? 'border-red-500' : 'border-slate-700'} rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-hustle-accent transition-colors`}
                                />
                            </div>
                            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className={`w-full bg-slate-900/50 border ${errors.password ? 'border-red-500' : 'border-slate-700'} rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-hustle-accent transition-colors`}
                                />
                            </div>
                            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className={`w-full bg-slate-900/50 border ${errors.confirmPassword ? 'border-red-500' : 'border-slate-700'} rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-hustle-accent transition-colors`}
                                />
                            </div>
                            {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-hustle-accent to-hustle-purple hover:from-hustle-accent/90 hover:to-hustle-purple/90 text-white font-semibold py-4 rounded-xl transition-all shadow-lg shadow-hustle-accent/20 hover:shadow-hustle-accent/40 flex items-center justify-center gap-2 group"
                        >
                            Create Account
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-8 text-center">
                        <p className="text-slate-400">
                            Already have an account?{' '}
                            <Link to="/login" className="text-hustle-accent hover:text-hustle-accent/80 font-semibold transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
