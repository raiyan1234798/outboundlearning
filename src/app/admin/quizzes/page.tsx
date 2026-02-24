"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Copy, Plus, Clock, Eye, Edit2, Trash2, HelpCircle, AlignLeft, X } from "lucide-react";
import { useState, useEffect } from "react";
import { collection, query, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function QuizBuilderPage() {
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingQuizId, setEditingQuizId] = useState<string | null>(null);

    // Form State
    const [title, setTitle] = useState("");
    const [duration, setDuration] = useState(45);
    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        const q = query(collection(db, "quizzes"));
        const snapshot = await getDocs(q);
        setQuizzes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const handleSaveQuiz = async () => {
        if (!title.trim()) return;
        const quizData = { title, duration, items };

        if (editingQuizId) {
            await updateDoc(doc(db, "quizzes", editingQuizId), quizData);
        } else {
            await addDoc(collection(db, "quizzes"), quizData);
        }

        setIsModalOpen(false);
        fetchQuizzes();
    };

    const handleDeleteQuiz = async (id: string) => {
        if (confirm("Are you sure you want to delete this quiz template?")) {
            await deleteDoc(doc(db, "quizzes", id));
            fetchQuizzes();
        }
    };

    const openEdit = (quiz: any) => {
        setEditingQuizId(quiz.id);
        setTitle(quiz.title);
        setDuration(quiz.duration || 45);
        setItems(quiz.items || []);
        setIsModalOpen(true);
    };

    const openCreate = () => {
        setEditingQuizId(null);
        setTitle("");
        setDuration(45);
        setItems([]);
        setIsModalOpen(true);
    };

    const handleAddItem = (type: 'quiz_mcq' | 'quiz_text') => {
        setItems([...items, {
            id: Date.now().toString(),
            type,
            question: '',
            options: ['', '', '', '']
        }]);
    };

    const handleUpdateItem = (itemId: string, field: string, value: any) => {
        setItems(items.map(item => item.id === itemId ? { ...item, [field]: value } : item));
    };

    const handleDeleteItem = (itemId: string) => {
        setItems(items.filter(item => item.id !== itemId));
    };

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h2 className="text-3xl font-black text-emerald-950 mb-2">Quiz Builder Engine</h2>
                    <p className="text-slate-500 font-medium">Create enterprise assessments and robust evaluations.</p>
                </div>
                <button onClick={openCreate} className="bg-emerald-600 text-white hover:bg-emerald-700 font-bold px-6 py-3 rounded-xl transition flex gap-2 items-center mt-4 md:mt-0 shadow-lg shadow-emerald-600/20 active:scale-95">
                    <Plus className="w-5 h-5" />
                    Create Quiz
                </button>
            </div>

            {quizzes.length === 0 && (
                <div className="text-center py-20 bg-white border-2 border-dashed border-slate-200 rounded-[2rem]">
                    <HelpCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-700 mb-2">No Quizzes Found</h3>
                    <p className="text-slate-500">Create your first evaluation template to assign to courses.</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.map((quiz, i) => {
                    const mcqCount = quiz.items?.filter((item: any) => item.type === 'quiz_mcq').length || 0;
                    const textCount = quiz.items?.filter((item: any) => item.type === 'quiz_text').length || 0;

                    return (
                        <motion.div
                            key={quiz.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white border text-center relative border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 group"
                        >
                            <div className="w-16 h-16 bg-emerald-100/50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md shadow-emerald-500/10 group-hover:scale-110 group-hover:bg-emerald-100 transition duration-300">
                                <Copy className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-1">{quiz.title}</h3>
                            <p className="text-slate-500 text-sm mb-6 px-4">
                                {mcqCount} Multiple Choice • {textCount} Descriptive
                            </p>

                            <div className="flex items-center justify-center gap-4 text-sm font-medium text-slate-600 mb-6 bg-slate-50 py-2 rounded-lg">
                                <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-emerald-600" /> {quiz.duration} mins</span>
                            </div>

                            <div className="flex gap-2">
                                <button onClick={() => openEdit(quiz)} className="flex-1 bg-emerald-50 text-emerald-700 font-bold py-3 rounded-xl hover:bg-emerald-100 transition flex items-center justify-center gap-2">
                                    <Edit2 className="w-4 h-4" /> Edit
                                </button>
                                <button onClick={() => handleDeleteQuiz(quiz.id)} className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Quiz Builder Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white w-full max-w-4xl max-h-[90vh] flex flex-col rounded-[2rem] shadow-2xl overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-800">{editingQuizId ? 'Edit Quiz Template' : 'New Quiz Template'}</h3>
                                    <p className="text-sm text-slate-500">Build interactive questions to assign globally.</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-200 rounded-full transition"><X className="w-6 h-6" /></button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/50 custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Quiz Template Title</label>
                                        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Sales Final Certification" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:bg-white transition" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Time Limit (Minutes)</label>
                                        <input type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:bg-white transition" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-bold text-lg text-slate-800">Questions</h4>
                                    <AnimatePresence>
                                        {items.map((item, idx) => (
                                            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group">
                                                <button onClick={() => handleDeleteItem(item.id)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>

                                                <div className="flex items-center gap-2 mb-4 text-emerald-700 font-bold text-sm bg-emerald-50 w-max px-3 py-1 rounded-lg">
                                                    {item.type === 'quiz_mcq' ? <><HelpCircle className="w-4 h-4" /> Multiple Choice</> : <><AlignLeft className="w-4 h-4" /> Descriptive</>}
                                                </div>

                                                <label className="block text-xs font-semibold text-slate-500 mb-2">Question Text</label>
                                                <input value={item.question} onChange={e => handleUpdateItem(item.id, 'question', e.target.value)} placeholder="Type your question..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-500 focus:bg-white transition mb-4 font-medium" />

                                                {item.type === 'quiz_mcq' && (
                                                    <div className="grid grid-cols-2 gap-3 pl-4 border-l-2 border-amber-200">
                                                        {[0, 1, 2, 3].map(optIdx => (
                                                            <div key={optIdx} className="flex gap-3 items-center">
                                                                <span className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">{String.fromCharCode(65 + optIdx)}</span>
                                                                <input value={(item.options || [])[optIdx] || ''} onChange={e => {
                                                                    const newOpts = [...(item.options || ['', '', '', ''])];
                                                                    newOpts[optIdx] = e.target.value;
                                                                    handleUpdateItem(item.id, 'options', newOpts);
                                                                }} placeholder={`Option ${optIdx + 1}`} className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-amber-500 focus:bg-white transition text-sm" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {item.type === 'quiz_text' && (
                                                    <p className="text-xs text-slate-400 italic">User will be provided a long-form text area to submit their answer.</p>
                                                )}
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>

                                    <div className="flex gap-3 pt-4 border-t border-slate-200">
                                        <button onClick={() => handleAddItem('quiz_mcq')} className="flex-1 border-2 border-dashed border-slate-200 hover:border-amber-400 text-slate-600 hover:text-amber-700 bg-slate-50 hover:bg-amber-50 font-bold py-4 rounded-xl transition flex items-center justify-center gap-2">
                                            <HelpCircle className="w-5 h-5" /> Add Multiple Choice
                                        </button>
                                        <button onClick={() => handleAddItem('quiz_text')} className="flex-1 border-2 border-dashed border-slate-200 hover:border-blue-400 text-slate-600 hover:text-blue-700 bg-slate-50 hover:bg-blue-50 font-bold py-4 rounded-xl transition flex items-center justify-center gap-2">
                                            <AlignLeft className="w-5 h-5" /> Add Descriptive Question
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-4">
                                <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition">Cancel</button>
                                <button onClick={handleSaveQuiz} disabled={!title.trim() || items.length === 0} className="px-8 py-3 font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition shadow-lg shadow-emerald-500/20 active:scale-95">Save Template</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
