'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    User,
    updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { UserProfile } from '@/lib/types';

// Demo users for preview mode
const DEMO_USERS: Record<string, UserProfile> = {
    'admin@outbound.com': {
        uid: 'user-admin', email: 'admin@outbound.com', displayName: 'Admin User',
        role: 'admin', isActive: true, createdAt: '2025-01-01',
    },
    'priya@outbound.com': {
        uid: 'user-mgr-1', email: 'priya@outbound.com', displayName: 'Priya Sharma',
        role: 'manager', teamId: 'team-south', teamName: 'South India Team',
        isActive: true, createdAt: '2025-01-02',
    },
    'anu@outbound.com': {
        uid: 'user-exec-1', email: 'anu@outbound.com', displayName: 'Anu Krishnan',
        role: 'executive', teamId: 'team-south', teamName: 'South India Team',
        isActive: true, createdAt: '2025-01-05',
    },
};

interface AuthContextType {
    user: User | null;
    userProfile: UserProfile | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    isAdmin: boolean;
    isManager: boolean;
    isExecutive: boolean;
    isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

const isDemoConfig = () => {
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    return !apiKey || apiKey === 'demo-api-key';
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [demoMode] = useState(isDemoConfig());

    useEffect(() => {
        if (demoMode) {
            // In demo mode, check localStorage for stored demo user
            const storedEmail = typeof window !== 'undefined' ? localStorage.getItem('demo_user_email') : null;
            if (storedEmail && DEMO_USERS[storedEmail]) {
                const profile = DEMO_USERS[storedEmail];
                setUser({ uid: profile.uid, email: profile.email, displayName: profile.displayName } as User);
                setUserProfile(profile);
            }
            setLoading(false);
            return;
        }

        if (!auth) {
            console.warn('Firebase Auth is not initialized. Check your environment variables.');
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                const profile = await fetchOrCreateProfile(firebaseUser);
                setUserProfile(profile);
            } else {
                setUser(null);
                setUserProfile(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchOrCreateProfile = async (firebaseUser: User): Promise<UserProfile> => {
        try {
            const docRef = doc(db, 'users', firebaseUser.uid);
            const docSnap = await getDoc(docRef);

            const isAdminEmail = firebaseUser.email === 'abubackerraiyan@gmail.com';

            if (docSnap.exists()) {
                const profileData = docSnap.data() as UserProfile;
                if (isAdminEmail && profileData.role !== 'admin') {
                    await updateDoc(docRef, { lastLogin: new Date().toISOString(), role: 'admin' });
                    return { ...profileData, role: 'admin', lastLogin: new Date().toISOString() };
                }

                await updateDoc(docRef, { lastLogin: new Date().toISOString() });
                return profileData;
            }

            const newProfile: UserProfile = {
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                displayName: firebaseUser.displayName || 'User',
                photoURL: firebaseUser.photoURL || '',
                role: isAdminEmail ? 'admin' : 'executive',
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                isActive: true,
                isApproved: isAdminEmail ? true : false,
            };

            await setDoc(docRef, newProfile);
            return newProfile;
        } catch {
            const isAdminEmail = firebaseUser.email === 'abubackerraiyan@gmail.com';
            // Fallback if Firestore fails
            return {
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                displayName: firebaseUser.displayName || 'User',
                role: isAdminEmail ? 'admin' : 'executive',
                createdAt: new Date().toISOString(),
                isActive: true,
                isApproved: isAdminEmail ? true : false,
            };
        }
    };

    const login = async (email: string, password: string) => {
        if (demoMode) {
            // Demo mode: accept any email that matches demo users, or default to admin
            const demoProfile = DEMO_USERS[email] || DEMO_USERS['admin@outbound.com'];
            setUser({ uid: demoProfile.uid, email: demoProfile.email, displayName: demoProfile.displayName } as User);
            setUserProfile(demoProfile);
            localStorage.setItem('demo_user_email', demoProfile.email);
            return;
        }
        await signInWithEmailAndPassword(auth, email, password);
    };

    const register = async (email: string, password: string, name: string) => {
        if (demoMode) {
            const profile: UserProfile = {
                uid: 'user-new', email, displayName: name,
                role: 'executive', createdAt: new Date().toISOString(), isActive: true,
            };
            setUser({ uid: profile.uid, email, displayName: name } as User);
            setUserProfile(profile);
            localStorage.setItem('demo_user_email', email);
            return;
        }
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: name });
    };

    const loginWithGoogle = async () => {
        if (demoMode) {
            // In demo mode, google login goes to admin
            const demoProfile = DEMO_USERS['admin@outbound.com'];
            setUser({ uid: demoProfile.uid, email: demoProfile.email, displayName: demoProfile.displayName } as User);
            setUserProfile(demoProfile);
            localStorage.setItem('demo_user_email', demoProfile.email);
            return;
        }
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    };

    const logout = async () => {
        if (demoMode) {
            setUser(null);
            setUserProfile(null);
            localStorage.removeItem('demo_user_email');
            return;
        }
        await signOut(auth);
    };

    const value: AuthContextType = {
        user,
        userProfile,
        loading,
        login,
        register,
        loginWithGoogle,
        logout,
        isAdmin: userProfile?.role === 'admin',
        isManager: userProfile?.role === 'manager',
        isExecutive: userProfile?.role === 'executive',
        isDemoMode: demoMode,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
