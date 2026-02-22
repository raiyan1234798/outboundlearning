'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import {
    HiOutlineUser,
    HiOutlineBell,
    HiOutlineShieldCheck,
    HiOutlineLogout,
    HiOutlineGlobeAlt,
} from 'react-icons/hi';

export default function SettingsPage() {
    const { userProfile, loading, user, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) router.replace('/login');
    }, [loading, user, router]);

    if (loading || !userProfile) {
        return <div className="loading-screen"><div className="loading-spinner" /></div>;
    }

    const initials = userProfile.displayName
        ? userProfile.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    return (
        <AppLayout pageTitle="Settings">
            <div style={{ maxWidth: '700px' }}>
                {/* Profile Section */}
                <div className="card-custom" style={{ marginBottom: '20px' }}>
                    <div className="card-body-content">
                        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <HiOutlineUser /> Profile
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
                            <div style={{
                                width: '72px', height: '72px', borderRadius: '50%',
                                background: 'var(--primary-gradient)', display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                                color: 'white', fontSize: '24px', fontWeight: 700
                            }}>
                                {initials}
                            </div>
                            <div>
                                <div style={{ fontSize: '18px', fontWeight: 700 }}>{userProfile.displayName}</div>
                                <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{userProfile.email}</div>
                                <span className={`badge-custom ${userProfile.role === 'admin' ? 'danger' :
                                        userProfile.role === 'manager' ? 'warning' : 'success'
                                    }`} style={{ marginTop: '4px', display: 'inline-flex' }}>
                                    {userProfile.role}
                                </span>
                            </div>
                        </div>

                        <div className="row g-3">
                            <div className="col-12 col-md-6">
                                <div className="form-group-custom">
                                    <label>Display Name</label>
                                    <input defaultValue={userProfile.displayName || ''} />
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="form-group-custom">
                                    <label>Email</label>
                                    <input defaultValue={userProfile.email} disabled style={{ background: 'var(--gray-50)' }} />
                                </div>
                            </div>
                            {userProfile.teamName && (
                                <div className="col-12 col-md-6">
                                    <div className="form-group-custom">
                                        <label>Team</label>
                                        <input defaultValue={userProfile.teamName} disabled style={{ background: 'var(--gray-50)' }} />
                                    </div>
                                </div>
                            )}
                        </div>
                        <button className="btn-primary-custom" style={{ marginTop: '8px' }}>
                            Save Changes
                        </button>
                    </div>
                </div>

                {/* Notifications */}
                <div className="card-custom" style={{ marginBottom: '20px' }}>
                    <div className="card-body-content">
                        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <HiOutlineBell /> Notification Preferences
                        </h3>
                        {[
                            { label: 'Course assignments', desc: 'Get notified when new courses are assigned' },
                            { label: 'Lesson completions', desc: 'Notification when you complete a lesson' },
                            { label: 'Certificate earned', desc: 'Get notified when you earn a certificate' },
                            { label: 'Team updates', desc: 'Updates about your team members' },
                        ].map((item, idx) => (
                            <div key={idx} style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '12px 0', borderBottom: idx < 3 ? '1px solid var(--gray-100)' : 'none'
                            }}>
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: 500 }}>{item.label}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.desc}</div>
                                </div>
                                <label style={{ position: 'relative', width: '44px', height: '24px', cursor: 'pointer' }}>
                                    <input type="checkbox" defaultChecked style={{ display: 'none' }} />
                                    <span style={{
                                        position: 'absolute', inset: 0, borderRadius: '12px',
                                        background: 'var(--primary)', transition: 'var(--transition)'
                                    }} />
                                    <span style={{
                                        position: 'absolute', top: '2px', left: '22px',
                                        width: '20px', height: '20px', borderRadius: '50%',
                                        background: 'white', transition: 'var(--transition)',
                                        boxShadow: 'var(--shadow-sm)'
                                    }} />
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Account */}
                <div className="card-custom">
                    <div className="card-body-content">
                        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <HiOutlineShieldCheck /> Account
                        </h3>
                        <div style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '12px 0', borderBottom: '1px solid var(--gray-100)'
                        }}>
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: 500 }}>Role</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Your current platform role</div>
                            </div>
                            <span className="badge-custom success" style={{ textTransform: 'capitalize' }}>{userProfile.role}</span>
                        </div>
                        <div style={{ padding: '12px 0' }}>
                            <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>Account Created</div>
                            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                {new Date(userProfile.createdAt).toLocaleDateString('en-IN', {
                                    year: 'numeric', month: 'long', day: 'numeric'
                                })}
                            </div>
                        </div>
                        <div style={{ paddingTop: '12px', borderTop: '1px solid var(--gray-100)' }}>
                            <button
                                className="btn-ghost"
                                style={{ color: 'var(--accent-red)', fontWeight: 600 }}
                                onClick={async () => {
                                    await logout();
                                    router.push('/login');
                                }}
                            >
                                <HiOutlineLogout /> Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
