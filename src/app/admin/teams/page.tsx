'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import { demoTeams, demoUsers, demoCourses } from '@/lib/demoData';
import {
    HiOutlineUserGroup,
    HiOutlinePencil,
    HiOutlineGlobeAlt,
    HiOutlinePlusCircle,
    HiOutlineTrash,
    HiOutlineSearch,
} from 'react-icons/hi';

export default function AdminTeamsPage() {
    const { userProfile, loading, user } = useAuth();
    const router = useRouter();
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!loading && !user) router.replace('/login');
    }, [loading, user, router]);

    if (loading || !userProfile) {
        return <div className="loading-screen"><div className="loading-spinner" /></div>;
    }

    const filtered = demoTeams.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AppLayout pageTitle="Manage Teams">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>Team Management</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Create teams and assign courses to them.</p>
                </div>
                <button className="btn-primary-custom">
                    <HiOutlinePlusCircle /> Create Team
                </button>
            </div>

            <div className="search-bar" style={{ marginBottom: '20px', maxWidth: '300px' }}>
                <HiOutlineSearch className="search-icon" />
                <input placeholder="Search teams..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            <div className="row g-3">
                {filtered.map(team => {
                    const members = demoUsers.filter(u => team.memberIds.includes(u.uid));
                    const courses = demoCourses.filter(c => team.assignedCourseIds.includes(c.id));
                    const manager = demoUsers.find(u => u.uid === team.managerId);

                    return (
                        <div className="col-12 col-md-6" key={team.id}>
                            <div className="card-custom">
                                <div className="card-body-content">
                                    {/* Team Header */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{
                                                width: '48px', height: '48px', borderRadius: '12px',
                                                background: 'var(--primary-gradient)', display: 'flex',
                                                alignItems: 'center', justifyContent: 'center',
                                                color: 'white', fontSize: '22px'
                                            }}>
                                                <HiOutlineUserGroup />
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '16px', fontWeight: 600 }}>{team.name}</div>
                                                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                                    Manager: {manager?.displayName || team.managerName}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            <button className="btn-ghost" style={{ padding: '6px 8px' }}>
                                                <HiOutlinePencil />
                                            </button>
                                            <button className="btn-ghost" style={{ padding: '6px 8px', color: 'var(--accent-red)' }}>
                                                <HiOutlineTrash />
                                            </button>
                                        </div>
                                    </div>

                                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                                        {team.description}
                                    </p>

                                    {/* Assigned Courses */}
                                    <div style={{ marginBottom: '16px' }}>
                                        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                                            ASSIGNED DESTINATIONS
                                        </div>
                                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                            {courses.map(c => (
                                                <span key={c.id} className="badge-custom success">
                                                    <HiOutlineGlobeAlt /> {c.destination}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Members Preview */}
                                    <div>
                                        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                                            MEMBERS ({members.length})
                                        </div>
                                        <div style={{ display: 'flex', gap: '-8px' }}>
                                            {members.slice(0, 5).map((m, i) => (
                                                <div
                                                    key={m.uid}
                                                    style={{
                                                        width: '32px', height: '32px', borderRadius: '50%',
                                                        background: 'var(--primary-gradient)', display: 'flex',
                                                        alignItems: 'center', justifyContent: 'center',
                                                        color: 'white', fontSize: '11px', fontWeight: 600,
                                                        border: '2px solid white',
                                                        marginLeft: i > 0 ? '-8px' : '0',
                                                    }}
                                                    title={m.displayName}
                                                >
                                                    {m.displayName.split(' ').map(n => n[0]).join('')}
                                                </div>
                                            ))}
                                            {members.length > 5 && (
                                                <div style={{
                                                    width: '32px', height: '32px', borderRadius: '50%',
                                                    background: 'var(--gray-200)', display: 'flex',
                                                    alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)',
                                                    border: '2px solid white', marginLeft: '-8px'
                                                }}>
                                                    +{members.length - 5}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </AppLayout>
    );
}
