"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, BookOpen, Target, Activity } from "lucide-react";

export default function AnalyticsPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h2 className="text-3xl font-black text-emerald-950 mb-2">Corporate Analytics</h2>
                    <p className="text-slate-500 font-medium">Enterprise dashboard for team performance and course completion rates.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-100 relative overflow-hidden group hover:border-emerald-500 transition duration-300">
                    <TrendingUp className="w-8 h-8 text-emerald-500 mb-4 group-hover:scale-110 transition" />
                    <h4 className="text-slate-500 font-bold mb-1">Completion Rate</h4>
                    <p className="text-3xl font-black text-slate-800">84.2%</p>
                    <div className="absolute right-0 bottom-0 top-0 w-32 bg-gradient-to-l from-emerald-50 to-transparent" />
                </div>
                <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-100 relative overflow-hidden group hover:border-emerald-500 transition duration-300">
                    <Target className="w-8 h-8 text-emerald-500 mb-4 group-hover:scale-110 transition" />
                    <h4 className="text-slate-500 font-bold mb-1">Avg Quiz Score</h4>
                    <p className="text-3xl font-black text-slate-800">92.0%</p>
                </div>
                <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-100 relative overflow-hidden group hover:border-emerald-500 transition duration-300">
                    <Users className="w-8 h-8 text-emerald-500 mb-4 group-hover:scale-110 transition" />
                    <h4 className="text-slate-500 font-bold mb-1">Active Trainees</h4>
                    <p className="text-3xl font-black text-slate-800">145</p>
                </div>
                <div className="bg-emerald-950 p-6 rounded-[1.5rem] shadow-xl text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full blur-[60px] opacity-20" />
                    <Activity className="w-8 h-8 text-emerald-400 mb-4 group-hover:scale-110 transition" />
                    <h4 className="text-emerald-100 font-bold mb-1">Total Hours Learnt</h4>
                    <p className="text-3xl font-black text-white relative z-10">1,024h</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-[1.5rem] shadow-sm border border-slate-100">
                    <h3 className="text-xl font-bold mb-6 text-slate-800">Team Progression (Last 30 Days)</h3>
                    <div className="h-64 flex items-end justify-between gap-2 px-4 border-b-2 border-slate-100 pb-2 relative">
                        {[40, 60, 45, 80, 50, 95, 75, 85, 60, 100].map((h, i) => (
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ duration: 1, delay: i * 0.05 }}
                                key={i}
                                className="w-full bg-emerald-100 hover:bg-emerald-400 rounded-t-md relative group cursor-pointer transition-colors"
                            >
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10 pointer-events-none">
                                    {h}% Growth
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="flex justify-between text-xs font-bold text-slate-400 mt-4 uppercase">
                        <span>Week 1</span>
                        <span>Week 2</span>
                        <span>Week 3</span>
                        <span>Week 4</span>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[1.5rem] shadow-sm border border-slate-100">
                    <h3 className="text-xl font-bold mb-6 text-slate-800 tracking-tight">Top Courses</h3>
                    <div className="space-y-6">
                        {[
                            { n: "European Destinations", p: 98 },
                            { n: "Southeast Asia Intro", p: 75 },
                            { n: "Corporate Etiquette", p: 60 },
                            { n: "Sales Closing Tactics", p: 88 }
                        ].map((c, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-sm font-semibold mb-2">
                                    <span className="text-slate-700">{c.n}</span>
                                    <span className="text-emerald-600">{c.p}%</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${c.p}%` }}
                                        transition={{ duration: 1 }}
                                        className="bg-emerald-500 h-full rounded-full"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
