"use client";

import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, ChevronDown, MoveRight, Plane } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function RequestAccessPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        department: "Sales",
        region: "North America",
        roleApp: "Sales Executive"
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await addDoc(collection(db, "access_requests"), {
                ...formData,
                status: "pending",
                createdAt: serverTimestamp()
            });
            setSuccess(true);
        } catch (err) {
            console.error("Error submitting Request: ", err);
            alert("Something went wrong. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="min-h-screen bg-emerald-50 text-slate-900 flex flex-col tablet:flex-row antialiased relative overflow-hidden">
            {/* Background Decor */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-300 rounded-full mix-blend-multiply blur-[100px] opacity-20" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500 rounded-full mix-blend-multiply blur-[100px] opacity-10" />
            </div>

            <div className="w-full max-w-7xl mx-auto flex lg:flex-row flex-col min-h-screen p-6">
                {/* Left Side branding */}
                <div className="lg:w-1/2 flex flex-col justify-center p-8 lg:p-16">
                    <Link href="/" className="flex items-center gap-2 mb-12 hover:opacity-70 transition w-fit">
                        <ArrowLeft className="w-5 h-5 text-emerald-800" />
                        <span className="font-semibold text-emerald-900">Back to Site</span>
                    </Link>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-emerald-600 p-3 rounded-2xl">
                            <Plane className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-emerald-950">Outbound Learning</h1>
                    </div>

                    <h2 className="text-5xl lg:text-7xl font-black mb-6 leading-[1.1] text-slate-800">
                        Corporate <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-400">Access Request</span>
                    </h2>
                    <p className="text-lg text-slate-600 max-w-md font-medium leading-relaxed">
                        Gain exclusive access to premier corporate travel training. Fill out the application and your administrator will review your request.
                    </p>

                    <div className="mt-16 flex items-center gap-4 border-l-4 border-emerald-500 pl-6 opacity-70">
                        <div>
                            <p className="text-sm font-bold text-slate-800 uppercase tracking-widest">Support</p>
                            <p className="text-slate-600 mt-1">contact@outbound-training.com</p>
                        </div>
                    </div>
                </div>

                {/* Right Side form */}
                <div className="lg:w-1/2 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white p-8 md:p-10 rounded-3xl shadow-2xl shadow-emerald-900/10"
                    >
                        {success ? (
                            <div className="text-center py-10 flex flex-col items-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", bounce: 0.5 }}
                                    className="bg-emerald-100 text-emerald-600 p-4 rounded-full mb-6"
                                >
                                    <CheckCircle2 className="w-12 h-12" />
                                </motion.div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Request Submitted</h3>
                                <p className="text-slate-600 mb-8 max-w-[280px]">Your application is under review. You will receive an email upon approval.</p>
                                <Link href="/" className="w-full bg-slate-900 text-white p-4 rounded-xl font-bold flex focus:ring-4 focus:ring-slate-900/20 active:scale-[0.98] transition items-center justify-center gap-2">
                                    Return Home
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                                        <input
                                            required name="name"
                                            onChange={handleInputChange} value={formData.name}
                                            placeholder="Jane Doe"
                                            className="w-full bg-slate-50 border border-slate-200 outline-none p-4 rounded-xl text-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Corporate Email</label>
                                        <input
                                            required name="email" type="email"
                                            onChange={handleInputChange} value={formData.email}
                                            placeholder="jane.doe@company.com"
                                            className="w-full bg-slate-50 border border-slate-200 outline-none p-4 rounded-xl text-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                                        <input
                                            required name="phone"
                                            onChange={handleInputChange} value={formData.phone}
                                            placeholder="+1 (555) 000-0000"
                                            className="w-full bg-slate-50 border border-slate-200 outline-none p-4 rounded-xl text-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="relative">
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Department</label>
                                            <select name="department" onChange={handleInputChange} value={formData.department} className="w-full bg-slate-50 border border-slate-200 outline-none px-4 py-[1.05rem] rounded-xl text-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition appearance-none cursor-pointer">
                                                <option value="Sales">Sales</option>
                                                <option value="Training">Training</option>
                                                <option value="Operations">Operations</option>
                                            </select>
                                            <ChevronDown className="absolute right-4 bottom-[1.1rem] w-5 h-5 text-slate-400 pointer-events-none" />
                                        </div>
                                        <div className="relative">
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Region</label>
                                            <select name="region" onChange={handleInputChange} value={formData.region} className="w-full bg-slate-50 border border-slate-200 outline-none px-4 py-[1.05rem] rounded-xl text-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition appearance-none cursor-pointer">
                                                <option value="North America">North America</option>
                                                <option value="Europe">Europe</option>
                                                <option value="Asia Pacific">Asia Pacific</option>
                                                <option value="MEA">MEA</option>
                                            </select>
                                            <ChevronDown className="absolute right-4 bottom-[1.1rem] w-5 h-5 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Requested Role</label>
                                        <select name="roleApp" onChange={handleInputChange} value={formData.roleApp} className="w-full bg-slate-50 border border-slate-200 outline-none px-4 py-[1.05rem] rounded-xl text-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition appearance-none cursor-pointer">
                                            <option value="Sales Executive">Sales Executive</option>
                                            <option value="Sales Manager">Sales Manager</option>
                                            <option value="Trainer">Trainer</option>
                                        </select>
                                        <ChevronDown className="absolute right-4 bottom-[1.1rem] w-5 h-5 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>

                                <button
                                    disabled={loading}
                                    type="submit"
                                    className="w-full bg-emerald-600 text-white p-4 rounded-xl font-bold flex hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-600/20 active:scale-[0.98] transition items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none mt-4 shadow-lg shadow-emerald-600/20"
                                >
                                    {loading ? "Submitting..." : (
                                        <>Submit Request <MoveRight className="w-5 h-5" /></>
                                    )}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
