"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlayCircle, CheckCircle, ChevronLeft, Award, Lock, Play, Pause, Settings2, AlertTriangle, HelpCircle } from "lucide-react";
import Link from "next/link";
import ReactPlayer from "react-player";

const COURSE_DATA = {
    id: "demo-1",
    title: "Mastering Asian Destinations",
    tag: "Sales Training",
    modules: [
        {
            id: 'm1',
            title: "Introduction to Vietnam",
            lessons: [
                { id: 'l1', type: 'video', title: 'Welcome Video & Overview', url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk', duration: 10, completed: true },
                { id: 'l2', type: 'quiz', title: 'Vietnam Basics Quiz', question: 'What is the capital?', options: ['Hanoi', 'HCMC', 'Da Nang', 'Hue'], answer: 0, completed: true }
            ]
        },
        {
            id: 'm2',
            title: "Selling Japanese Luxury",
            lessons: [
                { id: 'l3', type: 'video', title: 'Ryokan Stays & Etiquette', url: 'https://www.youtube.com/watch?v=5qap5aO4i9A', duration: 15, completed: false, active: true },
                { id: 'l4', type: 'quiz', title: 'Japanese Luxury Quiz', question: 'Which is a key selling point for a Ryokan?', options: ['Cheap beds', 'Kaiseki Dining', 'Loud parties', 'Close to airports'], answer: 1, completed: false }
            ]
        },
        {
            id: 'm3',
            title: "Thai Street Food Tours",
            lessons: [
                { id: 'l5', type: 'video', title: 'Street Food Safety', url: 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ', duration: 8, completed: false }
            ]
        }
    ]
};

export default function CoursePlayerPage() {
    const [activeLessonId, setActiveLessonId] = useState('l3');
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [playedSeconds, setPlayedSeconds] = useState(0);
    const [isScreenRecording, setIsScreenRecording] = useState(false);
    const [quizSelection, setQuizSelection] = useState<number | null>(null);
    const [quizResult, setQuizResult] = useState<'pass' | 'fail' | null>(null);

    const playerRef = useRef<any>(null);
    const lastPlayedSecondsRef = useRef(0);

    // Get current active lesson data
    const activeModule = COURSE_DATA.modules.find(m => m.lessons.some(l => l.id === activeLessonId));
    const activeLesson = activeModule?.lessons.find(l => l.id === activeLessonId);

    // Anti-Screen Record / Snipping Tool
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.shiftKey) {
                if (['3', '4', '5', 's', 'S'].includes(e.key)) {
                    setIsScreenRecording(true);
                    setIsPlaying(false);
                    e.preventDefault();
                    setTimeout(() => setIsScreenRecording(false), 5000); // blank screen for 5s
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleProgress = (state: any) => {
        // Prevent scrubbing forward
        if (!isScreenRecording) {
            if (state.playedSeconds > lastPlayedSecondsRef.current + 2) {
                // User skipped ahead! Revert them
                if (playerRef.current) {
                    playerRef.current.seekTo(lastPlayedSecondsRef.current);
                }
            } else {
                // Normal progression
                lastPlayedSecondsRef.current = state.playedSeconds;
                setPlayedSeconds(state.playedSeconds);

                // Auto complete video if near end (95%)
                if (state.played > 0.95 && activeLesson?.type === 'video' && !activeLesson.completed) {
                    activeLesson.completed = true;
                    // Logic to unlock next lesson or quiz
                    const currentIdx = activeModule?.lessons.findIndex(l => l.id === activeLessonId) ?? -1;
                    if (activeModule && currentIdx < activeModule.lessons.length - 1) {
                        setActiveLessonId(activeModule.lessons[currentIdx + 1].id);
                    }
                }
            }
        }
    };

    const handleQuizSubmit = () => {
        if (quizSelection === activeLesson?.answer) {
            setQuizResult('pass');
            if (activeLesson) activeLesson.completed = true;
        } else {
            setQuizResult('fail');
        }
    };

    const handleNextAfterQuiz = () => {
        setQuizResult(null);
        setQuizSelection(null);

        // Find next lesson
        const modIdx = COURSE_DATA.modules.findIndex(m => m.id === activeModule?.id);
        const lesIdx = COURSE_DATA.modules[modIdx].lessons.findIndex(l => l.id === activeLessonId);

        if (lesIdx < COURSE_DATA.modules[modIdx].lessons.length - 1) {
            setActiveLessonId(COURSE_DATA.modules[modIdx].lessons[lesIdx + 1].id);
        } else if (modIdx < COURSE_DATA.modules.length - 1) {
            setActiveLessonId(COURSE_DATA.modules[modIdx + 1].lessons[0].id);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <Link href="/dashboard" className="flex items-center gap-2 text-emerald-700 font-bold hover:bg-emerald-50 px-4 py-2 rounded-xl transition w-fit mb-4">
                <ChevronLeft className="w-5 h-5" /> Back to Dashboard
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Player Area */}
                <div className="lg:col-span-2 space-y-6">
                    {activeLesson?.type === 'video' ? (
                        <div className="bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 relative group aspect-video flex flex-col">
                            {/* The Anti-Record Overlay */}
                            <AnimatePresence>
                                {isScreenRecording && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 bg-black z-50 flex flex-col items-center justify-center text-white p-8 text-center"
                                    >
                                        <AlertTriangle className="w-16 h-16 text-amber-500 mb-4" />
                                        <h2 className="text-2xl font-black mb-2">Security Alert</h2>
                                        <p className="text-slate-400">Screen capturing or snipping shortcuts are disabled to protect proprietary corporate material.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {!isScreenRecording && (
                                <div className="flex-1 relative pointer-events-none">
                                    {/* pointer-events-none blocks clicking the iframe directly to skip, forces them to use custom controls */}
                                    {/* @ts-ignore */}
                                    <ReactPlayer
                                        ref={playerRef}
                                        url={activeLesson.url}
                                        playing={isPlaying}
                                        playbackRate={playbackRate}
                                        onProgress={handleProgress}
                                        width="100%"
                                        height="100%"
                                        controls={false}
                                        // @ts-ignore
                                        config={{ youtube: { playerVars: { disablekb: 1, modestbranding: 1, rel: 0 } } }}
                                    />
                                </div>
                            )}

                            {/* Custom Secured Controls */}
                            <div className="h-16 bg-slate-900 absolute bottom-0 left-0 right-0 flex items-center justify-between px-6 z-40">
                                <button onClick={() => setIsPlaying(!isPlaying)} className="text-white hover:text-emerald-400 transition">
                                    {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                                </button>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-bold text-slate-400 hidden sm:block">Skipping Disabled</span>
                                    <div className="flex bg-slate-800 rounded-lg p-1">
                                        {[1, 1.5, 2].map(speed => (
                                            <button
                                                key={speed}
                                                onClick={() => setPlaybackRate(speed)}
                                                className={`px-3 py-1 text-xs font-bold rounded-md transition ${playbackRate === speed ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'}`}
                                            >
                                                {speed}x
                                            </button>
                                        ))}
                                    </div>
                                    <Settings2 className="w-5 h-5 text-slate-400" />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-emerald-950 p-12 rounded-3xl shadow-2xl text-white relative overflow-hidden flex flex-col justify-center min-h-[400px]">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] opacity-20 pointer-events-none" />

                            {quizResult === null ? (
                                <motion.div key="q" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                    <h3 className="text-2xl font-bold mb-8 flex items-center gap-2 tracking-tight">
                                        <HelpCircle className="text-amber-400 w-8 h-8" />
                                        {activeLesson?.title}
                                    </h3>
                                    <p className="font-medium text-lg mb-6 text-emerald-50">{activeLesson?.question}</p>

                                    <div className="space-y-3 mb-8">
                                        {activeLesson?.options?.map((opt: string, i: number) => (
                                            <button
                                                key={i}
                                                onClick={() => setQuizSelection(i)}
                                                className={`w-full text-left p-4 rounded-xl border transition font-medium flex items-center gap-4 hover:scale-[1.01] active:scale-[0.99] ${quizSelection === i ? 'bg-emerald-600 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-emerald-900/50 border-emerald-800 hover:border-emerald-500'}`}
                                            >
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${quizSelection === i ? 'bg-white text-emerald-700' : 'bg-emerald-800 text-emerald-200'}`}>
                                                    {String.fromCharCode(65 + i)}
                                                </div>
                                                {opt}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={handleQuizSubmit}
                                        disabled={quizSelection === null}
                                        className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 disabled:text-slate-500 text-amber-950 font-black px-8 py-4 rounded-xl transition shadow-lg"
                                    >
                                        Submit Answer
                                    </button>
                                </motion.div>
                            ) : quizResult === 'pass' ? (
                                <motion.div key="pass" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center z-10">
                                    <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(16,185,129,0.8)]">
                                        <CheckCircle className="w-12 h-12 text-emerald-950" />
                                    </div>
                                    <h4 className="text-3xl font-black text-white mb-2">Quiz Passed!</h4>
                                    <p className="text-emerald-200 mb-8">You correctly answered the required question.</p>
                                    <button
                                        onClick={handleNextAfterQuiz}
                                        className="bg-white text-emerald-900 font-bold px-8 py-4 rounded-xl transition hover:scale-105 shadow-xl"
                                    >
                                        Continue to Next Lesson
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div key="fail" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center z-10">
                                    <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(239,68,68,0.8)]">
                                        <AlertTriangle className="w-12 h-12 text-white" />
                                    </div>
                                    <h4 className="text-3xl font-black text-white mb-2">Incorrect</h4>
                                    <p className="text-red-200 mb-8">You must pass this quiz to continue the course.</p>
                                    <button
                                        onClick={() => setQuizResult(null)}
                                        className="bg-white text-red-900 font-bold px-8 py-4 rounded-xl transition hover:scale-105 shadow-xl"
                                    >
                                        Try Again
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    )}

                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                        <h1 className="text-2xl font-black text-slate-800 mb-2">{activeLesson?.title}</h1>
                        <p className="text-slate-500">{COURSE_DATA.title} • {activeModule?.title}</p>
                    </div>
                </div>

                {/* Secure Player Sidebar */}
                <div className="space-y-4">
                    <h3 className="font-black text-xl text-slate-800 tracking-tight">Curriculum Checkpoints</h3>
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
                        {COURSE_DATA.modules.map((mod, mIdx) => (
                            <div key={mod.id}>
                                <h4 className="font-bold text-sm text-slate-400 mb-3 uppercase tracking-wider">{mod.title}</h4>
                                <div className="space-y-3 relative before:absolute before:inset-y-0 before:left-[11px] before:w-0.5 before:bg-slate-100">
                                    {mod.lessons.map((lesson, lIdx) => {
                                        const isPrevCompleted = mIdx === 0 && lIdx === 0 ? true :
                                            lIdx > 0 ? mod.lessons[lIdx - 1].completed : COURSE_DATA.modules[mIdx - 1].lessons[COURSE_DATA.modules[mIdx - 1].lessons.length - 1].completed;

                                        const isLocked = !isPrevCompleted && lesson.id !== activeLessonId;
                                        const isCurrent = lesson.id === activeLessonId;

                                        return (
                                            <div
                                                key={lesson.id}
                                                className={`relative pl-8 flex gap-3 ${isLocked ? 'opacity-50 grayscale' : 'cursor-pointer group'}`}
                                            >
                                                <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center z-10 transition ${lesson.completed ? 'bg-emerald-500 text-white' :
                                                    isCurrent ? 'bg-amber-500 text-white shadow-[0_0_10px_rgba(245,158,11,0.5)]' :
                                                        'bg-slate-200 text-slate-400'
                                                    }`}>
                                                    {lesson.completed ? <CheckCircle className="w-4 h-4" /> : isLocked ? <Lock className="w-3 h-3" /> : <PlayCircle className="w-4 h-4" />}
                                                </div>
                                                <div className={`flex-1 p-3 rounded-xl transition ${isCurrent ? 'bg-amber-50 border border-amber-200/50' : 'hover:bg-slate-50'}`}>
                                                    <h5 className={`font-bold text-sm leading-snug mb-1 ${isCurrent ? 'text-amber-950' : lesson.completed ? 'text-slate-700' : 'text-slate-500'}`}>
                                                        {lesson.title}
                                                    </h5>
                                                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                                                        {lesson.type === 'video' ? <PlayCircle className="w-3 h-3" /> : <HelpCircle className="w-3 h-3" />}
                                                        {lesson.type === 'video' ? `${lesson.duration} mins` : 'Required Quiz'}
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
