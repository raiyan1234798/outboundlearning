'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import { HiOutlineGlobeAlt } from 'react-icons/hi';

const pageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

const formVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: "spring" } }
};

export default function LoginPage() {
    const [isRegister, setIsRegister] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, register, loginWithGoogle } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isRegister) {
                await register(email, password, name);
            } else {
                await login(email, password);
            }
            router.push('/dashboard');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Authentication failed');
        }
        setLoading(false);
    };

    const handleGoogle = async () => {
        setError('');
        setLoading(true);
        try {
            await loginWithGoogle();
            router.push('/dashboard');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Google sign-in failed');
        }
        setLoading(false);
    };

    return (
        <div className="auth-page">
            <motion.div
                className="auth-container"
                variants={pageVariants}
                initial="hidden"
                animate="show"
            >
                {/* Left Banner */}
                <div className="auth-banner">
                    <div className="login-header-wrapper">
                        <motion.div className="login-brand-wrapper" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <div className="login-brand-icon">
                                <HiOutlineGlobeAlt />
                            </div>
                            <div>
                                <div className="login-brand-title">Outbound</div>
                                <div className="login-brand-subtitle">Travelers</div>
                            </div>
                        </motion.div>
                        <motion.h1 className="auth-banner-title" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                            Master Every<br />Destination
                        </motion.h1>
                        <motion.p className="auth-banner-subtitle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                            Your gateway to comprehensive travel training. Learn about destinations,
                            master selling techniques, and become a travel expert through our
                            structured video courses.
                        </motion.p>
                        <motion.div className="login-stats-grid" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                            <div>
                                <div className="login-stat-value">50+</div>
                                <div className="login-stat-label">Destinations</div>
                            </div>
                            <div>
                                <div className="login-stat-value">200+</div>
                                <div className="login-stat-label">Video Lessons</div>
                            </div>
                            <div>
                                <div className="login-stat-value">1K+</div>
                                <div className="login-stat-label">Trained Staff</div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Right Form */}
                <motion.div className="auth-form-section" variants={formVariants} initial="hidden" animate="show">
                    <motion.h2 variants={itemVariants}>{isRegister ? 'Create Account' : 'Welcome Back'}</motion.h2>
                    <motion.p className="auth-subtitle" variants={itemVariants}>
                        {isRegister
                            ? 'Join the Outbound Travelers training platform'
                            : 'Sign in to continue your learning journey'}
                    </motion.p>

                    <motion.button className="google-btn" onClick={handleGoogle} disabled={loading} variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <FcGoogle size={20} />
                        Continue with Google
                    </motion.button>

                    <motion.div className="divider" variants={itemVariants}>or</motion.div>

                    {/* Demo Mode Banner */}
                    <div className="login-demo-banner">
                        <strong>🎯 Demo Mode Active</strong> — Use these emails with any password:
                        <div className="login-demo-emails">
                            <span><strong>Admin:</strong> admin@outbound.com</span>
                            <span><strong>Manager:</strong> priya@outbound.com</span>
                            <span><strong>Executive:</strong> anu@outbound.com</span>
                        </div>
                    </div>

                    {error && (
                        <div className="login-error-banner">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {isRegister && (
                            <div className="form-group-custom">
                                <label><FiUser className="login-form-icon" /> Full Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        )}

                        <div className="form-group-custom">
                            <label><FiMail className="login-form-icon" /> Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group-custom">
                            <label><FiLock className="login-form-icon" /> Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="password-toggle-btn"
                                >
                                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary-custom login-submit-btn"
                            disabled={loading}
                        >
                            {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
                        </button>
                    </form>

                    <p className="login-footer-text">
                        {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                        <button
                            onClick={() => { setIsRegister(!isRegister); setError(''); }}
                            className="login-toggle-btn"
                        >
                            {isRegister ? 'Sign In' : 'Create Account'}
                        </button>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}
