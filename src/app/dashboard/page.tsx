'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import { motion } from 'framer-motion';
import {
    HiOutlineBookOpen,
    HiOutlineAcademicCap,
    HiOutlineClock,
    HiOutlineChartBar,
    HiOutlineTrendingUp,
    HiOutlineUserGroup,
    HiOutlinePlay,
    HiOutlineArrowRight,
    HiOutlineCheckCircle,
    HiOutlineStar,
    HiOutlineGlobeAlt,
    HiOutlineLightningBolt,
} from 'react-icons/hi';
import { demoCourses, demoProgress, demoTeams, demoUsers, formatDuration } from '@/lib/demoData';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function DashboardPage() {
    const { userProfile, loading, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/login');
        }
    }, [loading, user, router]);

    if (loading || !userProfile) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner" />
            </div>
        );
    }

    // --------- Executive Dashboard ---------
    if (userProfile.role === 'executive') {
        const myProgress = demoProgress.filter(p => p.userId === userProfile.uid);
        const assignedTeam = demoTeams.find(t => t.memberIds.includes(userProfile.uid));
        const teamAssigned = assignedTeam ? assignedTeam.assignedCourseIds : [];
        const personalAssigned = userProfile.assignedCourseIds || [];
        const allAssigned = [...new Set([...teamAssigned, ...personalAssigned])];
        const assignedCourses = demoCourses.filter(c => allAssigned.includes(c.id));
        const completedCount = myProgress.filter(p => p.overallProgress === 100).length;
        const inProgressCount = myProgress.filter(p => p.overallProgress > 0 && p.overallProgress < 100).length;

        return (
            <AppLayout pageTitle="Dashboard">
                {/* Welcome */}
                <div
                    className="animate-item"
                    style={{
                        background: 'var(--primary-gradient)',
                        borderRadius: '16px',
                        padding: '32px 24px',
                        color: 'white',
                        marginBottom: '24px',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                    <div style={{
                        position: 'absolute',
                        top: '-40px',
                        right: '-40px',
                        width: '200px',
                        height: '200px',
                        background: 'rgba(255,255,255,0.08)',
                        borderRadius: '50%'
                    }} />
                    <div style={{
                        position: 'absolute',
                        bottom: '-60px',
                        right: '80px',
                        width: '160px',
                        height: '160px',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '50%'
                    }} />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>
                            Welcome back, {userProfile.displayName?.split(' ')[0] || 'Traveler'}! 👋
                        </h2>
                        <p style={{ opacity: 0.9, fontSize: '14px', maxWidth: '500px' }}>
                            {inProgressCount > 0
                                ? `You have ${inProgressCount} course${inProgressCount > 1 ? 's' : ''} in progress. Keep learning!`
                                : 'Start exploring your assigned destinations to level up your sales skills.'}
                        </p>
                        {inProgressCount > 0 && (
                            <button
                                className="btn-secondary-custom"
                                onClick={() => router.push('/courses')}
                                style={{
                                    marginTop: '16px',
                                    background: 'rgba(255,255,255,0.2)',
                                    color: 'white',
                                    border: '1.5px solid rgba(255,255,255,0.4)'
                                }}
                            >
                                <HiOutlinePlay /> Continue Learning
                            </button>
                        )}
                    </div>
                </div>

                {/* Stats */}
                <div className="row g-3 mb-4">
                    <div className="col-6 col-md-3 animate-item animate-delay-1">
                        <div className="stat-card">
                            <div className="stat-icon green"><HiOutlineBookOpen /></div>
                            <div className="stat-content">
                                <div className="stat-label">Assigned</div>
                                <div className="stat-value">{assignedCourses.length}</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 col-md-3 animate-item animate-delay-2">
                        <div className="stat-card">
                            <div className="stat-icon blue"><HiOutlineLightningBolt /></div>
                            <div className="stat-content">
                                <div className="stat-label">In Progress</div>
                                <div className="stat-value">{inProgressCount}</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 col-md-3 animate-item animate-delay-3">
                        <div className="stat-card">
                            <div className="stat-icon gold"><HiOutlineCheckCircle /></div>
                            <div className="stat-content">
                                <div className="stat-label">Completed</div>
                                <div className="stat-value">{completedCount}</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 col-md-3 animate-item animate-delay-4">
                        <div className="stat-card">
                            <div className="stat-icon orange"><HiOutlineStar /></div>
                            <div className="stat-content">
                                <div className="stat-label">Achievements</div>
                                <div className="stat-value">3</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Assigned Courses */}
                <div className="animate-item animate-delay-5" style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Your Courses</h3>
                        <button className="btn-ghost" onClick={() => router.push('/courses')}>
                            View All <HiOutlineArrowRight />
                        </button>
                    </div>
                    <div className="row g-3">
                        {assignedCourses.map((course, index) => {
                            const progress = myProgress.find(p => p.courseId === course.id);
                            return (
                                <div className={`col-12 col-md-6 col-lg-4 animate-item animate-delay-${Math.min(index + 6, 8)}`} key={course.id}>
                                    <div className="card-custom" onClick={() => router.push(`/courses/${course.id}`)} style={{ cursor: 'pointer' }}>
                                        <div className="card-thumbnail" style={{ background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <HiOutlineGlobeAlt style={{ fontSize: '48px', color: 'rgba(255,255,255,0.6)' }} />
                                            {progress?.overallProgress === 100 && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '12px',
                                                    right: '12px',
                                                    background: 'white',
                                                    color: 'var(--primary)',
                                                    borderRadius: '20px',
                                                    padding: '4px 12px',
                                                    fontSize: '11px',
                                                    fontWeight: 700,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px'
                                                }}>
                                                    <HiOutlineCheckCircle /> Completed
                                                </div>
                                            )}
                                        </div>
                                        <div className="card-body-content">
                                            <div className="card-category">{course.category}</div>
                                            <div className="card-title-text">{course.title}</div>
                                            <div className="card-desc">{course.description}</div>
                                            {progress && progress.overallProgress > 0 && (
                                                <div style={{ marginBottom: '8px' }}>
                                                    <div className="progress-label">
                                                        <span className="progress-text">Progress</span>
                                                        <span className="progress-percent">{progress.overallProgress}%</span>
                                                    </div>
                                                    <div className="progress-custom">
                                                        <div className="progress-fill" style={{ width: `${progress.overallProgress}%` }} />
                                                    </div>
                                                </div>
                                            )}
                                            <div className="card-meta">
                                                <span className="card-meta-item">
                                                    <HiOutlineBookOpen /> {course.totalLessons} Lessons
                                                </span>
                                                <span className="card-meta-item">
                                                    <HiOutlineClock /> {formatDuration(course.totalDuration)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>


            </AppLayout>
        );
    }

    // --------- Manager Dashboard ---------
    if (userProfile.role === 'manager') {
        const managedTeams = demoTeams.filter(t => t.managerId === userProfile.uid);
        const teamMemberIds = managedTeams.flatMap(t => t.memberIds);
        const teamMembers = demoUsers.filter(u => teamMemberIds.includes(u.uid));
        const teamProgress = demoProgress.filter(p => teamMemberIds.includes(p.userId));
        const completedByTeam = teamProgress.filter(p => p.overallProgress === 100).length;
        const avgProgress = teamProgress.length > 0
            ? Math.round(teamProgress.reduce((a, b) => a + b.overallProgress, 0) / teamProgress.length)
            : 0;

        return (
            <AppLayout pageTitle="Manager Dashboard">
                {/* Welcome */}
                <div style={{
                    background: 'var(--primary-gradient)',
                    borderRadius: 'var(--border-radius-lg)',
                    padding: '32px',
                    color: 'white',
                    marginBottom: '24px'
                }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>
                        Team Overview 📊
                    </h2>
                    <p style={{ opacity: 0.9, fontSize: '14px' }}>
                        Monitor your team&apos;s learning progress and completion rates across all assigned destinations.
                    </p>
                </div>

                {/* Stats */}
                <div className="row g-3 mb-4">
                    <div className="col-6 col-md-3">
                        <div className="stat-card">
                            <div className="stat-icon green"><HiOutlineUserGroup /></div>
                            <div className="stat-content">
                                <div className="stat-label">Team Members</div>
                                <div className="stat-value">{teamMembers.length}</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="stat-card">
                            <div className="stat-icon blue"><HiOutlineTrendingUp /></div>
                            <div className="stat-content">
                                <div className="stat-label">Avg Progress</div>
                                <div className="stat-value">{avgProgress}%</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="stat-card">
                            <div className="stat-icon gold"><HiOutlineCheckCircle /></div>
                            <div className="stat-content">
                                <div className="stat-label">Completions</div>
                                <div className="stat-value">{completedByTeam}</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="stat-card">
                            <div className="stat-icon orange"><HiOutlineBookOpen /></div>
                            <div className="stat-content">
                                <div className="stat-label">Teams</div>
                                <div className="stat-value">{managedTeams.length}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Team Members Table */}
                <div className="card-custom" style={{ marginBottom: '24px' }}>
                    <div className="card-body-content">
                        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Team Members</h3>
                        <div style={{ overflowX: 'auto' }}>
                            <table className="table-custom">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Team</th>
                                        <th>Courses Enrolled</th>
                                        <th>Avg Progress</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {teamMembers.map(member => {
                                        const memberProg = teamProgress.filter(p => p.userId === member.uid);
                                        const memberAvg = memberProg.length > 0
                                            ? Math.round(memberProg.reduce((a, b) => a + b.overallProgress, 0) / memberProg.length)
                                            : 0;
                                        const allComplete = memberProg.length > 0 && memberProg.every(p => p.overallProgress === 100);
                                        return (
                                            <tr key={member.uid}>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <div style={{
                                                            width: '32px',
                                                            height: '32px',
                                                            borderRadius: '50%',
                                                            background: 'var(--primary-gradient)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: 'white',
                                                            fontSize: '12px',
                                                            fontWeight: 600
                                                        }}>
                                                            {member.displayName.split(' ').map(n => n[0]).join('')}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: 600 }}>{member.displayName}</div>
                                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{member.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{member.teamName || '-'}</td>
                                                <td>{memberProg.length}</td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <div className="progress-custom" style={{ flex: 1, maxWidth: '100px' }}>
                                                            <div className="progress-fill" style={{ width: `${memberAvg}%` }} />
                                                        </div>
                                                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary)' }}>{memberAvg}%</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`badge-custom ${allComplete ? 'success' : memberAvg > 0 ? 'warning' : 'info'}`}>
                                                        {allComplete ? 'Completed' : memberAvg > 0 ? 'In Progress' : 'Not Started'}
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

                {/* Managed Teams */}
                <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Your Teams</h3>
                    <div className="row g-3">
                        {managedTeams.map(team => {
                            const teamCourses = demoCourses.filter(c => team.assignedCourseIds.includes(c.id));
                            return (
                                <div className="col-12 col-md-6" key={team.id}>
                                    <div className="card-custom" style={{ cursor: 'pointer' }} onClick={() => router.push('/team')}>
                                        <div className="card-body-content">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                                <div style={{
                                                    width: '44px',
                                                    height: '44px',
                                                    borderRadius: '10px',
                                                    background: 'var(--primary-lighter)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'var(--primary)',
                                                    fontSize: '20px'
                                                }}>
                                                    <HiOutlineUserGroup />
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '15px', fontWeight: 600 }}>{team.name}</div>
                                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                                        {team.memberIds.length} members • {teamCourses.length} courses
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                                {teamCourses.map(c => (
                                                    <span key={c.id} className="badge-custom success">{c.destination}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </AppLayout>
        );
    }

    // --------- Admin Dashboard ---------
    const totalUsers = demoUsers.length;
    const totalCourses = demoCourses.length;
    const totalCompletions = demoProgress.filter(p => p.overallProgress === 100).length;
    const avgOverall = demoProgress.length > 0
        ? Math.round(demoProgress.reduce((a, b) => a + b.overallProgress, 0) / demoProgress.length)
        : 0;

    // Top destinations by engagement
    const courseEngagement = demoCourses.map(course => {
        const enrollments = demoProgress.filter(p => p.courseId === course.id);
        return {
            ...course,
            enrollments: enrollments.length,
            completions: enrollments.filter(p => p.overallProgress === 100).length,
            avgProgress: enrollments.length > 0
                ? Math.round(enrollments.reduce((a, b) => a + b.overallProgress, 0) / enrollments.length)
                : 0,
        };
    }).sort((a, b) => b.enrollments - a.enrollments);

    return (
        <AppLayout pageTitle="Admin Dashboard">
            {/* Welcome */}
            <div style={{
                background: 'var(--primary-gradient)',
                borderRadius: 'var(--border-radius-lg)',
                padding: '32px',
                color: 'white',
                marginBottom: '24px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute', top: '-40px', right: '-40px',
                    width: '200px', height: '200px', background: 'rgba(255,255,255,0.08)', borderRadius: '50%'
                }} />
                <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px', position: 'relative', zIndex: 1 }}>
                    Platform Overview 🌍
                </h2>
                <p style={{ opacity: 0.9, fontSize: '14px', position: 'relative', zIndex: 1 }}>
                    Monitor all learners, courses, and team performance across the Outbound Travelers training platform.
                </p>
            </div>

            {/* Stats */}
            <div className="row g-3 mb-4">
                <div className="col-6 col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon green"><HiOutlineUserGroup /></div>
                        <div className="stat-content">
                            <div className="stat-label">Total Learners</div>
                            <div className="stat-value">{totalUsers}</div>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon blue"><HiOutlineBookOpen /></div>
                        <div className="stat-content">
                            <div className="stat-label">Active Courses</div>
                            <div className="stat-value">{totalCourses}</div>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon gold"><HiOutlineStar /></div>
                        <div className="stat-content">
                            <div className="stat-label">Completions</div>
                            <div className="stat-value">{totalCompletions}</div>
                        </div>
                    </div>
                </div>

            </div>

            <div className="row g-3 mb-4">
                {/* Course Engagement */}
                <div className="col-12 col-lg-8">
                    <div className="card-custom">
                        <div className="card-body-content">
                            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Course Engagement</h3>
                            <div style={{ overflowX: 'auto' }}>
                                <table className="table-custom">
                                    <thead>
                                        <tr>
                                            <th>Destination</th>
                                            <th>Enrollments</th>
                                            <th>Completions</th>
                                            <th>Avg Progress</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {courseEngagement.map(course => (
                                            <tr key={course.id}>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <div style={{
                                                            width: '32px', height: '32px', borderRadius: '8px',
                                                            background: 'var(--primary-lighter)', display: 'flex',
                                                            alignItems: 'center', justifyContent: 'center',
                                                            color: 'var(--primary)', fontSize: '16px'
                                                        }}>
                                                            <HiOutlineGlobeAlt />
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: 600 }}>{course.destination}</div>
                                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{course.category}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td><span style={{ fontWeight: 600 }}>{course.enrollments}</span></td>
                                                <td>
                                                    <span className="badge-custom success">{course.completions}</span>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <div className="progress-custom" style={{ flex: 1, maxWidth: '80px' }}>
                                                            <div className="progress-fill" style={{ width: `${course.avgProgress}%` }} />
                                                        </div>
                                                        <span style={{ fontSize: '13px', fontWeight: 600 }}>{course.avgProgress}%</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Leaderboard */}
                <div className="col-12 col-lg-4">
                    <div className="card-custom">
                        <div className="card-body-content">
                            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>🏆 Top Learners</h3>
                            {demoUsers
                                .filter(u => u.role === 'executive')
                                .map(user => {
                                    const userProg = demoProgress.filter(p => p.userId === user.uid);
                                    const avg = userProg.length > 0
                                        ? Math.round(userProg.reduce((a, b) => a + b.overallProgress, 0) / userProg.length)
                                        : 0;
                                    return { ...user, avgProgress: avg, completions: userProg.filter(p => p.overallProgress === 100).length };
                                })
                                .sort((a, b) => b.avgProgress - a.avgProgress)
                                .slice(0, 5)
                                .map((user, idx) => (
                                    <div className="leaderboard-item" key={user.uid}>
                                        <div className={`leaderboard-rank ${idx === 0 ? 'top-1' : idx === 1 ? 'top-2' : idx === 2 ? 'top-3' : ''}`}>
                                            {idx + 1}
                                        </div>
                                        <div className="leaderboard-info">
                                            <div className="leaderboard-name">{user.displayName}</div>
                                            <div className="leaderboard-score">{user.completions} completed</div>
                                        </div>
                                        <div className="leaderboard-progress">{user.avgProgress}%</div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Quick Actions</h3>
                <div className="row g-3">
                    {[
                        { label: 'Create Course', desc: 'Build a new destination training', icon: HiOutlineBookOpen, path: '/admin/courses' },
                        { label: 'Manage Users', desc: 'Add or modify user roles', icon: HiOutlineUserGroup, path: '/admin/users' },
                        { label: 'View Analytics', desc: 'Detailed platform analytics', icon: HiOutlineChartBar, path: '/admin/analytics' },
                        { label: 'Manage Teams', desc: 'Team assignments & mappings', icon: HiOutlineGlobeAlt, path: '/admin/teams' },
                    ].map(action => {
                        const Icon = action.icon;
                        return (
                            <div className="col-6 col-md-3" key={action.path}>
                                <div className="card-custom" onClick={() => router.push(action.path)} style={{ cursor: 'pointer' }}>
                                    <div className="card-body-content" style={{ textAlign: 'center', padding: '24px' }}>
                                        <div style={{
                                            width: '48px', height: '48px', borderRadius: '12px',
                                            background: 'var(--primary-lighter)', display: 'flex',
                                            alignItems: 'center', justifyContent: 'center',
                                            color: 'var(--primary)', fontSize: '22px',
                                            margin: '0 auto 12px'
                                        }}>
                                            <Icon />
                                        </div>
                                        <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>{action.label}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{action.desc}</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
}
