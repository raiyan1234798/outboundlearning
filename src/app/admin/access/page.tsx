'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import { demoAccessRequests, demoCourses } from '@/lib/demoData';
import { AccessRequest, Lesson } from '@/lib/types';
import {
    HiOutlineCheckCircle,
    HiOutlineXCircle,
    HiOutlineClock,
    HiOutlineUser,
    HiOutlineEnvelope,
    HiOutlineBookOpen,
    HiOutlineFunnel,
    HiOutlineEye,
} from 'react-icons/hi2';

export default function AccessRequestsPage() {
    const { userProfile, loading, user, isAdmin } = useAuth();
    const router = useRouter();
    const [requests, setRequests] = useState<AccessRequest[]>(demoAccessRequests);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
    const [reviewingReq, setReviewingReq] = useState<AccessRequest | null>(null);
    const [grantedLessons, setGrantedLessons] = useState<string[]>([]);
    const [adminNote, setAdminNote] = useState('');

    if (loading) return <div className="loading-screen"><div className="loading-spinner" /></div>;
    if (!user || !userProfile) { router.replace('/login'); return null; }
    if (!isAdmin) { router.replace('/dashboard'); return null; }

    const filtered = requests.filter(r => filter === 'all' || r.status === filter);
    const pendingCount = requests.filter(r => r.status === 'pending').length;
    const approvedCount = requests.filter(r => r.status === 'approved').length;
    const rejectedCount = requests.filter(r => r.status === 'rejected').length;

    const getCourseForRequest = (courseId: string) => demoCourses.find(c => c.id === courseId);
    const getAllLessonsForCourse = (courseId: string): Lesson[] => {
        const course = getCourseForRequest(courseId);
        if (!course) return [];
        return course.modules.flatMap(m => m.lessons);
    };

    const openReview = (req: AccessRequest) => {
        setReviewingReq(req);
        setGrantedLessons(req.grantedLessonIds || []);
        setAdminNote(req.adminNote || '');
    };

    const toggleLesson = (lessonId: string) => {
        setGrantedLessons(prev =>
            prev.includes(lessonId) ? prev.filter(id => id !== lessonId) : [...prev, lessonId]
        );
    };

    const selectAll = (courseId: string) => {
        setGrantedLessons(getAllLessonsForCourse(courseId).map(l => l.id));
    };

    const deselectAll = () => setGrantedLessons([]);

    const handleApprove = () => {
        if (!reviewingReq) return;
        setRequests(prev => prev.map(r =>
            r.id === reviewingReq.id ? {
                ...r,
                status: 'approved' as const,
                grantedLessonIds: grantedLessons.length > 0 ? grantedLessons : getAllLessonsForCourse(r.courseId).map(l => l.id),
                reviewedBy: userProfile!.uid,
                reviewedAt: new Date().toISOString(),
                adminNote,
            } : r
        ));
        setReviewingReq(null);
    };

    const handleReject = () => {
        if (!reviewingReq) return;
        setRequests(prev => prev.map(r =>
            r.id === reviewingReq.id ? {
                ...r,
                status: 'rejected' as const,
                reviewedBy: userProfile!.uid,
                reviewedAt: new Date().toISOString(),
                adminNote,
            } : r
        ));
        setReviewingReq(null);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending': return <span className="badge-custom warning"><HiOutlineClock /> Pending</span>;
            case 'approved': return <span className="badge-custom success"><HiOutlineCheckCircle /> Approved</span>;
            case 'rejected': return <span className="badge-custom danger"><HiOutlineXCircle /> Rejected</span>;
            default: return null;
        }
    };

    return (
        <AppLayout pageTitle="Access Requests">
            <div className="page-container">
                <h2 className="page-title">Access Management</h2>
                <p className="page-subtitle">Review course access requests and control lesson-level permissions.</p>

                {/* Stats */}
                <div className="access-stats">
                    <div className="access-stat pending" onClick={() => setFilter('pending')}>
                        <div className="stat-num">{pendingCount}</div>
                        <div className="stat-label">Pending</div>
                    </div>
                    <div className="access-stat approved" onClick={() => setFilter('approved')}>
                        <div className="stat-num">{approvedCount}</div>
                        <div className="stat-label">Approved</div>
                    </div>
                    <div className="access-stat rejected" onClick={() => setFilter('rejected')}>
                        <div className="stat-num">{rejectedCount}</div>
                        <div className="stat-label">Rejected</div>
                    </div>
                </div>

                {/* Filter */}
                <div className="filter-bar">
                    <HiOutlineFunnel />
                    {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
                        <button key={f} className={`filter-chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Kanban Cards */}
                <div className="access-list">
                    {filtered.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon"><HiOutlineBookOpen /></div>
                            <h3>No {filter !== 'all' ? filter : ''} requests</h3>
                            <p>Access requests from team members will appear here.</p>
                        </div>
                    ) : (
                        filtered.map(req => {
                            const course = getCourseForRequest(req.courseId);
                            return (
                                <div key={req.id} className={`access-card ${req.status}`}>
                                    <div className="access-card-header">
                                        <div className="access-user">
                                            <div className="user-avatar-sm">{req.userName.split(' ').map(n => n[0]).join('')}</div>
                                            <div>
                                                <div className="access-user-name">{req.userName}</div>
                                                <div className="access-user-email"><HiOutlineEnvelope /> {req.userEmail}</div>
                                            </div>
                                        </div>
                                        {getStatusBadge(req.status)}
                                    </div>

                                    <div className="access-card-body">
                                        <div className="access-course">
                                            <HiOutlineBookOpen />
                                            <span>{req.courseName}</span>
                                            {course && <span className="access-category">{course.category}</span>}
                                        </div>
                                        {req.message && <div className="access-message">&ldquo;{req.message}&rdquo;</div>}
                                        <div className="access-date">Requested: {new Date(req.requestedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                        {req.grantedLessonIds && req.grantedLessonIds.length > 0 && (
                                            <div className="access-granted">
                                                <strong>{req.grantedLessonIds.length}</strong> lessons granted
                                            </div>
                                        )}
                                        {req.adminNote && (
                                            <div className="access-admin-note">
                                                <strong>Admin Note:</strong> {req.adminNote}
                                            </div>
                                        )}
                                    </div>

                                    <div className="access-card-actions">
                                        {req.status === 'pending' ? (
                                            <button className="btn-primary-custom btn-sm" onClick={() => openReview(req)}>
                                                <HiOutlineEye /> Review & Assign Lessons
                                            </button>
                                        ) : (
                                            <button className="btn-secondary-custom btn-sm" onClick={() => openReview(req)}>
                                                <HiOutlineEye /> View Details
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Review Modal */}
                {reviewingReq && (
                    <div className="modal-overlay" onClick={() => setReviewingReq(null)}>
                        <div className="modal-content access-modal" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>Review Access Request</h3>
                                <button className="modal-close" onClick={() => setReviewingReq(null)}>×</button>
                            </div>

                            <div className="modal-body">
                                {/* User Info */}
                                <div className="review-section">
                                    <div className="review-user">
                                        <div className="user-avatar-md">{reviewingReq.userName.split(' ').map(n => n[0]).join('')}</div>
                                        <div>
                                            <h4>{reviewingReq.userName}</h4>
                                            <p><HiOutlineEnvelope /> {reviewingReq.userEmail}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Course */}
                                <div className="review-section">
                                    <label className="review-label">Course</label>
                                    <div className="review-course-name">
                                        <HiOutlineBookOpen /> {reviewingReq.courseName}
                                    </div>
                                    {reviewingReq.message && (
                                        <div className="review-message">&ldquo;{reviewingReq.message}&rdquo;</div>
                                    )}
                                </div>

                                {/* Lesson Picker (Kanban-style) */}
                                {reviewingReq.status === 'pending' && (
                                    <div className="review-section">
                                        <label className="review-label">
                                            Select Lessons to Grant Access
                                            <span className="selected-count">{grantedLessons.length} selected</span>
                                        </label>
                                        <div className="lesson-select-actions">
                                            <button className="btn-ghost btn-xs" onClick={() => selectAll(reviewingReq.courseId)}>Select All</button>
                                            <button className="btn-ghost btn-xs" onClick={deselectAll}>Clear All</button>
                                        </div>

                                        <div className="lesson-picker">
                                            {getCourseForRequest(reviewingReq.courseId)?.modules.map(mod => (
                                                <div key={mod.id} className="picker-module">
                                                    <div className="picker-module-title">{mod.title}</div>
                                                    {mod.lessons.map(lesson => (
                                                        <label key={lesson.id} className={`picker-lesson ${grantedLessons.includes(lesson.id) ? 'selected' : ''}`}>
                                                            <input
                                                                type="checkbox"
                                                                checked={grantedLessons.includes(lesson.id)}
                                                                onChange={() => toggleLesson(lesson.id)}
                                                            />
                                                            <span className="picker-lesson-title">{lesson.title}</span>
                                                            <span className="picker-lesson-duration">{formatDuration(lesson.videoDuration)}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Admin Note */}
                                <div className="review-section">
                                    <label className="review-label">Admin Note (optional)</label>
                                    <textarea
                                        className="form-control"
                                        rows={3}
                                        value={adminNote}
                                        onChange={e => setAdminNote(e.target.value)}
                                        placeholder="Add a note for the user..."
                                        disabled={reviewingReq.status !== 'pending'}
                                    />
                                </div>
                            </div>

                            {reviewingReq.status === 'pending' && (
                                <div className="modal-footer">
                                    <button className="btn-danger-custom" onClick={handleReject}>
                                        <HiOutlineXCircle /> Reject
                                    </button>
                                    <button className="btn-primary-custom" onClick={handleApprove} disabled={grantedLessons.length === 0}>
                                        <HiOutlineCheckCircle /> Approve ({grantedLessons.length} lessons)
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

function formatDuration(sec: number) {
    const m = Math.floor(sec / 60);
    return `${m}m`;
}
