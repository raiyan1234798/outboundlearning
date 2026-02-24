"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Check, X, Search, Filter } from "lucide-react";
import { motion } from "framer-motion";

export default function AccessRequestsPage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const q = query(collection(db, "access_requests"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setRequests(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        try {
            await updateDoc(doc(db, "access_requests", id), {
                status: newStatus
            });
            // Future logic: Send email to user, create official User record, etc.
        } catch (err) {
            console.error("Error updating request: ", err);
        }
    };

    const filteredRequests = requests.filter(req =>
        req.name.toLowerCase().includes(search.toLowerCase()) ||
        req.email.toLowerCase().includes(search.toLowerCase()) ||
        req.department.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Access Requests</h2>
                    <p className="text-slate-500 text-sm mt-1">Review and manage corporate access applications.</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            placeholder="Search name, email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 outline-none py-2 pl-9 pr-4 rounded-xl text-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
                        />
                    </div>
                    <button className="p-2 border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 transition flex items-center justify-center">
                        <Filter className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64 animate-pulse">
                    <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="overflow-x-auto custom-scrollbar pb-4">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-slate-100">
                                <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Applicant</th>
                                <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Details</th>
                                <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Requested Role</th>
                                <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/50">
                            {filteredRequests.map((req, i) => (
                                <motion.tr
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    key={req.id}
                                    className="hover:bg-slate-50/50 transition duration-150 group"
                                >
                                    <td className="px-4 py-4">
                                        <div className="font-semibold text-slate-800">{req.name}</div>
                                        <div className="text-slate-500 text-sm mt-0.5">{req.email}</div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="text-sm font-medium text-slate-700">{req.department}</div>
                                        <div className="text-xs text-slate-500 mt-0.5">{req.region} • {req.phone}</div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold">
                                            {req.roleApp}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${req.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                            req.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        {req.status === 'pending' ? (
                                            <div className="flex items-center justify-end gap-2 transition-opacity duration-200">
                                                <button
                                                    onClick={() => handleUpdateStatus(req.id, "approved")}
                                                    className="p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg transition" title="Approve"
                                                >
                                                    <Check className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(req.id, "rejected")}
                                                    className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition" title="Reject"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-slate-400 font-medium">Reviewed</span>
                                        )}
                                    </td>
                                </motion.tr>
                            ))}
                            {filteredRequests.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-12 text-slate-500 text-sm font-medium">
                                        No access requests found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
