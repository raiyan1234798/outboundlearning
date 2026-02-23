'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import {
    HiOutlineHome,
    HiOutlineBookOpen,
    HiOutlineAcademicCap,
    HiOutlineUserGroup,
    HiOutlineChartBar,
    HiOutlineCog,
    HiOutlineLogout,
    HiOutlineMenu,
    HiOutlineX,
    HiOutlineBell,
    HiOutlineSearch,
    HiOutlineDocumentText,
    HiOutlineGlobeAlt,
    HiOutlineCollection,
    HiOutlineUsers,
    HiOutlinePlusCircle,
    HiOutlineLockClosed,
} from 'react-icons/hi';
import { HiOutlineClipboardDocumentList } from 'react-icons/hi2';
import { FiChevronLeft } from 'react-icons/fi';

interface AppLayoutProps {
    children: React.ReactNode;
    pageTitle?: string;
}

export default function AppLayout({ children, pageTitle = 'Dashboard' }: AppLayoutProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { userProfile, logout, isAdmin, isManager } = useAuth();

    const navigate = (path: string) => {
        router.push(path);
        setMobileOpen(false);
    };

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    const navItems = [
        { label: 'Dashboard', icon: HiOutlineHome, path: '/dashboard', roles: ['admin', 'manager', 'executive'] },
        { label: 'My Learning', icon: HiOutlineBookOpen, path: '/courses', roles: ['admin', 'manager', 'executive'] },
    ];

    const managerItems = [
        { label: 'Team Progress', icon: HiOutlineUserGroup, path: '/team', roles: ['manager', 'admin'] },
    ];

    const adminItems = [
        { label: 'Course Builder', icon: HiOutlinePlusCircle, path: '/admin/courses', roles: ['admin'] },
        { label: 'Access Requests', icon: HiOutlineClipboardDocumentList, path: '/admin/access', roles: ['admin'] },
        { label: 'Manage Users', icon: HiOutlineUsers, path: '/admin/users', roles: ['admin'] },
        { label: 'Manage Teams', icon: HiOutlineCollection, path: '/admin/teams', roles: ['admin'] },
        { label: 'Analytics', icon: HiOutlineChartBar, path: '/admin/analytics', roles: ['admin'] },
    ];

    const isActive = (path: string) => pathname === path || pathname?.startsWith(path + '/');

    const renderNavItem = (item: typeof navItems[0]) => {
        if (!item.roles.includes(userProfile?.role || 'executive')) return null;
        const Icon = item.icon;
        return (
            <button
                key={item.path}
                className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
            >
                <span className="nav-icon"><Icon /></span>
                {!sidebarCollapsed && <span>{item.label}</span>}
            </button>
        );
    };

    const initials = userProfile?.displayName
        ? userProfile.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    if (userProfile && !userProfile.isApproved && !isAdmin) {
        return (
            <div className="loading-screen" style={{ flexDirection: 'column', gap: '16px', textAlign: 'center', padding: '24px' }}>
                <HiOutlineLockClosed size={64} color="var(--text-muted)" />
                <h2 style={{ fontSize: '24px', fontWeight: 600 }}>Approval Pending</h2>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 10px' }}>
                    Your account has been created successfully but is waiting for an administrator to approve your access.
                </p>
                <button className="btn-secondary-custom" onClick={handleLogout}>
                    Sign Out
                </button>
            </div>
        );
    }

    return (
        <div className="app-layout">
            {/* Sidebar Overlay */}
            <div
                className={`sidebar-overlay ${mobileOpen ? 'show' : ''}`}
                onClick={() => setMobileOpen(false)}
            />

            {/* Sidebar */}
            <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
                {/* Brand */}
                <div className="sidebar-brand">
                    <div className="brand-icon">
                        <HiOutlineGlobeAlt />
                    </div>
                    {!sidebarCollapsed && (
                        <div className="brand-text">
                            <span className="brand-title">Outbound</span>
                            <span className="brand-subtitle">Travelers</span>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="sidebar-nav">
                    {!sidebarCollapsed && <div className="nav-section-title">Main Menu</div>}
                    {navItems.map(renderNavItem)}

                    {(isManager || isAdmin) && (
                        <>
                            {!sidebarCollapsed && <div className="nav-section-title">Management</div>}
                            {managerItems.map(renderNavItem)}
                        </>
                    )}

                    {isAdmin && (
                        <>
                            {!sidebarCollapsed && <div className="nav-section-title">Administration</div>}
                            {adminItems.map(renderNavItem)}
                        </>
                    )}
                </nav>

                {/* Footer */}
                <div className="sidebar-footer">
                    <div className="sidebar-user">
                        <div className="user-avatar">{initials}</div>
                        {!sidebarCollapsed && (
                            <div className="user-info">
                                <div className="user-name">{userProfile?.displayName || 'User'}</div>
                                <div className="user-role">{userProfile?.role || 'executive'}</div>
                            </div>
                        )}
                    </div>
                    <button
                        className="nav-item logout-btn"
                        onClick={handleLogout}
                    >
                        <span className="nav-icon"><HiOutlineLogout /></span>
                        {!sidebarCollapsed && <span>Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* Main */}
            <div className={`main-content ${sidebarCollapsed ? 'collapsed' : ''}`}>
                {/* Topbar */}
                <header className={`topbar ${sidebarCollapsed ? 'collapsed' : ''}`}>
                    <div className="topbar-left">
                        <button
                            className="topbar-toggle"
                            aria-label="Toggle Sidebar"
                            onClick={() => {
                                if (window.innerWidth <= 992) {
                                    setMobileOpen(!mobileOpen);
                                } else {
                                    setSidebarCollapsed(!sidebarCollapsed);
                                }
                            }}
                        >
                            {mobileOpen ? <HiOutlineX /> : sidebarCollapsed ? <HiOutlineMenu /> : <FiChevronLeft />}
                        </button>
                        <h1 className="topbar-title">{pageTitle}</h1>
                    </div>
                    <div className="topbar-right">
                        <div className="search-bar hidden-search">
                            <HiOutlineSearch className="search-icon" />
                            <input placeholder="Search courses..." />
                        </div>
                        <button className="topbar-btn" aria-label="Notifications" onClick={() => navigate('/notifications')}>
                            <HiOutlineBell />
                            <span className="badge-dot" />
                        </button>
                        <button className="topbar-btn" aria-label="Settings" onClick={() => navigate('/settings')}>
                            <HiOutlineCog />
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={pathname}
                        className="page-container"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Mobile Bottom Nav */}
            <nav className="bottom-nav">
                <div className="bottom-nav-items">
                    <button
                        className={`bottom-nav-item ${isActive('/dashboard') ? 'active' : ''}`}
                        onClick={() => navigate('/dashboard')}
                    >
                        <HiOutlineHome className="bnav-icon" />
                        <span>Home</span>
                    </button>
                    <button
                        className={`bottom-nav-item ${isActive('/courses') ? 'active' : ''}`}
                        onClick={() => navigate('/courses')}
                    >
                        <HiOutlineBookOpen className="bnav-icon" />
                        <span>Courses</span>
                    </button>

                    {(isManager || isAdmin) && (
                        <button
                            className={`bottom-nav-item ${isActive('/team') ? 'active' : ''}`}
                            onClick={() => navigate('/team')}
                        >
                            <HiOutlineUserGroup className="bnav-icon" />
                            <span>Team</span>
                        </button>
                    )}
                    <button
                        className={`bottom-nav-item ${isActive('/settings') ? 'active' : ''}`}
                        onClick={() => navigate('/settings')}
                    >
                        <HiOutlineCog className="bnav-icon" />
                        <span>More</span>
                    </button>
                </div>
            </nav>
        </div>
    );
}
