"use client";

import { motion } from "framer-motion";
import { Send, MessageSquare, AlertCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, setDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function UserSupportPage() {
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Hardcode user ID for demo purposes, in real app use auth.currentUser.uid
    const userId = "demo_user_123";

    useEffect(() => {
        const q = query(
            collection(db, `support_tickets/${userId}/messages`),
            orderBy("timestamp", "asc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                time: doc.data().timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }));

            // Add initial welcome message if empty
            if (msgs.length === 0) {
                setMessages([{ id: 'welcome', text: "Welcome to Outbound Learner Support! How can I help you today?", sender: "admin", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
            } else {
                setMessages(msgs);
            }
        });

        return () => unsubscribe();
    }, [userId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;
        const text = newMessage;
        setNewMessage("");

        try {
            await addDoc(collection(db, `support_tickets/${userId}/messages`), {
                text,
                sender: "user",
                timestamp: serverTimestamp()
            });
            // Update the master ticket document to register on admin dashboard
            await setDoc(doc(db, "support_tickets", userId), {
                userId,
                userName: "Demo Learner",
                lastMessage: text,
                updatedAt: serverTimestamp(),
                status: "open"
            }, { merge: true });
        } catch (e) {
            console.error("Error sending message:", e);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 flex flex-col h-[calc(100vh-140px)]">
            <div>
                <h2 className="text-3xl font-black text-slate-900 mb-2">Support Center</h2>
                <p className="text-slate-500 font-medium">Contact administration for access issues, technical support, or course queries.</p>
            </div>

            <div className="flex-1 bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col overflow-hidden">
                <div className="p-4 bg-emerald-50 border-b border-emerald-100 flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white">
                        <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-bold text-emerald-950">System Administration</h4>
                        <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Online
                        </span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 custom-scrollbar">
                    {messages.map((msg, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={msg.id || index}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[70%] p-4 rounded-2xl shadow-sm ${msg.sender === 'user' ? 'bg-emerald-600 text-white rounded-br-sm' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm'}`}>
                                <p className="text-sm font-medium">{msg.text}</p>
                                <span className={`text-[10px] mt-2 block font-bold ${msg.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'}`}>{msg.time}</span>
                            </div>
                        </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 bg-white border-t border-slate-200 flex gap-4">
                    <input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type your message to the admin..."
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
                    />
                    <button
                        onClick={handleSendMessage}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 rounded-xl font-bold transition shadow-md flex items-center gap-2"
                    >
                        <Send className="w-4 h-4" /> Send
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-2 justify-center text-xs font-bold text-slate-400">
                <AlertCircle className="w-4 h-4" /> Messages are monitored by the HR & Training department.
            </div>
        </div>
    );
}
