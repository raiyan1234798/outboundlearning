"use client";

import { motion } from "framer-motion";
import { Users, BookOpen, Inbox, FileQuestion, ArrowUpRight, ArrowDownRight } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
    const stats = [
        { title: "Total Users", value: "2,400", change: "+12%", trend: "up", icon: Users, color: "bg-blue-500" },
        { title: "Active Courses", value: "45", change: "+3%", trend: "up", icon: BookOpen, color: "bg-emerald-500" },
        { title: "Pending Requests", value: "12", change: "-2%", trend: "down", icon: Inbox, color: "bg-amber-500" },
        { title: "Total Quizzes", value: "89", change: "+5%", trend: "up", icon: FileQuestion, color: "bg-purple-500" },
    ];

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: i * 0.1 }}
                        className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-100/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 rounded-[1.2rem] text-white ${stat.color} shadow-lg shadow-current/20`}>
                                <stat.icon className="w-7 h-7" />
                            </div>
                            <span className={`flex items-center gap-1 text-sm font-bold ${stat.trend === "up" ? "text-emerald-500 bg-emerald-50" : "text-red-500 bg-red-50"} px-3 py-1.5 rounded-full`}>
                                {stat.trend === "up" ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                {stat.change}
                            </span>
                        </div>
                        <div>
                            <p className="text-slate-500 font-semibold mb-1 uppercase tracking-wider text-xs">{stat.title}</p>
                            <h3 className="text-4xl font-black text-slate-800 tracking-tight">{stat.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-[1.5rem] shadow-sm border border-slate-100 p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-slate-800">Recent Activity</h3>
                        <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-4 py-2 rounded-lg">View All</button>
                    </div>
                    <div className="space-y-6">
                        {[
                            { text: "John Doe requested Sales Executive Access", time: "2 hours ago", status: "Pending", color: "bg-amber-100 text-amber-700" },
                            { text: "Europe Destination Certification completed by Team C", time: "5 hours ago", status: "Success", color: "bg-emerald-100 text-emerald-700" },
                            { text: "New course 'Advanced Negotiation' needs review", time: "1 day ago", status: "Review", color: "bg-blue-100 text-blue-700" },
                        ].map((activity, i) => (
                            <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition">
                                <div className={`w-3 h-3 rounded-full mt-2 ${activity.color.split(" ")[0].replace("100", "500")}`} />
                                <div className="flex-1">
                                    <p className="text-slate-800 font-medium">{activity.text}</p>
                                    <p className="text-slate-500 text-sm mt-1">{activity.time}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${activity.color}`}>
                                    {activity.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Links */}
                <div className="bg-emerald-950 rounded-[1.5rem] p-8 text-white relative overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-48 h-48 bg-emerald-500 rounded-full blur-[80px] opacity-20" />
                    <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
                    <div className="space-y-3 relative z-10 w-full flex flex-col items-center">
                        <Link href="/admin/requests" className="w-full bg-emerald-900/50 hover:bg-emerald-800 text-white font-semibold p-4 rounded-xl transition flex items-center justify-between group">
                            <span>Review Requests</span>
                            <ArrowUpRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition" />
                        </Link>
                        <Link href="/admin/courses/new" className="w-full bg-emerald-900/50 hover:bg-emerald-800 text-white font-semibold p-4 rounded-xl transition flex items-center justify-between group">
                            <span>Create Course</span>
                            <ArrowUpRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition" />
                        </Link>
                        <Link href="/admin/reports" className="w-full bg-emerald-900/50 hover:bg-emerald-800 text-white font-semibold p-4 rounded-xl transition flex items-center justify-between group">
                            <span>Generate Report</span>
                            <ArrowUpRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
