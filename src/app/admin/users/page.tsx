'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import { demoUsers, demoTeams } from '@/lib/demoData';
import {
    HiOutlineSearch,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineUserGroup,
    HiOutlineShieldCheck,
    HiOutlineBriefcase,
    HiOutlineUsers,
} from 'react-icons/hi';

export default function AdminUsersPage() {
    const { userProfile, loading, user } = useAuth();
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editUser, setEditUser] = useState<any>(null);

    useEffect(() => {
        if (!loading && !user) router.replace('/login');
    }, [loading, user, router]);

    if (loading || !userProfile) {
        return <div className="loading-screen"><div className="loading-spinner" /></div>;
    }

    const filtered = demoUsers.filter(u => {
        const matchSearch = u.displayName.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase());
        const matchRole = roleFilter === 'all' || u.role === roleFilter;
        return matchSearch && matchRole;
    });

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'admin': return <HiOutlineShieldCheck />;
            case 'manager': return <HiOutlineBriefcase />;
            default: return <HiOutlineUsers />;
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin': return 'danger';
            case 'manager': return 'warning';
            default: return 'info';
        }
    };

    return (
        <AppLayout pageTitle="Manage Users">
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>User Management</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Manage user roles and team assignments.</p>
            </div>

            {/* Stats */}
            <div className="row g-3 mb-4">
                <div className="col-6 col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon green"><HiOutlineUsers /></div>
                        <div className="stat-content">
                            <div className="stat-label">Total Users</div>
                            <div className="stat-value">{demoUsers.length}</div>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon blue"><HiOutlineShieldCheck /></div>
                        <div className="stat-content">
                            <div className="stat-label">Admins</div>
                            <div className="stat-value">{demoUsers.filter(u => u.role === 'admin').length}</div>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon gold"><HiOutlineBriefcase /></div>
                        <div className="stat-content">
                            <div className="stat-label">Managers</div>
                            <div className="stat-value">{demoUsers.filter(u => u.role === 'manager').length}</div>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon orange"><HiOutlineUserGroup /></div>
                        <div className="stat-content">
                            <div className="stat-label">Executives</div>
                            <div className="stat-value">{demoUsers.filter(u => u.role === 'executive').length}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div className="search-bar" style={{ maxWidth: '300px' }}>
                    <HiOutlineSearch className="search-icon" />
                    <input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {['all', 'admin', 'manager', 'executive'].map(role => (
                        <button
                            key={role}
                            className="btn-ghost"
                            onClick={() => setRoleFilter(role)}
                            style={{
                                background: roleFilter === role ? 'var(--primary)' : 'var(--gray-100)',
                                color: roleFilter === role ? 'white' : 'var(--text-secondary)',
                                borderRadius: '20px',
                                padding: '6px 16px',
                                fontSize: '13px',
                            }}
                        >
                            {role === 'all' ? 'All' : role.charAt(0).toUpperCase() + role.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Users Table */}
            <div className="card-custom">
                <div className="card-body-content" style={{ padding: 0 }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="table-custom">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Role</th>
                                    <th>Team</th>
                                    <th>Status</th>
                                    <th>Joined</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(u => (
                                    <tr key={u.uid}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{
                                                    width: '36px', height: '36px', borderRadius: '50%',
                                                    background: 'var(--primary-gradient)', display: 'flex',
                                                    alignItems: 'center', justifyContent: 'center',
                                                    color: 'white', fontSize: '13px', fontWeight: 600
                                                }}>
                                                    {u.displayName.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600 }}>{u.displayName}</div>
                                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{u.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge-custom ${getRoleBadge(u.role)}`}>
                                                {getRoleIcon(u.role)} {u.role}
                                            </span>
                                        </td>
                                        <td>{u.teamName || '-'}</td>
                                        <td>
                                            <span className={`badge-custom ${u.isActive ? 'success' : 'danger'}`}>
                                                {u.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '6px' }}>
                                                <button className="btn-ghost" style={{ padding: '6px 8px' }}>
                                                    <HiOutlinePencil />
                                                </button>
                                                <button className="btn-ghost" style={{ padding: '6px 8px', color: 'var(--accent-red)' }}>
                                                    <HiOutlineTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
