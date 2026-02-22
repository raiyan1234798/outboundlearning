'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import { HiOutlineGlobeAlt } from 'react-icons/hi';

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
            <div className="auth-container">
                {/* Left Banner */}
                <div className="auth-banner">
                    <div className="login-header-wrapper">
                        <div className="login-brand-wrapper">
                            <div className="login-brand-icon">
                                <HiOutlineGlobeAlt />
                            </div>
                            <div>
                                <div className="login-brand-title">Outbound</div>
                                <div className="login-brand-subtitle">Travelers</div>
                            </div>
                        </div>
                        <h1 className="auth-banner-title">
                            Master Every<br />Destination
                        </h1>
                        <p className="auth-banner-subtitle">
                            Your gateway to comprehensive travel training. Learn about destinations,
                            master selling techniques, and become a travel expert through our
                            structured video courses.
                        </p>
                        <div className="login-stats-grid">
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
                        </div>
                    </div>
                </div>

                {/* Right Form */}
                <div className="auth-form-section">
                    <h2>{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
                    <p className="auth-subtitle">
                        {isRegister
                            ? 'Join the Outbound Travelers training platform'
                            : 'Sign in to continue your learning journey'}
                    </p>

                    <button className="google-btn" onClick={handleGoogle} disabled={loading}>
                        <FcGoogle size={20} />
                        Continue with Google
                    </button>

                    <div className="divider">or</div>

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
                </div>
            </div>
        </div>
    );
}
