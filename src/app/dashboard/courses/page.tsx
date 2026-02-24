"use client";

import { motion } from "framer-motion";
import { BookOpen, Search, Filter, PlayCircle, Star, ArrowRight } from "lucide-react";
import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const ALL_COURSES = [
    {
        id: "demo-1",
        title: "Mastering Asian Destinations",
        tag: "Sales Training",
        level: "Intermediate",
        desc: "Comprehensive guide to selling outbound packages to Japan, Vietnam, and Thailand.",
        img: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop",
        status: "enrolled"
    },
    {
        id: "demo-2",
        title: "European River Cruises",
        tag: "Product Knowledge",
        level: "Advanced",
        desc: "Deep dive into selling high-ticket European river cruises across the Danube and Rhine.",
        img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=600&auto=format&fit=crop",
        status: "available"
    },
    {
        id: "demo-3",
        title: "Corporate Etiquette 101",
        tag: "Soft Skills",
        level: "Beginner",
        desc: "Learn the fundamentals of B2B corporate sales and international client etiquette.",
        img: "https://images.unsplash.com/photo-1556761175-5973dc0f32d7?q=80&w=600&auto=format&fit=crop",
        status: "pending"
    },
    {
        id: "demo-4",
        title: "African Safari Specialist",
        tag: "Sales Training",
        level: "Expert",
        desc: "Become a certified expert in routing and selling high-end African safari tours.",
        img: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=600&auto=format&fit=crop",
        status: "available"
    }
];

export default function CourseCatalogPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [courses, setCourses] = useState(ALL_COURSES);

    const handleAction = async (courseId: string, currentStatus: string, courseTitle: string) => {
        if (currentStatus === "available") {
            setCourses(courses.map(c => c.id === courseId ? { ...c, status: 'pending' } : c));

            try {
                await addDoc(collection(db, "access_requests"), {
                    name: "Current Learner",
                    email: "learner@outbound.corp",
                    department: "Sales Training",
                    region: "Global",
                    phone: "+123456789",
                    roleApp: `Course: ${courseTitle}`,
                    status: "pending",
                    createdAt: serverTimestamp(),
                    type: "course_enrollment",
                    courseId: courseId
                });
                alert("Enrollment request sent to administration.");
            } catch (err) {
                console.error("Error pushing enroll request: ", err);
            }
        }
    };

    const filteredCourses = courses.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 mb-2">Course Catalog</h2>
                    <p className="text-slate-500 font-medium">Browse and request access to our entire corporate catalog.</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-72">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            placeholder="Find topics, sales guides..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-slate-200 outline-none py-2.5 pl-10 pr-4 rounded-xl text-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
                        />
                    </div>
                    <button className="p-2.5 bg-white border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 hover:text-emerald-600 transition">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCourses.map((course, i) => (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        key={course.id}
                        className="bg-white border flex flex-col border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 group"
                    >
                        <div className="h-44 relative overflow-hidden bg-slate-100">
                            <img src={course.img} alt="course" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur shadow-sm text-emerald-800 text-[10px] uppercase font-black px-2.5 py-1 rounded-full flex gap-1 items-center">
                                {course.level}
                            </div>
                        </div>
                        <div className="p-6 flex flex-col flex-1">
                            <div className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-2">{course.tag}</div>
                            <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2 leading-snug">{course.title}</h3>
                            <p className="text-slate-500 text-sm mb-6 line-clamp-3 flex-1">{course.desc}</p>

                            <div className="pt-4 border-t border-slate-100">
                                {course.status === "enrolled" ? (
                                    <button className="w-full py-2.5 bg-slate-100 text-slate-500 font-bold rounded-xl text-sm cursor-not-allowed">
                                        Already Enrolled
                                    </button>
                                ) : course.status === "pending" ? (
                                    <button className="w-full py-2.5 border-2 border-amber-200 bg-amber-50 text-amber-700 font-bold rounded-xl text-sm flex items-center justify-center gap-2 cursor-wait">
                                        Pending Admin Approval
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleAction(course.id, course.status, course.title)}
                                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-md active:scale-95"
                                    >
                                        Enroll Now <ArrowRight className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
