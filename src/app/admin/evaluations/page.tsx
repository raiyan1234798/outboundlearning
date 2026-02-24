"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Search, Clock } from "lucide-react";

export default function EvaluationsPage() {
    return (
        <div className="bg-white p-8 rounded-[1.5rem] shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Pending Evaluations</h2>
                    <p className="text-slate-500 text-sm mt-1">Review descriptive answers and assign passing marks.</p>
                </div>
                <div className="relative w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        placeholder="Search trainees..."
                        className="w-full bg-slate-50 border border-slate-200 outline-none py-2 pl-9 pr-4 rounded-xl text-sm focus:border-emerald-500 transition"
                    />
                </div>
            </div>

            <div className="space-y-4">
                {[1, 2, 3].map((_, i) => (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i}
                        className="p-6 border border-slate-200 rounded-2xl hover:border-emerald-500 transition duration-300 relative overflow-hidden group"
                    >
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-400" />
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">JD</div>
                                    <h3 className="font-bold text-slate-800">John Doe <span className="text-slate-500 font-normal text-sm ml-2">- Southeast Asia Final Submissions</span></h3>
                                </div>
                                <p className="text-sm font-medium text-amber-600 flex items-center gap-1"><Clock className="w-4 h-4" /> Submitted 2 hours ago</p>
                            </div>
                            <div className="flex gap-3">
                                <button className="px-5 py-2 bg-slate-100 text-slate-700 rounded-lg font-bold hover:bg-slate-200 transition text-sm">
                                    Review Answers
                                </button>
                                <button className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition" title="Approve">
                                    <CheckCircle2 className="w-5 h-5" />
                                </button>
                                <button className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition" title="Fail">
                                    <XCircle className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
