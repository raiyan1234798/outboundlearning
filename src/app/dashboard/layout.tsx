"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Award, Bell, Search, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedLogo from "@/components/AnimatedLogo";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    const navItems = [
        { label: "My Learning", href: "/dashboard", icon: LayoutDashboard },
        { label: "Course Catalog", href: "/dashboard/courses", icon: BookOpen },
        { label: "Support", href: "/dashboard/support", icon: Award },
    ];

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            <motion.aside
                className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 text-slate-800 flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="p-6 flex items-center justify-between border-b border-slate-100">
                    <AnimatedLogo theme="light" />
                    <button onClick={() => setSidebarOpen(false)} aria-label="Close Sidebar" className="visible lg:hidden text-slate-400 hover:text-slate-800 transition">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2 custom-scrollbar">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (pathname.startsWith('/dashboard/course/') && item.href === '/dashboard');
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${isActive ? "bg-emerald-50 text-emerald-700 font-bold" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800 font-medium"}`}
                            >
                                <item.icon className={`w-5 h-5 transition-colors ${isActive ? "text-emerald-600" : "text-slate-400 group-hover:text-emerald-500"}`} />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <Link href="/login" className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group font-medium">
                        <LogOut className="w-5 h-5 group-hover:text-red-500" />
                        Sign Out
                    </Link>
                </div>
            </motion.aside>

            <main className="flex-1 flex flex-col h-full relative overflow-y-auto custom-scrollbar">
                <header className="h-20 lg:h-24 px-8 border-b border-slate-200 bg-white/50 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(true)} aria-label="Open Sidebar" className="lg:hidden p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-500 hover:text-emerald-600">
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="relative w-48 md:w-64 hidden sm:block">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input placeholder="Search courses..." className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-sm outline-none focus:border-emerald-500 transition" />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button title="Notifications" className="relative text-slate-400 hover:text-emerald-600 transition">
                            <Bell className="w-6 h-6" />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white" />
                        </button>
                        <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                            <div className="flex flex-col items-end hidden md:flex">
                                <span className="text-sm font-bold text-slate-800">Learner</span>
                                <span className="text-xs text-slate-500 font-medium">Sales Team</span>
                            </div>
                            <div className="w-10 h-10 rounded-full border-2 border-emerald-100 p-0.5 overflow-hidden">
                                <img src="https://ui-avatars.com/api/?name=User&background=10b981&color=fff" alt="Avatar" className="w-full h-full object-cover rounded-full" />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-6 lg:p-10 pb-20">
                    {children}
                </div>
            </main>
        </div>
    );
}
