'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import { demoTeams, demoUsers, demoProgress, demoCourses, demoCertificates } from '@/lib/demoData';
import {
    HiOutlineUserGroup,
    HiOutlineCheckCircle,
    HiOutlineTrendingUp,
    HiOutlineBookOpen,
    HiOutlineAcademicCap,
    HiOutlineGlobeAlt,
} from 'react-icons/hi';

export default function TeamPage() {
    const { userProfile, loading, user, isAdmin, isManager } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) router.replace('/login');
    }, [loading, user, router]);

    if (loading || !userProfile) {
        return <div className="loading-screen"><div className="loading-spinner" /></div>;
    }

    // Get teams based on role
    const managedTeams = isAdmin
        ? demoTeams
        : demoTeams.filter(t => t.managerId === userProfile.uid);

    if (managedTeams.length === 0) {
        return (
            <AppLayout pageTitle="Team Progress">
                <div className="empty-state">
                    <div className="empty-icon"><HiOutlineUserGroup /></div>
                    <h3>No Teams Assigned</h3>
                    <p>You don&apos;t have any teams assigned to you yet.</p>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout pageTitle="Team Progress">
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>Team Management</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                    Monitor your teams&apos; learning progress and performance.
                </p>
            </div>

            {managedTeams.map(team => {
                const teamMembers = demoUsers.filter(u => team.memberIds.includes(u.uid));
                const teamCourses = demoCourses.filter(c => team.assignedCourseIds.includes(c.id));
                const teamProg = demoProgress.filter(p => team.memberIds.includes(p.userId));
                const completedCount = teamProg.filter(p => p.overallProgress === 100).length;
                const avgProg = teamProg.length > 0
                    ? Math.round(teamProg.reduce((a, b) => a + b.overallProgress, 0) / teamProg.length)
                    : 0;

                return (
                    <div key={team.id} style={{ marginBottom: '32px' }}>
                        {/* Team Header */}
                        <div className="card-custom" style={{ marginBottom: '16px' }}>
                            <div className="card-body-content">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                                    <div style={{
                                        width: '52px', height: '52px', borderRadius: '12px',
                                        background: 'var(--primary-gradient)', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center',
                                        color: 'white', fontSize: '24px'
                                    }}>
                                        <HiOutlineUserGroup />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '18px', fontWeight: 700 }}>{team.name}</h3>
                                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>{team.description}</p>
                                    </div>
                                </div>

                                {/* Team Stats */}
                                <div className="row g-2">
                                    <div className="col-6 col-md-3">
                                        <div style={{ background: 'var(--gray-50)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                                            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--primary)' }}>{teamMembers.length}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Members</div>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-3">
                                        <div style={{ background: 'var(--gray-50)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                                            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--primary)' }}>{teamCourses.length}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Courses</div>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-3">
                                        <div style={{ background: 'var(--gray-50)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                                            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--primary)' }}>{avgProg}%</div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Avg Progress</div>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-3">
                                        <div style={{ background: 'var(--gray-50)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                                            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--primary)' }}>{completedCount}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Completions</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Assigned Courses */}
                        <div style={{ marginBottom: '16px' }}>
                            <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-muted)' }}>
                                Assigned Destinations
                            </h4>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {teamCourses.map(c => (
                                    <span key={c.id} className="badge-custom success" style={{ fontSize: '12px', padding: '5px 14px' }}>
                                        <HiOutlineGlobeAlt /> {c.destination}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Members Table */}
                        <div className="card-custom">
                            <div className="card-body-content">
                                <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>Team Members</h4>
                                <div style={{ overflowX: 'auto' }}>
                                    <table className="table-custom">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Courses Enrolled</th>
                                                <th>Completed</th>
                                                <th>Avg Progress</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {teamMembers.map(member => {
                                                const memberProg = demoProgress.filter(p => p.userId === member.uid);
                                                const memberCompleted = memberProg.filter(p => p.overallProgress === 100).length;
                                                const memberAvg = memberProg.length > 0
                                                    ? Math.round(memberProg.reduce((a, b) => a + b.overallProgress, 0) / memberProg.length)
                                                    : 0;
                                                const memberCerts = demoCertificates.filter(c => c.userId === member.uid);

                                                return (
                                                    <tr key={member.uid}>
                                                        <td>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                <div style={{
                                                                    width: '32px', height: '32px', borderRadius: '50%',
                                                                    background: 'var(--primary-gradient)', display: 'flex',
                                                                    alignItems: 'center', justifyContent: 'center',
                                                                    color: 'white', fontSize: '12px', fontWeight: 600
                                                                }}>
                                                                    {member.displayName.split(' ').map(n => n[0]).join('')}
                                                                </div>
                                                                <div>
                                                                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{member.displayName}</div>
                                                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{member.email}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>{memberProg.length}</td>
                                                        <td>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                <HiOutlineCheckCircle style={{ color: 'var(--primary)' }} />
                                                                {memberCompleted}
                                                                {memberCerts.length > 0 && (
                                                                    <HiOutlineAcademicCap style={{ color: 'var(--accent-gold)', marginLeft: '4px' }} />
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                <div className="progress-custom" style={{ flex: 1, maxWidth: '100px' }}>
                                                                    <div className="progress-fill" style={{ width: `${memberAvg}%` }} />
                                                                </div>
                                                                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary)' }}>
                                                                    {memberAvg}%
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span className={`badge-custom ${memberAvg === 100 ? 'success' :
                                                                    memberAvg > 0 ? 'warning' :
                                                                        'info'
                                                                }`}>
                                                                {memberAvg === 100 ? 'Completed' : memberAvg > 0 ? 'In Progress' : 'Not Started'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </AppLayout>
    );
}
