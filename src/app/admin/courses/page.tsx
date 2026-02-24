"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Book, MoreHorizontal, Video, PlayCircle, CheckCircle, ChevronLeft, Award } from "lucide-react";
import Link from "next/link";

const DEMO_COURSES = [
    {
        id: 1,
        title: "Mastering Asian Destinations",
        tag: "Sales Training",
        desc: "Comprehensive guide to selling outbound packages to Japan, Vietnam, and Thailand.",
        img: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop",
        video: "https://www.youtube.com/embed/jfKfPfyJRdk", // Lofi hip hop as placeholder demo
        modules: [
            { title: "Introduction to Vietnam", duration: "10:30", completed: true },
            { title: "Selling Japanese Luxury", duration: "15:45", completed: false, active: true },
            { title: "Thai Street Food Tours", duration: "08:20", completed: false },
        ]
    },
    {
        id: 2,
        title: "European River Cruises",
        tag: "Product Knowledge",
        desc: "Deep dive into selling high-ticket European river cruises across the Danube and Rhine.",
        img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=600&auto=format&fit=crop",
        video: "https://www.youtube.com/embed/LXb3EKWsInQ", // 4K nature video demo
        modules: [
            { title: "The Danube Experience", duration: "12:00", completed: false, active: true },
        ]
    },
    {
        id: 3,
        title: "Corporate Etiquette 101",
        tag: "Soft Skills",
        desc: "Learn the fundamentals of B2B corporate sales and international client etiquette.",
        img: "https://images.unsplash.com/photo-1556761175-5973dc0f32d7?q=80&w=600&auto=format&fit=crop",
        video: "https://www.youtube.com/embed/3JZ_D3ELwOQ",
        modules: []
    }
];

