'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import { UserProfile, Course } from '@/lib/types';
import { demoUsers, demoTeams, demoCourses } from '@/lib/demoData';
import {
    HiOutlineSearch,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineUserGroup,
    HiOutlineShieldCheck,
    HiOutlineBriefcase,
    HiOutlineUsers,
    HiOutlineCheckCircle,
} from 'react-icons/hi';
import { HiOutlineXMark } from 'react-icons/hi2';

export default function AdminUsersPage() {
    const { userProfile, loading, user } = useAuth();
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editUser, setEditUser] = useState<any>(null);

    const [users, setUsers] = useState<UserProfile[]>(demoUsers);

    // Edit Form State
    const [editRole, setEditRole] = useState<any>('executive');
    const [editTeamId, setEditTeamId] = useState('');
    const [editIsActive, setEditIsActive] = useState(true);
    const [editIsApproved, setEditIsApproved] = useState(true);
    const [assignedCourseIds, setAssignedCourseIds] = useState<string[]>([]);

    useEffect(() => {
        if (!loading && !user) router.replace('/login');
    }, [loading, user, router]);

    if (loading || !userProfile) {
        return <div className="loading-screen"><div className="loading-spinner" /></div>;
    }

    const filtered = users.filter(u => {
        const matchSearch = u.displayName.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase());
        const matchRole = roleFilter === 'all' || u.role === roleFilter;
        return matchSearch && matchRole;
    });

    const handleEditClick = (u: UserProfile) => {
        setEditUser(u);
        setEditRole(u.role);
        setEditTeamId(u.teamId || '');
        setEditIsActive(u.isActive);
        setEditIsApproved(u.isApproved !== false);
        setAssignedCourseIds(u.assignedCourseIds || []);
        setShowModal(true);
    };

    const handleSaveUser = () => {
        setUsers(users.map(u => u.uid === editUser.uid ? {
            ...u,
            role: editRole,
            teamId: editTeamId || undefined,
            teamName: demoTeams.find(t => t.id === editTeamId)?.name,
            isActive: editIsActive,
            isApproved: editIsApproved,
            assignedCourseIds
        } : u));
        setShowModal(false);
        setEditUser(null);
    };

    const handleDeleteUser = (uid: string) => {
        if (window.confirm("Are you sure you want to completely remove this user?")) {
            setUsers(users.filter(u => u.uid !== uid));
        }
    };


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
                                                <button
                                                    className="btn-ghost"
                                                    style={{ padding: '6px 8px' }}
                                                    onClick={() => handleEditClick(u)}
                                                    title="Edit User"
                                                >
                                                    <HiOutlinePencil />
                                                </button>
                                                <button
                                                    className="btn-ghost"
                                                    style={{ padding: '6px 8px', color: 'var(--accent-red)' }}
                                                    onClick={() => handleDeleteUser(u.uid)}
                                                    title="Delete User"
                                                >
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

            {/* Edit User Modal */}
            {showModal && editUser && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
                }}>
                    <div style={{
                        background: 'white', borderRadius: '12px', width: '100%', maxWidth: '500px',
                        maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Edit User</h3>
                            <button className="btn-ghost" style={{ padding: '4px' }} onClick={() => setShowModal(false)}>
                                <HiOutlineXMark size={20} />
                            </button>
                        </div>
                        <div style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '50%',
                                    background: 'var(--primary-gradient)', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                    color: 'white', fontSize: '14px', fontWeight: 600
                                }}>
                                    {editUser.displayName.split(' ').map((n: string) => n[0]).join('')}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '15px' }}>{editUser.displayName}</div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{editUser.email}</div>
                                </div>
                            </div>

                            <div className="form-group-custom" style={{ marginBottom: '16px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Role</label>
                                <select
                                    style={{
                                        width: '100%', padding: '10px 14px', border: '1.5px solid var(--border-color)',
                                        borderRadius: 'var(--border-radius-sm)', fontFamily: 'Poppins, sans-serif', fontSize: '14px'
                                    }}
                                    value={editRole}
                                    onChange={(e) => setEditRole(e.target.value)}
                                >
                                    <option value="executive">Executive</option>
                                    <option value="manager">Manager</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div className="form-group-custom" style={{ marginBottom: '16px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Team Assignment</label>
                                <select
                                    style={{
                                        width: '100%', padding: '10px 14px', border: '1.5px solid var(--border-color)',
                                        borderRadius: 'var(--border-radius-sm)', fontFamily: 'Poppins, sans-serif', fontSize: '14px'
                                    }}
                                    value={editTeamId}
                                    onChange={(e) => setEditTeamId(e.target.value)}
                                >
                                    <option value="">No Team</option>
                                    {demoTeams.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={editIsApproved}
                                        onChange={(e) => setEditIsApproved(e.target.checked)}
                                        style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                                    />
                                    <span style={{ fontSize: '14px' }}>Approved</span>
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={editIsActive}
                                        onChange={(e) => setEditIsActive(e.target.checked)}
                                        style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                                    />
                                    <span style={{ fontSize: '14px' }}>Active Account</span>
                                </label>
                            </div>

                            {/* Course Assignment */}
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>
                                    Assign Specific Courses
                                </label>
                                <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                                    {demoCourses.map(course => (
                                        <label key={course.id} style={{
                                            display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
                                            borderBottom: '1px solid var(--border-color)', cursor: 'pointer',
                                            background: assignedCourseIds.includes(course.id) ? 'var(--primary-lighter)' : 'white'
                                        }}>
                                            <input
                                                type="checkbox"
                                                checked={assignedCourseIds.includes(course.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) setAssignedCourseIds([...assignedCourseIds, course.id]);
                                                    else setAssignedCourseIds(assignedCourseIds.filter(id => id !== course.id));
                                                }}
                                                style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                                            />
                                            <div style={{ fontSize: '13px' }}>
                                                <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{course.title}</div>
                                                <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{course.category}</div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
                                    *Users also inherit courses assigned to their team. Check specific courses to grant additional access.
                                </p>
                            </div>
                        </div>
                        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button className="btn-secondary-custom" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn-primary-custom" onClick={handleSaveUser}>
                                <HiOutlineCheckCircle /> Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
