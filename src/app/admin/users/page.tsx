"use client";

import { useState, useEffect } from "react";
import { collection, query, getDocs, updateDoc, doc, deleteDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, MoreVertical, Edit2, Trash2, Shield, UserX, UserCheck, BookOpen, X, ArrowLeft, ArrowRight, TrendingUp, Clock, Award, Activity } from "lucide-react";

export default function ManageUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterRole, setFilterRole] = useState("all");
    const [showAddUser, setShowAddUser] = useState(false);
    const [newUserEmail, setNewUserEmail] = useState("");
    const [newUserRole, setNewUserRole] = useState("student");
    const [editingUserId, setEditingUserId] = useState<string | null>(null);
    const [editRole, setEditRole] = useState("");

    const fetchUsers = async () => {
        const q = query(collection(db, "users"));
        const snapshot = await getDocs(q);
        setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDeleteUser = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            await deleteDoc(doc(db, "users", userId));
            setUsers(users.filter(u => u.id !== userId));
        } catch (err) {
            console.error(err);
        }
    };

    const handleSaveRole = async (userId: string) => {
        try {
            await updateDoc(doc(db, "users", userId), { role: editRole });
            setEditingUserId(null);
            fetchUsers();
        } catch (err) {
            console.error(err);
        }
    };

    // Kanban Course Modal Logic
    const [kanbanUserId, setKanbanUserId] = useState<string | null>(null);
    const [kanbanUserName, setKanbanUserName] = useState<string>("");

    // Mock courses for the kanban board (in reality, fetched via user access records and course list)
    const [userCourses, setUserCourses] = useState<any>({
        available: [
            { id: 'c3', title: 'Corporate Etiquette 101' },
            { id: 'c4', title: 'African Safari Specialist' }
        ],
        pending: [
            { id: 'c2', title: 'European River Cruises' }
        ],
        enrolled: [
            { id: 'c1', title: 'Mastering Asian Destinations' }
        ]
    });

    const moveCourse = (courseId: string, from: 'available' | 'pending' | 'enrolled', to: 'available' | 'pending' | 'enrolled') => {
        const course = userCourses[from].find((c: any) => c.id === courseId);
        if (!course) return;

        setUserCourses((prev: any) => ({
            ...prev,
            [from]: prev[from].filter((c: any) => c.id !== courseId),
            [to]: [...prev[to], course]
        }));
    };

    const handleOpenKanban = (user: any) => {
        setKanbanUserId(user.id);
        setKanbanUserName(user.displayName || user.email);
    };

    // Analytics Modal Logic
    const [analyticsUser, setAnalyticsUser] = useState<any | null>(null);

    const handleAddUser = async () => {
        if (!newUserEmail.trim()) return;
        try {
            // Using email as the doc ID handles manual pre-approvals well as per login logic
            await setDoc(doc(db, "users", newUserEmail.trim()), {
                email: newUserEmail.trim(),
                role: newUserRole,
                createdAt: new Date(),
                displayName: "Pre-approved User"
            }, { merge: true });

            setShowAddUser(false);
            setNewUserEmail("");
            setNewUserRole("student");
            fetchUsers();
        } catch (err) {
            console.error(err);
        }
    };

    const filteredUsers = users.filter(u =>
        (u.displayName?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())) &&
        (filterRole === "all" || u.role === filterRole)
    );

    return (
        <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Manage Users</h2>
                    <p className="text-slate-500 text-sm mt-1">Full lifecycle management for corporate users.</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
                    <button
                        onClick={() => setShowAddUser(!showAddUser)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2 shadow-sm"
                    >
                        {showAddUser ? "Cancel" : "+ Add New User"}
                    </button>
                    <div className="relative flex-1 md:w-64">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 outline-none py-2 pl-9 pr-4 rounded-xl text-sm focus:border-emerald-500 transition"
                        />
                    </div>
                    <select
                        title="Filter by Role"
                        className="bg-slate-50 border border-slate-200 py-2 px-4 rounded-xl text-sm outline-none focus:border-emerald-500"
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                    >
                        <option value="all">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="trainer">Trainer</option>
                        <option value="manager">Manager</option>
                        <option value="executive">Sales Executive</option>
                    </select>
                </div>
            </div>

            {showAddUser && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mb-8 p-6 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex flex-col md:flex-row gap-4 items-end"
                >
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-bold text-emerald-950 mb-1">User Email Address</label>
                        <input
                            type="email"
                            placeholder="name@company.com"
                            value={newUserEmail}
                            onChange={(e) => setNewUserEmail(e.target.value)}
                            className="w-full bg-white border border-emerald-200 outline-none py-2 px-4 rounded-xl focus:border-emerald-500 transition"
                        />
                    </div>
                    <div className="w-full md:w-64">
                        <label className="block text-sm font-bold text-emerald-950 mb-1">Assign Role</label>
                        <select
                            title="Assign Role"
                            value={newUserRole}
                            onChange={(e) => setNewUserRole(e.target.value)}
                            className="w-full bg-white border border-emerald-200 outline-none py-2 px-4 rounded-xl focus:border-emerald-500 transition"
                        >
                            <option value="student">Student</option>
                            <option value="executive">Sales Executive</option>
                            <option value="manager">Manager</option>
                            <option value="trainer">Trainer</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button
                        onClick={handleAddUser}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-bold transition shadow-md w-full md:w-auto"
                    >
                        Confirm Addition
                    </button>
                </motion.div>
            )}

            {loading ? (
                <div className="flex justify-center h-40 items-center animate-pulse text-emerald-500">Loading...</div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-100">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase">User</th>
                                <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase">Role</th>
                                <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase">Joined</th>
                                <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/50">
                            {filteredUsers.map((user, i) => (
                                <motion.tr
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    key={user.id}
                                    className="hover:bg-slate-50/50 transition duration-150 group"
                                >
                                    <td className="px-4 py-4 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold overflow-hidden">
                                            {user.photoURL ? <img src={user.photoURL} alt="user" className="w-full h-full object-cover" /> : (user.displayName?.[0] || user.email?.[0] || 'U')}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-slate-800">{user.displayName || "Unknown User"}</div>
                                            <div className="text-slate-500 text-xs mt-0.5">{user.email}</div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        {editingUserId === user.id ? (
                                            <select
                                                title="Edit User Role"
                                                autoFocus
                                                value={editRole}
                                                onChange={(e) => setEditRole(e.target.value)}
                                                className="bg-white border border-emerald-400 py-1 px-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="student">Student</option>
                                                <option value="executive">Sales Executive</option>
                                                <option value="manager">Manager</option>
                                                <option value="trainer">Trainer</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        ) : (
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                                user.role === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-emerald-100 text-emerald-700'
                                                }`}>
                                                {user.role || "student"}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-4 text-sm text-slate-600">
                                        {user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {editingUserId === user.id ? (
                                                <>
                                                    <button onClick={() => handleSaveRole(user.id)} title="Save Role" className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition font-bold text-xs flex items-center gap-1">
                                                        <UserCheck className="w-4 h-4" /> Save
                                                    </button>
                                                    <button onClick={() => setEditingUserId(null)} title="Cancel Edit" className="p-2 text-slate-500 hover:bg-slate-200 rounded-lg transition font-bold text-xs">
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        title="View Analytics"
                                                        onClick={() => setAnalyticsUser(user)}
                                                        className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                                                    >
                                                        <TrendingUp className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        title="Manage Courses"
                                                        onClick={() => handleOpenKanban(user)}
                                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                    >
                                                        <BookOpen className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        title="Edit User"
                                                        onClick={() => {
                                                            setEditingUserId(user.id);
                                                            setEditRole(user.role || 'student');
                                                        }}
                                                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        title="Delete User"
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {/* Kanban Modal for Course Assignment */}
            <AnimatePresence>
                {kanbanUserId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-emerald-950/40 backdrop-blur-sm flex items-center justify-center p-4 lg:p-8"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-3xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-800">Course Assignments</h3>
                                    <p className="text-slate-500 font-medium tracking-tight">Managing access for <span className="text-emerald-700 font-bold">{kanbanUserName}</span></p>
                                </div>
                                <button onClick={() => setKanbanUserId(null)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-x-auto p-6 bg-slate-100/50 flex gap-6">
                                {/* Column 1: Available */}
                                <div className="flex-1 min-w-[300px] bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden leading-snug">
                                    <div className="p-4 border-b border-slate-100 bg-slate-50 font-bold text-slate-600 tracking-tight text-sm uppercase flex justify-between">
                                        Available Courses <span className="bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full text-xs">{userCourses.available.length}</span>
                                    </div>
                                    <div className="p-4 flex-1 space-y-3 overflow-y-auto">
                                        {userCourses.available.map((course: any) => (
                                            <div key={course.id} className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center justify-between group hover:border-emerald-200 transition">
                                                <span className="font-bold text-slate-700 text-sm">{course.title}</span>
                                                <button onClick={() => moveCourse(course.id, 'available', 'pending')} className="opacity-0 group-hover:opacity-100 p-1.5 text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition">
                                                    <ArrowRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Column 2: Pending Requests */}
                                <div className="flex-1 min-w-[300px] bg-white rounded-2xl border border-amber-200/50 shadow-sm flex flex-col overflow-hidden leading-snug">
                                    <div className="p-4 border-b border-amber-100 bg-amber-50 font-bold text-amber-700 tracking-tight text-sm uppercase flex justify-between">
                                        Pending Admin Approval <span className="bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full text-xs">{userCourses.pending.length}</span>
                                    </div>
                                    <div className="p-4 flex-1 space-y-3 overflow-y-auto bg-amber-50/10">
                                        {userCourses.pending.map((course: any) => (
                                            <div key={course.id} className="bg-white border border-amber-200 shadow-sm p-4 rounded-xl flex flex-col gap-3 group transition">
                                                <span className="font-bold text-slate-700 text-sm">{course.title}</span>
                                                <div className="flex gap-2">
                                                    <button onClick={() => moveCourse(course.id, 'pending', 'available')} className="flex-1 p-1.5 text-xs font-bold text-slate-500 bg-slate-100 rounded-lg hover:bg-slate-200 transition flex justify-center items-center gap-1">
                                                        <ArrowLeft className="w-3 h-3" /> Reject
                                                    </button>
                                                    <button onClick={() => moveCourse(course.id, 'pending', 'enrolled')} className="flex-1 p-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 rounded-lg hover:bg-emerald-200 transition flex justify-center items-center gap-1">
                                                        Approve <ArrowRight className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Column 3: Enrolled */}
                                <div className="flex-1 min-w-[300px] bg-white rounded-2xl border border-emerald-200 shadow-sm flex flex-col overflow-hidden leading-snug">
                                    <div className="p-4 border-b border-emerald-100 bg-emerald-50 font-bold text-emerald-700 tracking-tight text-sm uppercase flex justify-between">
                                        Enrolled & Valid <span className="bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full text-xs">{userCourses.enrolled.length}</span>
                                    </div>
                                    <div className="p-4 flex-1 space-y-3 overflow-y-auto bg-emerald-50/30">
                                        {userCourses.enrolled.map((course: any) => (
                                            <div key={course.id} className="bg-white border-2 border-emerald-100 p-4 rounded-xl flex items-center justify-between group hover:border-red-200 transition">
                                                <span className="font-bold text-emerald-950 text-sm">{course.title}</span>
                                                <button onClick={() => moveCourse(course.id, 'enrolled', 'available')} className="opacity-0 group-hover:opacity-100 p-1.5 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition text-xs font-bold px-3">
                                                    Revoke Let
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Analytics Modal */}
            <AnimatePresence>
                {analyticsUser && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 lg:p-8"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-slate-100 flex justify-between items-start bg-slate-50 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-400 rounded-full blur-[80px] opacity-20 -translate-y-1/2 translate-x-1/3" />
                                <div className="relative z-10 flex gap-6 items-center">
                                    <div className="w-20 h-20 rounded-[1rem] bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold overflow-hidden shadow-inner border border-indigo-200/50">
                                        {analyticsUser.photoURL ? <img src={analyticsUser.photoURL} alt="user" className="w-full h-full object-cover" /> : <span className="text-3xl">{(analyticsUser.displayName?.[0] || analyticsUser.email?.[0] || 'U')}</span>}
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-black text-slate-800">{analyticsUser.displayName || "Unknown User"}</h3>
                                        <p className="text-slate-500 font-medium tracking-tight mt-1">{analyticsUser.email} • {analyticsUser.role || 'Student'}</p>
                                    </div>
                                </div>
                                <button onClick={() => setAnalyticsUser(null)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition relative z-10">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50/50">
                                <h4 className="font-bold text-slate-800 mb-6 text-lg">Performance Analytics</h4>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                    {[
                                        { label: "Enrolled Courses", value: "3", icon: BookOpen, color: "text-blue-600", bg: "bg-blue-100", border: "border-blue-200" },
                                        { label: "Completed", value: "1", icon: Award, color: "text-emerald-600", bg: "bg-emerald-100", border: "border-emerald-200" },
                                        { label: "Avg Score", value: "88%", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-100", border: "border-purple-200" },
                                        { label: "Learning Hrs", value: "14h", icon: Clock, color: "text-amber-600", bg: "bg-amber-100", border: "border-amber-200" }
                                    ].map((stat, i) => (
                                        <div key={i} className={`bg-white rounded-2xl p-5 border shadow-sm ${stat.border} hover:-translate-y-1 transition duration-300`}>
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${stat.bg}`}>
                                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                            </div>
                                            <div className="text-3xl font-black text-slate-800 mb-1">{stat.value}</div>
                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid lg:grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-indigo-500" /> Recent Activity Log</h4>
                                        <div className="space-y-4">
                                            {[
                                                { title: "Completed Module: Closing Techniques", time: "2 hours ago", type: "completion" },
                                                { title: "Passed Quiz: Europe Geography (92%)", time: "Yesterday", type: "assessment" },
                                                { title: "Started Course: Mastering Asian Destinations", time: "3 days ago", type: "start" },
                                                { title: "Logged In", time: "5 days ago", type: "system" }
                                            ].map((log, i) => (
                                                <div key={i} className="flex gap-4">
                                                    <div className="flex flex-col items-center">
                                                        <div className={`w-3 h-3 rounded-full mt-1.5 ${log.type === 'completion' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : log.type === 'assessment' ? 'bg-purple-500' : log.type === 'start' ? 'bg-blue-500' : 'bg-slate-300'}`} />
                                                        {i !== 3 && <div className="w-0.5 h-full bg-slate-200 mt-2" />}
                                                    </div>
                                                    <div className="bg-white p-4 border border-slate-100 shadow-sm rounded-xl flex-1 mb-2">
                                                        <p className="font-semibold text-sm text-slate-700">{log.title}</p>
                                                        <p className="text-xs text-slate-400 font-medium mt-1">{log.time}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 mb-4">Course Progression</h4>
                                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                                            {[
                                                { title: "Mastering Asian Destinations", progress: 65, color: "bg-blue-500" },
                                                { title: "Corporate Etiquette 101", progress: 100, color: "bg-emerald-500" },
                                                { title: "Advanced Sales Dynamics", progress: 15, color: "bg-amber-500" }
                                            ].map((c, i) => (
                                                <div key={i}>
                                                    <div className="flex justify-between text-sm font-bold text-slate-600 mb-2">
                                                        <span className="truncate pr-4">{c.title}</span>
                                                        <span>{c.progress}%</span>
                                                    </div>
                                                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                                        <div className={`${c.color} h-full rounded-full transition-all duration-1000`} style={{ width: `${c.progress}%` }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
