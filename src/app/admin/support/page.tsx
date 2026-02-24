"use client";

import { motion } from "framer-motion";
import { MessageCircle, Search, Clock, Reply, CheckCircle2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function SupportMessagesPage() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [replyText, setReplyText] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const q = query(collection(db, "support_tickets"), orderBy("updatedAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const t = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTickets(t);
            if (t.length > 0 && !activeTicketId) {
                setActiveTicketId(t[0].id);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!activeTicketId) return;
        const q = query(collection(db, `support_tickets/${activeTicketId}/messages`), orderBy("timestamp", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                time: doc.data().timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || ""
            }));
            setMessages(msgs);
        });
        return () => unsubscribe();
    }, [activeTicketId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleReply = async () => {
        if (!replyText.trim() || !activeTicketId) return;
        const text = replyText;
        setReplyText("");
        try {
            await addDoc(collection(db, `support_tickets/${activeTicketId}/messages`), {
                text,
                sender: "admin",
                timestamp: serverTimestamp()
            });
            await updateDoc(doc(db, "support_tickets", activeTicketId), {
                lastMessage: text,
                updatedAt: serverTimestamp(),
                status: "open"
            });
        } catch (e) {
            console.error(e);
        }
    };

    const handleMarkResolved = async () => {
        if (!activeTicketId) return;
        await updateDoc(doc(db, "support_tickets", activeTicketId), {
            status: "resolved",
            updatedAt: serverTimestamp()
        });
    };

    const activeTicket = tickets.find(t => t.id === activeTicketId);

    function formatTime(timestamp: any) {
        if (!timestamp) return "Just now";
        try {
            const date = timestamp.toDate();
            const diffInHours = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60));
            if (diffInHours < 1) return "Just now";
            if (diffInHours < 24) return `${diffInHours}h ago`;
            return `${Math.floor(diffInHours / 24)}d ago`;
        } catch (e) {
            return "";
        }
    }

    return (
        <div className="bg-white p-8 rounded-[1.5rem] shadow-sm border border-slate-100 flex flex-col h-[calc(100vh-160px)]">
            <div className="flex justify-between items-center mb-8 shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Support Messages</h2>
                    <p className="text-slate-500 text-sm mt-1">Internal helpdesk and user ticket resolution.</p>
                </div>
                <div className="relative w-64 hidden md:block">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        placeholder="Search tickets..."
                        className="w-full bg-slate-50 border border-slate-200 outline-none py-2 pl-9 pr-4 rounded-xl text-sm focus:border-emerald-500 transition"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-hidden grid lg:grid-cols-3 gap-8">
                {/* Tickets List */}
                <div className="lg:col-span-1 border-r border-slate-100 pr-6 overflow-y-auto custom-scrollbar space-y-4">
                    {tickets.length === 0 && <p className="text-slate-400 text-sm text-center py-8">No specific support tickets yet.</p>}
                    {tickets.map((ticket, i) => (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            key={ticket.id}
                            onClick={() => setActiveTicketId(ticket.id)}
                            className={`p-4 rounded-xl cursor-pointer transition flex flex-col gap-2 ${activeTicketId === ticket.id ? 'bg-emerald-50 border-emerald-200 text-emerald-950 border shadow-sm' : 'hover:bg-slate-50 border border-transparent'}`}
                        >
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-sm text-slate-800 line-clamp-1">{ticket.userName || ticket.id}</h4>
                                <span className="text-[10px] text-slate-400 shrink-0 flex items-center"><Clock className="w-3 h-3 inline mr-1" />{formatTime(ticket.updatedAt)}</span>
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-2">{ticket.lastMessage || 'New Conversation'}</p>
                            <div className="flex justify-between mt-2">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide ${ticket.status === 'resolved' ? 'bg-slate-100 text-slate-500' : 'bg-amber-100 text-amber-700'}`}>{ticket.status || 'open'}</span>
                                <span className="text-xs text-slate-400 font-medium">User: {ticket.id}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Ticket Conversation */}
                {activeTicketId ? (
                    <div className="lg:col-span-2 flex flex-col h-full bg-slate-50/50 rounded-2xl border border-slate-100 p-6 relative">
                        <div className="border-b border-slate-200 pb-4 mb-4 flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">{activeTicket?.userName || 'User Support Request'}</h3>
                                <p className="text-sm text-slate-500">From <strong>{activeTicket?.userId || activeTicketId}</strong></p>
                            </div>
                            {activeTicket?.status !== 'resolved' && (
                                <button onClick={handleMarkResolved} className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-200 transition">
                                    <CheckCircle2 className="w-4 h-4" /> Mark Resolved
                                </button>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6 pb-4 pr-2">
                            {messages.map((msg, idx) => (
                                <div key={msg.id || idx} className={`flex gap-4 ${msg.sender === 'admin' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-10 h-10 rounded-full flex flex-col items-center justify-center font-bold shrink-0 text-white ${msg.sender === 'admin' ? 'bg-emerald-950' : 'bg-emerald-500'}`}>
                                        {msg.sender === 'admin' ? 'A' : 'U'}
                                    </div>
                                    <div className={`bg-white p-4 rounded-2xl shadow-sm border border-slate-100 max-w-[80%] ${msg.sender === 'admin' ? 'rounded-tr-none bg-emerald-50 border-emerald-100' : 'rounded-tl-none'}`}>
                                        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                        <span className="text-[10px] text-slate-400 font-bold block mt-2 text-right">{msg.time}</span>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="mt-4 shrink-0 bg-white p-2 rounded-2xl border border-slate-200 flex gap-2 shadow-sm focus-within:border-emerald-500 transition duration-300">
                            <textarea
                                rows={1}
                                value={replyText}
                                onChange={e => setReplyText(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleReply())}
                                placeholder="Type a reply and press send..."
                                className="flex-1 resize-none bg-transparent outline-none p-3 text-sm text-slate-700"
                            />
                            <button onClick={handleReply} className="bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-xl transition flex items-center justify-center">
                                <Reply className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="lg:col-span-2 flex flex-col items-center justify-center h-full text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                        <MessageCircle className="w-16 h-16 mb-4 opacity-50" />
                        <p className="font-medium">Select a ticket to view conversation</p>
                    </div>
                )}
            </div>
        </div>
    );
}
