"use client";

import { motion } from "framer-motion";
import { PlayCircle, Clock, BookOpen, Award, TrendingUp, Zap, Target } from "lucide-react";
import Link from "next/link";

const ENROLLED_COURSES = [
    {
        id: "demo-1",
        title: "Mastering Asian Destinations",
        tag: "Sales Training",
        progress: 35,
        img: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop",
        lastAccessed: "2 hours ago"
    },
    {
        id: "demo-2",
        title: "Corporate Etiquette 101",
        tag: "Soft Skills",
        progress: 100,
        img: "https://images.unsplash.com/photo-1556761175-5973dc0f32d7?q=80&w=600&auto=format&fit=crop",
        lastAccessed: "Yesterday"
    }
];

export default function MyLearningPage() {
    const STATS = [
        { label: "Enrolled Courses", value: "2", icon: BookOpen, color: "text-blue-600", bg: "bg-blue-100", border: "border-blue-100 hover:border-blue-300" },
        { label: "Completed Courses", value: "1", icon: Award, color: "text-emerald-600", bg: "bg-emerald-100", border: "border-emerald-100 hover:border-emerald-300" },
        { label: "Learning Hours", value: "12.5h", icon: Clock, color: "text-amber-600", bg: "bg-amber-100", border: "border-amber-100 hover:border-amber-300" },
        { label: "Overall Score", value: "92%", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-100", border: "border-purple-100 hover:border-purple-300" },
    ];

    return (
        <div className="space-y-10 max-w-6xl mx-auto pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 mb-2">My Learning Dashboard</h2>
                    <p className="text-slate-500 font-medium">Track your corporate training progress, statistics, and achievements.</p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl font-bold border border-emerald-100">
                    <Zap className="w-5 h-5" />
                    <span>You're on a 3-day streak!</span>
                </div>
            </div>

            {/* Analytics Overview Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {STATS.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`bg-white rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition duration-300 group border-2 ${stat.border}`}
                    >
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition duration-300 ${stat.bg} group-hover:scale-110 shadow-inner`}>
                            <stat.icon className={`w-7 h-7 flex-shrink-0 ${stat.color}`} />
                        </div>
                        <h4 className="text-4xl font-black text-slate-800 mb-1">{stat.value}</h4>
                        <p className="text-sm font-bold text-slate-500">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* In Progress */}
            <div>
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Target className="w-6 h-6 text-emerald-500" />
                    Focus: In Progress
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {ENROLLED_COURSES.filter(c => c.progress < 100).map((course, i) => (
                        <motion.div
                            key={course.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white border-2 text-left border-slate-100 rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:border-emerald-200 hover:-translate-y-1 transition duration-300 group flex flex-col sm:flex-row gap-6 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="w-full sm:w-48 h-32 rounded-2xl overflow-hidden relative shrink-0 border border-slate-100 bg-slate-50 z-10">
                                <img src={course.img} alt="course" className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                                <div className="absolute inset-0 bg-emerald-900/10 group-hover:bg-black/40 transition duration-500 flex items-center justify-center">
                                    <PlayCircle className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition transform scale-75 group-hover:scale-100 duration-300 shadow-xl rounded-full" />
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col justify-center z-10">
                                <div className="text-xs font-black text-emerald-600 tracking-wider uppercase mb-1">{course.tag}</div>
                                <h4 className="text-xl font-bold text-slate-800 mb-4 line-clamp-2 leading-tight">{course.title}</h4>

                                <div className="space-y-2 mt-auto">
                                    <div className="flex justify-between text-xs font-bold text-slate-500">
                                        <span className="text-emerald-700">{course.progress}% Completed</span>
                                        <span>Active {course.lastAccessed}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden shadow-inner">
                                        <div className="bg-emerald-500 h-full rounded-full relative" style={{ width: `${course.progress}%` }}>
                                            <div className="absolute inset-0 bg-white/20 w-full" />
                                        </div>
                                    </div>
                                </div>
                                <Link href={`/dashboard/course/${course.id}`} className="mt-5 inline-block bg-slate-900 text-white hover:bg-emerald-600 font-bold px-5 py-2.5 text-sm rounded-xl transition w-fit shadow-md hover:shadow-emerald-500/20 active:scale-95">
                                    Resume Course
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Completed */}
            <div className="pt-8 mb-8">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Award className="w-6 h-6 text-emerald-500" />
                    Achievements & Completed
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ENROLLED_COURSES.filter(c => c.progress === 100).map((course, i) => (
                        <motion.div
                            key={course.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:shadow-lg hover:border-emerald-300 transition duration-300 group"
                        >
                            <div className="w-full h-40 rounded-2xl overflow-hidden mb-5 border border-slate-100 opacity-90 relative">
                                <img src={course.img} alt="course" className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition duration-300">
                                    <span className="text-white font-bold text-sm bg-emerald-500/90 px-3 py-1 rounded-lg backdrop-blur-sm">View Certificate</span>
                                </div>
                            </div>
                            <div className="text-xs font-black text-emerald-600 tracking-wider uppercase mb-1">{course.tag}</div>
                            <h4 className="text-lg font-bold text-slate-800 mb-4 line-clamp-2 leading-tight">{course.title}</h4>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-sm bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl w-fit">
                                    <Award className="w-4 h-4" /> Passed 100%
                                </div>
                                <span className="text-xs font-bold text-slate-400">Mar 2024</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
