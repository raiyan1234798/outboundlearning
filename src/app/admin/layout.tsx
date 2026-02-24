"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, FileQuestion, LineChart, MessageSquare, PlusCircle, Settings, BookOpen, Inbox, LayoutDashboard, Menu, X, GraduationCap, ChevronLeft, LogOut, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedLogo from "@/components/AnimatedLogo";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    const navItems = [
        { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { label: "Access Requests", href: "/admin/requests", icon: Inbox },
        { label: "Manage Users", href: "/admin/users", icon: Users },
        { label: "Manage Courses", href: "/admin/courses", icon: BookOpen },
        { label: "New Course", href: "/admin/courses/new", icon: PlusCircle },
        { label: "Quiz Builder", href: "/admin/quizzes", icon: FileQuestion },
        { label: "Evaluations", href: "/admin/evaluations", icon: GraduationCap },
        { label: "Analytics", href: "/admin/analytics", icon: LineChart },
        { label: "Reports & Exports", href: "/admin/reports", icon: FileText },
        { label: "Support Messages", href: "/admin/support", icon: MessageSquare },
        { label: "Settings", href: "/admin/settings", icon: Settings },
    ];

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
            {/* Mobile Sidebar overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-emerald-950/20 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                className={`fixed inset-y-0 left-0 z-50 w-72 bg-emerald-950 text-white flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="p-6 flex items-center justify-between border-b border-emerald-900/50">
                    <AnimatedLogo theme="dark" />
                    <button onClick={() => setSidebarOpen(false)} aria-label="Close Sidebar" className="visible lg:hidden text-emerald-400 hover:text-white transition">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1 custom-scrollbar">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${isActive ? "bg-emerald-800 text-emerald-50 font-semibold" : "text-emerald-300 hover:bg-emerald-900/50 hover:text-white"}`}
                            >
                                <item.icon className={`w-5 h-5 transition-colors ${isActive ? "text-emerald-400" : "text-emerald-500 group-hover:text-emerald-400"}`} />
                                {item.label}
                                {isActive && (
                                    <motion.div layoutId="activeNav" className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-emerald-400 rounded-r-md rounded-l-none" />
                                )}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-emerald-900/50">
                    <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-emerald-300 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group">
                        <LogOut className="w-5 h-5 group-hover:text-red-400" />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full relative overflow-y-auto custom-scrollbar">
                {/* Top Header */}
                <header className="h-20 lg:h-24 px-8 border-b border-slate-200 bg-white/50 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(true)} aria-label="Open Sidebar" className="lg:hidden p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-500 hover:text-emerald-600">
                            <Menu className="w-6 h-6" />
                        </button>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-slate-800 capitalize hidden sm:block">
                                {pathname.split("/").pop() === "admin" ? "Dashboard Overview" : pathname.split("/").pop()?.replace("-", " ")}
                            </h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end hidden md:flex">
                            <span className="text-sm font-bold text-slate-800">Administrator</span>
                            <span className="text-xs text-slate-500 font-medium">Headquarters</span>
                        </div>
                        <div className="w-12 h-12 rounded-full border-2 border-emerald-100 p-0.5">
                            <div className="w-full h-full bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">A</div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 p-6 lg:p-10 pb-20">
                    {children}
                </div>
            </main>
        </div>
    );
}
