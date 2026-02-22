'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import { demoCourses, demoProgress, demoTeams, demoUsers, demoCertificates } from '@/lib/demoData';
import {
    HiOutlineChartBar,
    HiOutlineUserGroup,
    HiOutlineBookOpen,
    HiOutlineAcademicCap,
    HiOutlineTrendingUp,
    HiOutlineClock,
    HiOutlineGlobeAlt,
} from 'react-icons/hi';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement);

export default function AdminAnalyticsPage() {
    const { userProfile, loading, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) router.replace('/login');
    }, [loading, user, router]);

    if (loading || !userProfile) {
        return <div className="loading-screen"><div className="loading-spinner" /></div>;
    }

    // Course enrollment data
    const courseData = demoCourses.map(c => {
        const enrollments = demoProgress.filter(p => p.courseId === c.id);
        return {
            name: c.destination,
            enrollments: enrollments.length,
            completions: enrollments.filter(p => p.overallProgress === 100).length,
            avgProgress: enrollments.length > 0
                ? Math.round(enrollments.reduce((sum, p) => sum + p.overallProgress, 0) / enrollments.length)
                : 0,
        };
    });

    // Team performance data
    const teamData = demoTeams.map(t => {
        const memberIds = t.memberIds;
        const teamProg = demoProgress.filter(p => memberIds.includes(p.userId));
        const avg = teamProg.length > 0
            ? Math.round(teamProg.reduce((sum, p) => sum + p.overallProgress, 0) / teamProg.length)
            : 0;
        return { name: t.name, avgProgress: avg, members: t.memberIds.length };
    });

    // Bar chart - enrollments
    const barData = {
        labels: courseData.map(c => c.name),
        datasets: [
            {
                label: 'Enrollments',
                data: courseData.map(c => c.enrollments),
                backgroundColor: 'rgba(13, 124, 62, 0.7)',
                borderRadius: 6,
            },
            {
                label: 'Completions',
                data: courseData.map(c => c.completions),
                backgroundColor: 'rgba(16, 160, 80, 0.5)',
                borderRadius: 6,
            },
        ],
    };

    // Doughnut - completion rate
    const totalEnrolled = demoProgress.length;
    const totalCompleted = demoProgress.filter(p => p.overallProgress === 100).length;
    const totalInProgress = demoProgress.filter(p => p.overallProgress > 0 && p.overallProgress < 100).length;
    const totalNotStarted = totalEnrolled - totalCompleted - totalInProgress;

    const doughnutData = {
        labels: ['Completed', 'In Progress', 'Not Started'],
        datasets: [{
            data: [totalCompleted, totalInProgress, Math.max(totalNotStarted, 0)],
            backgroundColor: ['#0d7c3e', '#fbbf24', '#e5e7eb'],
            borderWidth: 0,
        }],
    };

    // Line chart - team progress
    const lineData = {
        labels: teamData.map(t => t.name),
        datasets: [{
            label: 'Average Progress (%)',
            data: teamData.map(t => t.avgProgress),
            borderColor: '#0d7c3e',
            backgroundColor: 'rgba(13, 124, 62, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#0d7c3e',
            pointRadius: 6,
        }],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: { font: { family: 'Poppins', size: 12 } },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(0,0,0,0.05)' },
                ticks: { font: { family: 'Poppins', size: 11 } },
            },
            x: {
                grid: { display: false },
                ticks: { font: { family: 'Poppins', size: 11 } },
            },
        },
    };

    return (
        <AppLayout pageTitle="Analytics">
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>Platform Analytics</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Track engagement, completions, and team performance.</p>
            </div>

            {/* Top Stats */}
            <div className="row g-3 mb-4">
                <div className="col-6 col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon green"><HiOutlineUserGroup /></div>
                        <div className="stat-content">
                            <div className="stat-label">Total Learners</div>
                            <div className="stat-value">{demoUsers.filter(u => u.role === 'executive').length}</div>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon blue"><HiOutlineBookOpen /></div>
                        <div className="stat-content">
                            <div className="stat-label">Total Enrollments</div>
                            <div className="stat-value">{totalEnrolled}</div>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon gold"><HiOutlineTrendingUp /></div>
                        <div className="stat-content">
                            <div className="stat-label">Completion Rate</div>
                            <div className="stat-value">
                                {totalEnrolled > 0 ? Math.round((totalCompleted / totalEnrolled) * 100) : 0}%
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="stat-card">
                        <div className="stat-icon orange"><HiOutlineAcademicCap /></div>
                        <div className="stat-content">
                            <div className="stat-label">Certificates Issued</div>
                            <div className="stat-value">{demoCertificates.length}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="row g-3 mb-4">
                <div className="col-12 col-lg-8">
                    <div className="chart-container">
                        <div className="chart-title">Course Enrollments vs Completions</div>
                        <div style={{ height: '300px' }}>
                            <Bar data={barData} options={chartOptions} />
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-4">
                    <div className="chart-container">
                        <div className="chart-title">Overall Completion Status</div>
                        <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Doughnut data={doughnutData} options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'bottom',
                                        labels: { font: { family: 'Poppins', size: 12 }, padding: 16 },
                                    },
                                },
                            }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Team Performance */}
            <div className="row g-3 mb-4">
                <div className="col-12 col-lg-6">
                    <div className="chart-container">
                        <div className="chart-title">Team-wise Performance</div>
                        <div style={{ height: '280px' }}>
                            <Line data={lineData} options={chartOptions} />
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-6">
                    <div className="chart-container">
                        <div className="chart-title">Top Destinations by Engagement</div>
                        {courseData
                            .sort((a, b) => b.enrollments - a.enrollments)
                            .map((course, idx) => (
                                <div key={idx} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '10px 0',
                                    borderBottom: idx < courseData.length - 1 ? '1px solid var(--gray-100)' : 'none'
                                }}>
                                    <div style={{
                                        width: '32px', height: '32px', borderRadius: '8px',
                                        background: 'var(--primary-lighter)', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center',
                                        color: 'var(--primary)', fontSize: '16px'
                                    }}>
                                        <HiOutlineGlobeAlt />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '14px', fontWeight: 600 }}>{course.name}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                            {course.enrollments} enrolled • {course.completions} completed
                                        </div>
                                    </div>
                                    <div style={{ width: '80px' }}>
                                        <div className="progress-custom" style={{ marginBottom: '2px' }}>
                                            <div className="progress-fill" style={{ width: `${course.avgProgress}%` }} />
                                        </div>
                                        <div style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600, textAlign: 'right' }}>
                                            {course.avgProgress}%
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>

            {/* Completion Heatmap */}
            <div className="card-custom">
                <div className="card-body-content">
                    <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Completion Heatmap by Team & Destination</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="table-custom">
                            <thead>
                                <tr>
                                    <th>Team</th>
                                    {demoCourses.slice(0, 4).map(c => (
                                        <th key={c.id} style={{ textAlign: 'center' }}>{c.destination}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {demoTeams.map(team => (
                                    <tr key={team.id}>
                                        <td style={{ fontWeight: 600 }}>{team.name}</td>
                                        {demoCourses.slice(0, 4).map(course => {
                                            const isAssigned = team.assignedCourseIds.includes(course.id);
                                            if (!isAssigned) {
                                                return <td key={course.id} style={{ textAlign: 'center' }}>
                                                    <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>—</span>
                                                </td>;
                                            }
                                            const teamProg = demoProgress.filter(
                                                p => team.memberIds.includes(p.userId) && p.courseId === course.id
                                            );
                                            const avg = teamProg.length > 0
                                                ? Math.round(teamProg.reduce((s, p) => s + p.overallProgress, 0) / teamProg.length)
                                                : 0;
                                            const bg = avg >= 80 ? '#059669' : avg >= 50 ? '#d97706' : avg > 0 ? '#ea580c' : '#e5e7eb';
                                            const color = avg > 0 ? 'white' : 'var(--text-muted)';
                                            return (
                                                <td key={course.id} style={{ textAlign: 'center' }}>
                                                    <span style={{
                                                        display: 'inline-block',
                                                        padding: '4px 12px',
                                                        borderRadius: '6px',
                                                        background: bg,
                                                        color,
                                                        fontSize: '12px',
                                                        fontWeight: 600,
                                                    }}>
                                                        {avg}%
                                                    </span>
                                                </td>
                                            );
                                        })}
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
