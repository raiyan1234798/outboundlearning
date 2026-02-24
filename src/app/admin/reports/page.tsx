"use client";

import { motion } from "framer-motion";
import { DownloadCloud, Printer, FileText, Briefcase, FileClock, ChevronDown } from "lucide-react";
import * as XLSX from "xlsx";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useState } from "react";

export default function ReportsPage() {
    const [downloading, setDownloading] = useState("");

    const downloadExcel = async (type: "users" | "requests") => {
        setDownloading(type);
        try {
            const q = query(collection(db, type === "users" ? "users" : "access_requests"), orderBy("createdAt", "desc"));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Remove sensitive or irrelevant data
            const cleanedData = data.map((item: any) => {
                const result: any = { ...item };
                delete result.createdAt; // Firestore timestamp object causes issues in Excel
                return result;
            });

            const worksheet = XLSX.utils.json_to_sheet(cleanedData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
            XLSX.writeFile(workbook, `outbound_${type}_report.xlsx`);
        } catch (error) {
            console.error("Error creating Excel report", error);
        } finally {
            setDownloading("");
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 print:p-0 print:m-0 print:block">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h2 className="text-3xl font-black text-emerald-950 mb-2">Reports & Exports</h2>
                    <p className="text-slate-500 font-medium">Generate corporate-formatted data sheets and printable reports.</p>
                </div>
                <button onClick={handlePrint} className="print:hidden bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold px-5 py-3 rounded-xl transition flex gap-2 items-center border border-emerald-200 mt-4 md:mt-0 shadow-lg shadow-emerald-500/10 active:scale-95">
                    <Printer className="w-5 h-5" />
                    Print Current View
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print:hidden">
                {/* Export Card 1 */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-sm hover:border-emerald-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6 shadow-md shadow-emerald-500/10 group-hover:scale-110 transition">
                        <Briefcase className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Active Users Roster</h3>
                    <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                        Export a complete compilation of all approved travel professionals and their roles.
                    </p>
                    <button
                        disabled={downloading === "users"}
                        onClick={() => downloadExcel("users")}
                        className="w-full bg-slate-900 text-white font-semibold py-3 rounded-xl hover:bg-emerald-900 transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {downloading === "users" ? "Generating..." : <><DownloadCloud className="w-4 h-4" /> Download .XLSX</>}
                    </button>
                </motion.div>

                {/* Export Card 2 */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-sm hover:border-emerald-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6 shadow-md shadow-emerald-500/10 group-hover:scale-110 transition">
                        <FileClock className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Pending Access Apps</h3>
                    <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                        Extract detailed contact and role information of recently submitted corporate applications.
                    </p>
                    <button
                        disabled={downloading === "requests"}
                        onClick={() => downloadExcel("requests")}
                        className="w-full bg-slate-900 text-white font-semibold py-3 rounded-xl hover:bg-emerald-900 transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {downloading === "requests" ? "Generating..." : <><DownloadCloud className="w-4 h-4" /> Download .XLSX</>}
                    </button>
                </motion.div>

                {/* Export Card 3 */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-emerald-950 p-6 rounded-[1.5rem] shadow-xl text-white relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity" />
                    <div className="w-12 h-12 bg-white/10 border border-white/20 text-emerald-300 rounded-xl flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition backdrop-blur-md">
                        <FileText className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 relative z-10">Advanced Analytics</h3>
                    <p className="text-emerald-400 font-medium text-sm mb-6 leading-relaxed relative z-10">
                        Combine team progression, passing grades, and evaluation feedback.
                    </p>
                    <button
                        className="w-full bg-white text-emerald-950 font-bold py-3 rounded-xl hover:bg-emerald-50 transition relative z-10 shadow-lg shadow-white/10"
                    >
                        Custom Export Engine
                    </button>
                </motion.div>
            </div>

            {/* Printable Preview Section */}
            <div className="hidden print:block border-2 border-emerald-900 p-8 rounded-lg">
                <div className="border-b-4 border-emerald-950 pb-6 mb-6 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-black text-emerald-950">Outbound Training</h1>
                        <p className="text-slate-600 font-bold tracking-widest uppercase mt-2">Executive Summary Report</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold">Generated: {new Date().toLocaleDateString()}</p>
                        <p className="text-slate-500 text-sm mt-1">Classification: Internal Corporate Only</p>
                    </div>
                </div>

                <div className="prose max-w-none text-slate-800">
                    <h2>1. Platform Overview</h2>
                    <p>This report contains a summary of current training progress across regional and international travel destinations. Certification tracking remains up to date within the LMS module.</p>

                    <div className="grid grid-cols-2 gap-8 my-8">
                        <div className="border-t-2 border-slate-300 pt-4">
                            <h3 className="text-xl font-bold mb-2 text-emerald-900">Highest Engagement</h3>
                            <ul className="list-disc pl-5">
                                <li>European Destinations Advanced (+12%)</li>
                                <li>Premium Client Handling Certification</li>
                            </ul>
                        </div>
                        <div className="border-t-2 border-slate-300 pt-4">
                            <h3 className="text-xl font-bold mb-2 text-emerald-900">Review Required</h3>
                            <ul className="list-disc pl-5">
                                <li>32 Pending Access Requests</li>
                                <li>Southeast Asia Introductory (Low Pass Rate)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
