'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import {
    HiOutlineBell,
    HiOutlineBookOpen,
    HiOutlineAcademicCap,
    HiOutlineUserGroup,
    HiOutlineCheckCircle,
} from 'react-icons/hi';

const demoNotifications = [
    { id: '1', title: 'New Course Assigned', message: 'You have been assigned "Goa Premium Packages" training course.', type: 'course_assigned', isRead: false, createdAt: '2025-02-22T10:00:00', link: '/courses/course-goa' },
    { id: '2', title: 'Lesson Completed!', message: 'You completed "Introduction to Ooty" lesson. Keep going!', type: 'lesson_unlocked', isRead: false, createdAt: '2025-02-21T14:30:00' },
    { id: '4', title: 'Team Update', message: 'Deepa Nair completed 43% of Ooty Travel Guide.', type: 'team_update', isRead: true, createdAt: '2025-02-19T16:00:00' },
    { id: '5', title: 'New Module Available', message: 'A new module "Selling Manali" has been added to Manali Travel Training.', type: 'course_assigned', isRead: true, createdAt: '2025-02-18T11:00:00' },
];

export default function NotificationsPage() {
    const { userProfile, loading, user } = useAuth();
    const router = useRouter();
    const [notifications, setNotifications] = useState(demoNotifications);

    useEffect(() => {
        if (!loading && !user) router.replace('/login');
    }, [loading, user, router]);

    if (loading || !userProfile) {
        return <div className="loading-screen"><div className="loading-spinner" /></div>;
    }

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'course_assigned': return <HiOutlineBookOpen />;
            case 'team_update': return <HiOutlineUserGroup />;
            default: return <HiOutlineCheckCircle />;
        }
    };

    const getIconColor = (type: string) => {
        switch (type) {
            case 'course_assigned': return { bg: '#dbeafe', color: '#1e40af' };
            case 'team_update': return { bg: 'var(--primary-lighter)', color: 'var(--primary)' };
            default: return { bg: 'var(--primary-lighter)', color: 'var(--primary)' };
        }
    };

    const unread = notifications.filter(n => !n.isRead).length;

    return (
        <AppLayout pageTitle="Notifications">
            <div style={{ maxWidth: '700px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div>
                        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>Notifications</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                            {unread > 0 ? `${unread} unread notification${unread > 1 ? 's' : ''}` : 'All caught up!'}
                        </p>
                    </div>
                    {unread > 0 && (
                        <button className="btn-ghost" onClick={markAllRead}>
                            Mark All Read
                        </button>
                    )}
                </div>

                <div className="card-custom">
                    <div className="card-body-content" style={{ padding: 0 }}>
                        {notifications.map((notif, idx) => {
                            const iconStyle = getIconColor(notif.type);
                            return (
                                <div
                                    key={notif.id}
                                    style={{
                                        display: 'flex',
                                        gap: '14px',
                                        padding: '16px 20px',
                                        borderBottom: idx < notifications.length - 1 ? '1px solid var(--gray-100)' : 'none',
                                        background: notif.isRead ? 'transparent' : 'var(--primary-lighter)',
                                        cursor: notif.link ? 'pointer' : 'default',
                                        transition: 'var(--transition-fast)',
                                    }}
                                    onClick={() => notif.link && router.push(notif.link)}
                                >
                                    <div style={{
                                        width: '40px', height: '40px', borderRadius: '10px',
                                        background: iconStyle.bg, color: iconStyle.color,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '18px', flexShrink: 0
                                    }}>
                                        {getIcon(notif.type)}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div style={{ fontSize: '14px', fontWeight: notif.isRead ? 500 : 600 }}>{notif.title}</div>
                                            {!notif.isRead && (
                                                <div style={{
                                                    width: '8px', height: '8px', borderRadius: '50%',
                                                    background: 'var(--primary)', flexShrink: 0, marginTop: '6px'
                                                }} />
                                            )}
                                        </div>
                                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                            {notif.message}
                                        </div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
                                            {new Date(notif.createdAt).toLocaleDateString('en-IN', {
                                                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