export default function ManageCoursesPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const [quizStarted, setQuizStarted] = useState(false);
    const [quizAnswered, setQuizAnswered] = useState(false);
    const [dropdownOpenId, setDropdownOpenId] = useState<number | null>(null);

    const formatVideoUrl = (url: string) => {
        if (!url) return "";
        if (url.includes("drive.google.com")) {
            return url.replace(/\/view.*$/, "/preview");
        }
        if (url.includes("youtube.com") || url.includes("youtu.be")) {
            const separator = url.includes("?") ? "&" : "?";
            return `${url}${separator}autoplay=0&controls=0&disablekb=1&rel=0&modestbranding=1`;
        }
        return url;
    };

    useEffect(() => {
        // Simulate network loading for "loading special effects"
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 40 },
        show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
    };

    if (selectedCourse) {
        return (
            <AnimatePresence mode="wait">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                >
                    <button
                        onClick={() => { setSelectedCourse(null); setQuizStarted(false); setQuizAnswered(false); }}
                        className="flex items-center gap-2 text-emerald-700 font-bold hover:bg-emerald-50 px-4 py-2 rounded-xl transition w-fit"
                    >
                        <ChevronLeft className="w-5 h-5" /> Back to Courses
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Video & Content Area */}
                        <div className="lg:col-span-2 space-y-6">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-black rounded-3xl overflow-hidden shadow-2xl aspect-video border-4 border-slate-800 relative group"
                            >
                                <iframe
                                    className="w-full h-full absolute inset-0"
                                    src={formatVideoUrl(selectedCourse.video)}
                                    title="Course Video"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </motion.div>

                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                                <span className="text-emerald-600 font-bold text-sm tracking-widest uppercase">{selectedCourse.tag}</span>
                                <h1 className="text-3xl font-black text-slate-800 mt-2 mb-4">{selectedCourse.title}</h1>
                                <p className="text-slate-600 leading-relaxed text-lg">{selectedCourse.desc}</p>
                            </div>

                            {/* Inbuilt Quiz Engine Demo */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-emerald-950 p-8 rounded-3xl shadow-2xl text-white relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] opacity-20 pointer-events-none" />
                                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2"><Award className="text-emerald-400" /> Knowledge Check</h3>

                                {!quizStarted ? (
                                    <div className="text-center py-8">
                                        <p className="text-emerald-100 mb-6 max-w-md mx-auto">Test your understanding of the video module before proceeding to the next lesson.</p>
                                        <button onClick={() => setQuizStarted(true)} className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black px-8 py-3 rounded-xl transition hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                                            Start Quick Quiz
                                        </button>
                                    </div>
                                ) : (
                                    <AnimatePresence mode="wait">
                                        {!quizAnswered ? (
                                            <motion.div key="q1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                                <p className="font-semibold text-lg mb-6">Which of these is a key selling point for Japanese luxury outbound packages?</p>
                                                <div className="space-y-3">
                                                    {["Cheap street food availability", "Exclusive bullet train access passes", "Traditional Ryokan stays with Kaiseki dining", "Unlimited theme park entries"].map((opt, i) => (
                                                        <motion.button
                                                            key={i}
                                                            whileHover={{ scale: 1.02, x: 5 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            onClick={() => setQuizAnswered(true)}
                                                            className="w-full text-left p-4 rounded-xl border border-emerald-800 bg-emerald-900/50 hover:bg-emerald-800 hover:border-emerald-500 transition font-medium"
                                                        >
                                                            {opt}
                                                        </motion.button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div key="a1" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                                                <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.6)]">
                                                    <CheckCircle className="w-10 h-10 text-emerald-950" />
                                                </div>
                                                <h4 className="text-2xl font-black text-white mb-2">Excellent!</h4>
                                                <p className="text-emerald-200">You correctly identified the key selling point. Module completed.</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                )}
                            </motion.div>
                        </div>

                        {/* Sidebar Modules */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-xl text-slate-800">Course Modules</h3>
                            {selectedCourse.modules.map((mod: any, i: number) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`p-4 rounded-2xl border-2 transition cursor-pointer flex gap-4 ${mod.active ? 'border-emerald-500 bg-white shadow-lg' : mod.completed ? 'border-slate-100 bg-slate-50' : 'border-slate-100 bg-white opacity-70'}`}
                                >
                                    <div className={`mt-1 shrink-0 ${mod.completed ? 'text-emerald-500' : mod.active ? 'text-emerald-600 animate-pulse' : 'text-slate-300'}`}>
                                        {mod.completed ? <CheckCircle className="w-6 h-6" /> : <PlayCircle className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <h4 className={`font-bold ${mod.active ? 'text-emerald-950' : 'text-slate-700'}`}>{mod.title}</h4>
                                        <p className="text-sm font-medium text-slate-400">{mod.duration} • {mod.completed ? 'Completed' : 'Pending'}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h2 className="text-3xl font-black text-emerald-950 mb-2">Manage Courses</h2>
                    <p className="text-slate-500 font-medium">Create, edit, and organize training modules.</p>
                </div>
                <Link href="/admin/courses/new" className="bg-emerald-600 text-white hover:bg-emerald-700 font-bold px-6 py-3 rounded-xl transition flex gap-2 items-center mt-4 md:mt-0 shadow-lg shadow-emerald-600/20 active:scale-95">
                    <Plus className="w-5 h-5" />
                    New Course
                </Link>
            </div>

            {isLoading ? (
                // Loading Skeletons with sweeping animation
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((_, i) => (
                        <div key={i} className="bg-white border text-transparent border-slate-100 rounded-3xl overflow-hidden shadow-sm animate-pulse">
                            <div className="h-48 bg-slate-200"></div>
                            <div className="p-6 space-y-4">
                                <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                                <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                                <div className="h-4 bg-slate-200 rounded w-full"></div>
                                <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {DEMO_COURSES.map((course) => (
                        <motion.div
                            key={course.id}
                            variants={itemVariants}
                            whileHover={{ y: -8, scale: 1.01 }}
                            onClick={() => setSelectedCourse(course)}
                            className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-emerald-900/10 transition duration-300 group cursor-pointer flex flex-col h-full"
                        >
                            <div className="h-48 relative overflow-hidden bg-emerald-50">
                                <motion.img
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.6 }}
                                    src={course.img}
                                    alt="course"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                                    <div className="bg-emerald-500 text-white font-bold px-6 py-3 rounded-full flex gap-2 items-center transform translate-y-4 group-hover:translate-y-0 transition">
                                        <PlayCircle className="w-5 h-5" /> Preview Course
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur shadow-sm text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                                    Published
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="text-xs font-bold text-emerald-600 tracking-wider uppercase mb-2">{course.tag}</div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">{course.title}</h3>
                                <p className="text-slate-500 text-sm mb-6 line-clamp-2 flex-1">{course.desc}</p>

                                <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-sm font-semibold text-slate-500">
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center gap-1.5 hover:text-emerald-600 transition"><Video className="w-4 h-4" /> {course.modules.length > 0 ? '3 Videos' : '1 Video'}</span>
                                        <span className="flex items-center gap-1.5 hover:text-emerald-600 transition"><Book className="w-4 h-4" /> 1 Quiz</span>
                                    </div>
                                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            onClick={() => setDropdownOpenId(dropdownOpenId === course.id ? null : course.id)}
                                            className="p-2 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition"
                                            title="Options"
                                        >
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                        <AnimatePresence>
                                            {dropdownOpenId === course.id && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    className="absolute right-0 bottom-full mb-2 bg-white rounded-xl shadow-xl border border-slate-100 p-2 w-32 z-10 flex flex-col gap-1"
                                                >
                                                    <button className="text-left px-3 py-2 hover:bg-slate-50 rounded-lg text-sm font-semibold text-emerald-700">Edit</button>
                                                    <button className="text-left px-3 py-2 hover:bg-slate-50 rounded-lg text-sm font-semibold text-amber-600">Draft</button>
                                                    <button className="text-left px-3 py-2 hover:bg-slate-50 rounded-lg text-sm font-semibold text-red-600">Delete</button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}
