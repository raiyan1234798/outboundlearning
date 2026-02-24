"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Upload, Plus, Save, Image as ImageIcon, Layout, FileText, Video, Trash2, HelpCircle, AlignLeft, Layers } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function EditCourseContent() {
    const searchParams = useSearchParams();
    const courseId = searchParams.get("id");

    const [modules, setModules] = useState<any[]>([]);
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [tag, setTag] = useState("");
    const [thumbnail, setThumbnail] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchCourse = async () => {
            if (!courseId) return;
            setIsLoading(true);
            try {
                const docSnap = await getDoc(doc(db, "courses", courseId as string));
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setTitle(data.title || "");
                    setDesc(data.desc || "");
                    setTag(data.tag || "Corporate Training");
                    setThumbnail(data.img || "");
                    setModules(data.modules || []);
                } else {
                    alert("Course not found!");
                    router.push("/admin/courses");
                }
            } catch (err) {
                console.error(err);
                alert("Error loading course");
            } finally {
                setIsLoading(false);
            }
        };
        if (courseId) {
            fetchCourse();
        }
    }, [courseId, router]);

    const handleSaveCourse = async (status: string) => {
        if (!title.trim() || !courseId) {
            alert("Please enter a course title.");
            return;
        }
        setIsSaving(true);
        try {
            await updateDoc(doc(db, "courses", courseId as string), {
                title,
                desc,
                tag,
                img: thumbnail,
                status,
                modules
            });
            alert("Course updated successfully!");
            router.push("/admin/courses");
        } catch (err) {
            console.error(err);
            alert("Error updating course");
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingImage(true);
        try {
            const fileRef = ref(storage, `course_thumbnails/${Date.now()}_${file.name}`);
            const uploadTask = await uploadBytesResumable(fileRef, file);
            const downloadUrl = await getDownloadURL(uploadTask.ref);
            setThumbnail(downloadUrl);
        } catch (err) {
            console.error(err, "Failed to upload image");
            alert("Failed to upload image. Storage rules might be rejecting the request.");
        } finally {
            setIsUploadingImage(false);
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-slate-500 font-bold">Loading course editor...</div>;
    }

    const handleAddModule = () => {
        setModules([...modules, {
            id: Date.now().toString(),
            title: `Module ${modules.length + 1}: New Module`,
            items: []
        }]);
    };

    const handleAddItem = (moduleId: string, type: 'video' | 'quiz_mcq' | 'quiz_text') => {
        setModules(modules.map(mod => {
            if (mod.id === moduleId) {
                return {
                    ...mod,
                    items: [...mod.items, {
                        id: Date.now().toString(),
                        type,
                        title: type === 'video' ? 'New Video Lesson' : type === 'quiz_mcq' ? 'Multiple Choice Question' : 'Text Answer Question',
                        question: '',
                        options: ['', '', '', ''],
                        url: ''
                    }]
                }
            }
            return mod;
        }));
    };

    const handleDeleteItem = (moduleId: string, itemId: string) => {
        setModules(modules.map(mod => {
            if (mod.id === moduleId) {
                return {
                    ...mod,
                    items: mod.items.filter((item: any) => item.id !== itemId)
                }
            }
            return mod;
        }));
    };

    const handleUpdateItem = (moduleId: string, itemId: string, field: string, value: any) => {
        setModules(modules.map(mod => {
            if (mod.id === moduleId) {
                return {
                    ...mod,
                    items: mod.items.map((item: any) => item.id === itemId ? { ...item, [field]: value } : item)
                }
            }
            return mod;
        }));
    };

    const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
    const [availableQuizzes, setAvailableQuizzes] = useState<any[]>([]);
    const [targetModuleId, setTargetModuleId] = useState<string | null>(null);
    const [isLoadingQuizzes, setIsLoadingQuizzes] = useState(false);

    const openQuizBank = async (moduleId: string) => {
        setTargetModuleId(moduleId);
        setIsQuizModalOpen(true);
        setIsLoadingQuizzes(true);
        try {
            const snap = await getDocs(collection(db, "quizzes"));
            setAvailableQuizzes(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoadingQuizzes(false);
        }
    };

    const importQuiz = (quiz: any) => {
        if (!targetModuleId) return;

        // Add all items from the quiz into the target module
        const quizItems = quiz.items.map((item: any) => ({
            ...item,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 5), // Ensure unique IDs
            title: `[Imported] ${item.type === 'quiz_mcq' ? 'Multiple Choice' : 'Descriptive'} Question`
        }));

        setModules(modules.map(mod => {
            if (mod.id === targetModuleId) {
                return {
                    ...mod,
                    items: [...mod.items, ...quizItems]
                };
            }
            return mod;
        }));

        setIsQuizModalOpen(false);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h2 className="text-3xl font-black text-emerald-950 mb-2">Edit Course</h2>
                    <p className="text-slate-500 font-medium">Update existing training program content inside the Studio.</p>
                </div>
                <div className="flex gap-4 mt-4 md:mt-0">
                    <button disabled={isSaving} onClick={() => handleSaveCourse('draft')} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-3 rounded-xl transition shadow-sm disabled:opacity-50">
                        {isSaving ? "Saving..." : "Save Draft"}
                    </button>
                    <button disabled={isSaving} onClick={() => handleSaveCourse('published')} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition flex gap-2 items-center shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50">
                        <Save className="w-5 h-5" />
                        {isSaving ? "Saving..." : "Update Published"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white p-8 rounded-[1.5rem] shadow-sm border border-slate-100">
                        <h3 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2">
                            <Layout className="w-5 h-5 text-emerald-500" />
                            Basic Information
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Course Title</label>
                                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. European Travel Mastery" className="w-full bg-slate-50 border border-slate-200 outline-none p-4 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                                <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={4} placeholder="Outline what trainees will learn..." className="w-full bg-slate-50 border border-slate-200 outline-none p-4 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition resize-none" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white p-8 rounded-[1.5rem] shadow-sm border border-slate-100">
                        <h3 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-emerald-500" />
                            Curriculum Builder
                        </h3>

                        <div className="space-y-6 mb-6">
                            <AnimatePresence>
                                {modules.map((mod, modIdx) => (
                                    <motion.div
                                        key={mod.id}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="bg-slate-50 border border-slate-200 rounded-xl p-4 overflow-hidden"
                                    >
                                        <div className="flex justify-between items-center mb-4">
                                            <input
                                                value={mod.title}
                                                onChange={(e) => setModules(modules.map(m => m.id === mod.id ? { ...m, title: e.target.value } : m))}
                                                className="font-bold text-lg text-slate-800 tracking-tight bg-transparent outline-none flex-1 focus:border-b-2 border-emerald-500 py-1"
                                            />
                                            <button
                                                onClick={() => setModules(modules.filter(m => m.id !== mod.id))}
                                                className="text-slate-400 hover:text-red-500 transition p-2 hover:bg-red-50 rounded-lg ml-2"
                                                title="Delete Module"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="space-y-3">
                                            <AnimatePresence>
                                                {mod.items.map((item: any, itemIdx: number) => (
                                                    <motion.div
                                                        key={item.id}
                                                        initial={{ opacity: 0, scale: 0.95 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.95 }}
                                                        className={`bg-white p-4 rounded-xl border flex flex-col gap-3 shadow-sm group transition-colors ${item.type === 'video' ? 'border-emerald-100 hover:border-emerald-400' :
                                                            item.type === 'quiz_mcq' ? 'border-amber-100 hover:border-amber-400' :
                                                                'border-blue-100 hover:border-blue-400'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={`p-2 rounded-lg ${item.type === 'video' ? 'bg-emerald-50 text-emerald-600' :
                                                                item.type === 'quiz_mcq' ? 'bg-amber-50 text-amber-600' :
                                                                    'bg-blue-50 text-blue-600'
                                                                }`}>
                                                                {item.type === 'video' ? <Video className="w-5 h-5" /> :
                                                                    item.type === 'quiz_mcq' ? <HelpCircle className="w-5 h-5" /> :
                                                                        <AlignLeft className="w-5 h-5" />}
                                                            </div>
                                                            <input
                                                                value={item.title}
                                                                onChange={(e) => handleUpdateItem(mod.id, item.id, 'title', e.target.value)}
                                                                className="font-bold text-slate-700 flex-1 bg-transparent outline-none focus:border-b-2 border-emerald-500 py-1"
                                                            />
                                                            <button
                                                                title="Delete Lesson/Quiz"
                                                                onClick={() => handleDeleteItem(mod.id, item.id)}
                                                                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition p-1.5 hover:bg-red-50 rounded-md"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>

                                                        {/* Type Specific Fields */}
                                                        <div className="pl-14 pr-2">
                                                            {item.type === 'video' && (
                                                                <div className="flex flex-col gap-1">
                                                                    <label className="text-xs font-semibold text-slate-500">Video URL</label>
                                                                    <input
                                                                        placeholder="e.g. https://youtube.com/..."
                                                                        value={item.url || ''}
                                                                        onChange={(e) => handleUpdateItem(mod.id, item.id, 'url', e.target.value)}
                                                                        className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-500 focus:bg-white transition"
                                                                    />
                                                                </div>
                                                            )}

                                                            {item.type === 'quiz_mcq' && (
                                                                <div className="space-y-3">
                                                                    <div className="flex flex-col gap-1">
                                                                        <label className="text-xs font-semibold text-slate-500">Question Text</label>
                                                                        <input
                                                                            placeholder="What is the capital of France?"
                                                                            value={item.question || ''}
                                                                            onChange={(e) => handleUpdateItem(mod.id, item.id, 'question', e.target.value)}
                                                                            className="w-full text-sm p-3 bg-slate-50 border border-amber-200/50 rounded-lg outline-none focus:border-amber-500 focus:bg-white transition"
                                                                        />
                                                                    </div>
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                                        {[0, 1, 2, 3].map((optIdx) => (
                                                                            <div key={optIdx} className="flex gap-2 items-center">
                                                                                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-400">
                                                                                    {String.fromCharCode(65 + optIdx)}
                                                                                </div>
                                                                                <input
                                                                                    placeholder={`Option ${optIdx + 1}`}
                                                                                    value={(item.options || [])[optIdx] || ''}
                                                                                    onChange={(e) => {
                                                                                        const newOpt = [...(item.options || ['', '', '', ''])];
                                                                                        newOpt[optIdx] = e.target.value;
                                                                                        handleUpdateItem(mod.id, item.id, 'options', newOpt);
                                                                                    }}
                                                                                    className="w-full text-sm p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-amber-500 focus:bg-white transition"
                                                                                />
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {item.type === 'quiz_text' && (
                                                                <div className="flex flex-col gap-1">
                                                                    <label className="text-xs font-semibold text-slate-500">Descriptive Question</label>
                                                                    <input
                                                                        placeholder="Explain the process of booking a river cruise..."
                                                                        value={item.question || ''}
                                                                        onChange={(e) => handleUpdateItem(mod.id, item.id, 'question', e.target.value)}
                                                                        className="w-full text-sm p-3 bg-slate-50 border border-blue-200/50 rounded-lg outline-none focus:border-blue-500 focus:bg-white transition"
                                                                    />
                                                                    <p className="text-xs text-slate-400 mt-1 italic">Users will be provided a text area to submit their answer, which trainers will manually evaluate.</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </div>

                                        <div className="mt-4 flex flex-col sm:flex-row gap-2">
                                            <button onClick={() => handleAddItem(mod.id, 'video')} className="flex-1 border-2 border-dashed border-emerald-200 hover:border-emerald-400 text-emerald-600 hover:bg-emerald-50 font-semibold py-3 px-2 rounded-xl transition flex items-center justify-center gap-2 text-sm">
                                                <Video className="w-4 h-4" /> Add Video
                                            </button>
                                            <button onClick={() => handleAddItem(mod.id, 'quiz_mcq')} className="flex-1 border-2 border-dashed border-amber-200 hover:border-amber-400 text-amber-600 hover:bg-amber-50 font-semibold py-3 px-2 rounded-xl transition flex items-center justify-center gap-2 text-sm">
                                                <HelpCircle className="w-4 h-4" /> Add MCQ
                                            </button>
                                            <button onClick={() => handleAddItem(mod.id, 'quiz_text')} className="flex-1 border-2 border-dashed border-blue-200 hover:border-blue-400 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-2 rounded-xl transition flex items-center justify-center gap-2 text-sm">
                                                <AlignLeft className="w-4 h-4" /> Add Text Q.
                                            </button>
                                            <button onClick={() => openQuizBank(mod.id)} className="flex-1 border-2 border-dashed border-purple-200 hover:border-purple-400 text-purple-600 hover:bg-purple-50 font-semibold py-3 px-2 rounded-xl transition flex items-center justify-center gap-2 text-sm">
                                                <Layers className="w-4 h-4" /> Import from Quiz Builder
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        <button onClick={handleAddModule} className="w-full bg-slate-50 hover:bg-slate-100 border-2 border-dashed border-slate-200 hover:border-emerald-400 text-slate-600 hover:text-emerald-700 font-bold p-4 rounded-xl transition flex items-center justify-center gap-2 shadow-sm">
                            <Plus className="w-5 h-5" /> Add New Module
                        </button>
                    </motion.div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white p-8 rounded-[1.5rem] shadow-sm border border-slate-100">
                        <h3 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-emerald-500" />
                            Course Media
                        </h3>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Thumbnail</label>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={handleImageUpload}
                        />
                        <div onClick={() => fileInputRef.current?.click()} className="w-full h-48 bg-slate-50 border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-xl flex items-center justify-center flex-col gap-2 cursor-pointer transition text-slate-500 hover:text-emerald-600 overflow-hidden relative">
                            {thumbnail && thumbnail !== "https://images.unsplash.com/photo-1556761175-5973dc0f32d7?q=80&w=600&auto=format&fit=crop" ? (
                                <img src={thumbnail} alt="Thumbnail preview" className="absolute inset-0 w-full h-full object-cover" />
                            ) : (
                                <>
                                    <Upload className="w-8 h-8 opacity-50" />
                                    <span className="font-medium">{isUploadingImage ? "Uploading..." : "Upload Image"}</span>
                                    <span className="text-xs text-slate-400">1920x1080 recommended</span>
                                </>
                            )}
                        </div>
                    </motion.div>

                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-white p-8 rounded-[1.5rem] shadow-sm border border-slate-100 bg-gradient-to-br from-emerald-950 to-emerald-900 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400 rounded-full blur-[60px] opacity-20" />
                        <h3 className="text-xl font-bold mb-4 relative z-10">Access Settings</h3>
                        <div className="space-y-4 relative z-10">
                            <div>
                                <label className="block text-sm font-semibold text-emerald-100 mb-2">Assigned Teams</label>
                                <select title="Assign Teams" className="w-full bg-emerald-900/50 border border-emerald-700/50 outline-none p-3 rounded-lg text-sm text-white focus:border-emerald-500 transition">
                                    <option value="all">All Corporate Teams</option>
                                    <option value="sales">Sales Executives Only</option>
                                    <option value="management">Management Only</option>
                                </select>
                            </div>
                            <div className="p-4 bg-emerald-800/30 border border-emerald-700/50 rounded-lg flex gap-3 text-sm text-emerald-100">
                                <span>Note: Courses are strictly locked until users watch videos sequentially. In-between quizzes are completely optional.</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Quiz Bank Modal */}
            <AnimatePresence>
                {isQuizModalOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white w-full max-w-2xl max-h-[80vh] flex flex-col rounded-[2rem] shadow-2xl overflow-hidden p-6">
                            <h3 className="text-2xl font-black text-slate-800 mb-2">Quiz Bank</h3>
                            <p className="text-sm text-slate-500 mb-6">Select a pre-built assessment template to import into this module.</p>

                            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                                {isLoadingQuizzes ? (
                                    <p className="text-center text-slate-400 py-8">Loading templates...</p>
                                ) : availableQuizzes.length === 0 ? (
                                    <p className="text-center text-slate-400 py-8">No templates found in the Quiz Builder.</p>
                                ) : (
                                    availableQuizzes.map(quiz => (
                                        <div key={quiz.id} className="p-4 border border-slate-200 rounded-xl hover:border-emerald-400 hover:shadow-sm transition flex justify-between items-center group">
                                            <div>
                                                <h4 className="font-bold text-slate-800">{quiz.title}</h4>
                                                <p className="text-xs text-slate-500 mt-1">{quiz.items?.length || 0} Questions • {quiz.duration} mins</p>
                                            </div>
                                            <button onClick={() => importQuiz(quiz)} className="bg-emerald-50 text-emerald-700 px-4 py-2 font-bold text-sm rounded-lg hover:bg-emerald-600 hover:text-white transition">
                                                Import
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>

                            <button onClick={() => setIsQuizModalOpen(false)} className="mt-6 w-full py-3 font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition">
                                Cancel
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function EditCoursePage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-slate-500 font-bold">Loading...</div>}>
            <EditCourseContent />
        </Suspense>
    );
}
