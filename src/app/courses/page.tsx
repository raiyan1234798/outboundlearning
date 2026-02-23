'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, Variants } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import { demoCourses, demoTeams, demoProgress, formatDuration } from '@/lib/demoData';
import {
    HiOutlineSearch,
    HiOutlineBookOpen,
    HiOutlineClock,
    HiOutlineGlobeAlt,
    HiOutlineCheckCircle,
    HiOutlineFilter,
    HiOutlinePlay,
    HiOutlineStar,
    HiOutlineLockClosed,
} from 'react-icons/hi';

export default function CoursesPage() {
    const { userProfile, loading, user } = useAuth();
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');

    useEffect(() => {
        if (!loading && !user) router.replace('/login');
    }, [loading, user, router]);

    if (loading || !userProfile) {
        return <div className="loading-screen"><div className="loading-spinner" /></div>;
    }

    // Get courses based on role
    let courses = demoCourses;

    // Determine which courses are accessible
    const team = demoTeams.find(t => t.memberIds.includes(userProfile.uid));
    const teamAssigned = team ? team.assignedCourseIds : [];

    let allAssigned: string[] = [];
    if (userProfile.role === 'manager') {
        const teams = demoTeams.filter(t => t.managerId === userProfile.uid);
        const managedAssigned = teams.flatMap(t => t.assignedCourseIds);
        allAssigned = [...new Set([...managedAssigned, ...(userProfile.assignedCourseIds || [])])];
    } else {
        allAssigned = [...new Set([...teamAssigned, ...(userProfile.assignedCourseIds || [])])];
    }

    const checkAccess = (cId: string) => {
        if (userProfile.role === 'admin') return true;
        return allAssigned.includes(cId);
    };

    // Filter
    const categories = ['all', ...new Set(courses.map(c => c.category))];
    const filtered = courses.filter(c => {
        const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
            c.destination.toLowerCase().includes(search.toLowerCase());
        const matchCategory = categoryFilter === 'all' || c.category === categoryFilter;
        return matchSearch && matchCategory;
    });

    const myProgress = demoProgress.filter(p => p.userId === userProfile.uid);

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <AppLayout pageTitle="My Learning">
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>Destination Courses</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                    {userProfile.role === 'executive'
                        ? 'Complete your assigned destination training courses'
                        : 'Browse and manage destination training courses'
                    }
                </p>
            </div>

            {/* Filters */}
            <div style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '24px',
                flexWrap: 'wrap',
                alignItems: 'center'
            }}>
                <div className="search-bar" style={{ maxWidth: '300px' }}>
                    <HiOutlineSearch className="search-icon" />
                    <input
                        placeholder="Search destinations..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`btn-ghost ${categoryFilter === cat ? '' : ''}`}
                            onClick={() => setCategoryFilter(cat)}
                            style={{
                                background: categoryFilter === cat ? 'var(--primary)' : 'var(--gray-100)',
                                color: categoryFilter === cat ? 'white' : 'var(--text-secondary)',
                                borderRadius: '20px',
                                padding: '6px 16px',
                                fontSize: '13px',
                                fontWeight: 500,
                            }}
                        >
                            {cat === 'all' ? 'All' : cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Courses Grid */}
            {filtered.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon"><HiOutlineBookOpen /></div>
                    <h3>No Courses Found</h3>
                    <p>Try adjusting your search or filter criteria.</p>
                </div>
            ) : (
                <motion.div
                    className="row g-3"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    {filtered.map(course => {
                        const progress = myProgress.find(p => p.courseId === course.id);
                        const isCompleted = progress?.overallProgress === 100;
                        const isStarted = (progress?.overallProgress || 0) > 0;

                        return (
                            <motion.div className="col-12 col-md-6 col-lg-4" key={course.id} variants={itemVariants}>
                                <div
                                    className="card-custom"
                                    onClick={() => {
                                        if (checkAccess(course.id)) {
                                            router.push(`/courses/${course.id}`);
                                        } else {
                                            alert("Access requested! An admin must approve your request before you can begin.");
                                        }
                                    }}
                                    style={{ cursor: 'pointer', height: '100%', position: 'relative' }}
                                >
                                    <div className="card-thumbnail" style={{
                                        background: `linear-gradient(135deg, 
                      ${course.category === 'South India' ? '#059669, #10b981' :
                                                course.category === 'North India' ? '#0284c7, #38bdf8' :
                                                    course.category === 'West India' ? '#d97706, #fbbf24' :
                                                        '#7c3aed, #a78bfa'
                                            })`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'column',
                                        gap: '8px'
                                    }}>
                                        <HiOutlineGlobeAlt style={{ fontSize: '40px', color: 'rgba(255,255,255,0.7)' }} />
                                        <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', fontWeight: 600 }}>
                                            {course.destination}
                                        </span>
                                        {!checkAccess(course.id) && (
                                            <div style={{
                                                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                                background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: 'white', borderRadius: '16px 16px 0 0'
                                            }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                                    <HiOutlineLockClosed size={32} />
                                                    <span style={{ fontSize: '12px', fontWeight: 600 }}>Access Required</span>
                                                </div>
                                            </div>
                                        )}
                                        {isCompleted && (
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
                                                <HiOutlineCheckCircle /> Done
                                            </div>
                                        )}
                                        <div style={{
                                            position: 'absolute',
                                            top: '12px',
                                            left: '12px',
                                        }}>
                                            <span className={`badge-custom ${course.difficulty === 'beginner' ? 'success' :
                                                course.difficulty === 'intermediate' ? 'warning' : 'danger'
                                                }`}>
                                                {course.difficulty}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="card-body-content" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                        <div className="card-category">{course.category}</div>
                                        <div className="card-title-text">{course.title}</div>
                                        <div className="card-desc">{course.description}</div>

                                        {isStarted && !isCompleted && (
                                            <div style={{ marginBottom: '10px', marginTop: 'auto' }}>
                                                <div className="progress-label">
                                                    <span className="progress-text">Progress</span>
                                                    <span className="progress-percent">{progress?.overallProgress}%</span>
                                                </div>
                                                <div className="progress-custom">
                                                    <div className="progress-fill" style={{ width: `${progress?.overallProgress}%` }} />
                                                </div>
                                            </div>
                                        )}

                                        <div className="card-meta" style={{ marginTop: isStarted ? '0' : 'auto' }}>
                                            <span className="card-meta-item">
                                                <HiOutlineBookOpen /> {course.totalLessons} Lessons
                                            </span>
                                            <span className="card-meta-item">
                                                <HiOutlineClock /> {formatDuration(course.totalDuration)}
                                            </span>
                                            <span className="card-meta-item">
                                                <HiOutlineStar /> {course.modules.length} Modules
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}
        </AppLayout>
    );
}
