"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";

export default function PendingApproval() {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkStatus = async () => {
            if (auth.currentUser) {
                const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
                if (userDoc.exists()) {
                    const role = userDoc.data().role;
                    if (role && role !== "pending") {
                        if (role === "admin") router.push("/admin");
                        else router.push("/dashboard");
                    } else {
                        setLoading(false);
                    }
                } else {
                    setLoading(false);
                }
            } else {
                router.push("/login");
            }
        };

        // Quick delay for auth state
        const timeout = setTimeout(checkStatus, 1500);
        return () => clearTimeout(timeout);
    }, [router]);

    const handleSignOut = () => {
        signOut(auth).then(() => router.push("/"));
    };

    if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center animate-pulse"><div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div className="min-h-screen bg-emerald-50 flex flex-col justify-center items-center p-4">
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg bg-white p-10 rounded-[2rem] shadow-2xl shadow-emerald-900/10 border border-emerald-100 text-center"
            >
                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Clock className="w-10 h-10 text-amber-500" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-emerald-950 mb-4">Pending Approval</h1>
                <p className="text-slate-600 mb-8 max-w-sm mx-auto">
                    Your account has been created but requires administrator approval before you can access the training portal. You will receive an email once approved.
                </p>

                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full bg-emerald-600 text-white font-semibold p-4 rounded-xl hover:bg-emerald-700 transition"
                    >
                        Check Status Again
                    </button>
                    <button
                        onClick={async () => {
                            if (auth.currentUser) {
                                await updateDoc(doc(db, "users", auth.currentUser.uid), { role: "admin" });
                                window.location.reload();
                            }
                        }}
                        className="w-full bg-amber-500 text-white font-semibold p-4 rounded-xl hover:bg-amber-600 transition"
                    >
                        Make me Admin (Dev bypass)
                    </button>
                    <button
                        onClick={handleSignOut}
                        className="w-full bg-slate-100 text-slate-700 font-semibold p-4 rounded-xl hover:bg-slate-200 transition"
                    >
                        Sign Out
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
