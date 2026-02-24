"use client";

import { useState } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError("");

        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Check if user exists in the Firestore database
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                // Check if admin pre-added this user by their email address
                const preApprovedRef = doc(db, "users", user.email || "");
                const preApprovedSnap = await getDoc(preApprovedRef);
                let newRole = "pending";

                if (preApprovedSnap.exists()) {
                    newRole = preApprovedSnap.data().role;
                }

                // Hardcode specific admin email for setup
                if (user.email === "abubackerraiyan@gmail.com") {
                    newRole = "admin";
                }

                await setDoc(userRef, {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    role: newRole,
                    createdAt: new Date()
                });

                if (newRole === "pending") {
                    router.push("/pending-approval");
                } else if (newRole === "admin") {
                    router.push("/admin");
                } else {
                    router.push("/dashboard");
                }
            } else {
                const userData = userSnap.data();

                // Allow our specific email to instantly upgrade to admin without manual DB change
                if (user.email === "abubackerraiyan@gmail.com" && userData.role !== "admin") {
                    await setDoc(userRef, { role: "admin" }, { merge: true });
                    userData.role = "admin";
                }

                if (userData.role === "pending") {
                    router.push("/pending-approval");
                } else if (userData.role === "admin") {
                    router.push("/admin");
                } else {
                    router.push("/dashboard");
                }
            }

        } catch (err: any) {
            console.error(err);
            setError("Failed to login with Google.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
            <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-emerald-700 font-medium">
                <ArrowLeft className="w-5 h-5" />
                Back to Home
            </Link>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-white p-10 rounded-[2rem] shadow-2xl shadow-emerald-900/10 border border-slate-100"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg viewBox="0 0 24 24" className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-emerald-950 mb-2">Corporate Login</h1>
                    <p className="text-slate-500 text-sm">Secure access for approved professionals</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium flex gap-2 items-center">
                        <AlertCircle className="w-5 h-5" />
                        {error}
                    </div>
                )}

                <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 text-slate-700 font-semibold p-4 rounded-xl hover:bg-slate-50 focus:ring-4 focus:ring-emerald-500/10 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                    {loading ? "Authenticating..." : (
                        <>
                            <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Continue with Google
                        </>
                    )}
                </button>

                <p className="text-center text-sm text-slate-500 mt-8 font-medium">
                    Don't have an account? <Link href="/request-access" className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline">Request Access</Link>
                </p>
            </motion.div>
        </div>
    );
}
