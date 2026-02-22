'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import VideoPlayer from '@/components/video/VideoPlayer';
import QuizPlayer from '@/components/quiz/QuizPlayer';
import { demoCourses, demoProgress, demoAccessRequests, formatDuration } from '@/lib/demoData';
import { QuizAttempt } from '@/lib/types';
import {
    HiOutlineClock,
    HiOutlineCheckCircle,
    HiOutlineChevronDown,
    HiOutlineLockClosed,
    HiOutlinePlay,
    HiOutlineStar,
    HiOutlineArrowLeft,
    HiOutlineLightBulb,
    HiOutlineSun,
    HiOutlineAcademicCap,
    HiOutlineClipboardDocumentList,
} from 'react-icons/hi2';

export default function CourseDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
    const resolvedParams = use(params);
    const { userProfile, loading, user } = useAuth();
    const router = useRouter();
    const [activeLesson, setActiveLesson] = useState<string | null>(null);
    const [expandedModules, setExpandedModules] = useState<string[]>([]);
    const [completedLessons, setCompletedLessons] = useState<string[]>([]);
    const [quizResults, setQuizResults] = useState<Record<string, QuizAttempt>>({});
    const [showQuiz, setShowQuiz] = useState(false);
    const [videoCompleted, setVideoCompleted] = useState(false);

    const course = demoCourses.find(c => c.id === resolvedParams.courseId);

    useEffect(() => {
        if (!loading && !user) router.replace('/login');
    }, [loading, user, router]);

    useEffect(() => {
        if (course) {
            const progress = demoProgress.find(
                p => p.courseId === course.id && p.userId === userProfile?.uid
            );
            if (progress) {
                setCompletedLessons(progress.completedLessons);
                if (progress.quizResults) setQuizResults(progress.quizResults);
            }

            if (course.modules.length > 0) {
                setExpandedModules([course.modules[0].id]);
                const allLsns = course.modules.flatMap(m => m.lessons).sort((a, b) => {
                    const modA = course.modules.find(m => m.id === a.moduleId)!;
                    const modB = course.modules.find(m => m.id === b.moduleId)!;
                    if (modA.order !== modB.order) return modA.order - modB.order;
                    return a.order - b.order;
                });
                const firstUncompleted = allLsns.find(l => !completedLessons.includes(l.id));
                setActiveLesson(firstUncompleted?.id || allLsns[0]?.id || null);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [course, userProfile]);

    if (loading || !userProfile || !course) {
        return <div className="loading-screen"><div className="loading-spinner" /></div>;
    }

    // Check access for this course
    const userAccess = demoAccessRequests.find(
        r => r.userId === userProfile.uid && r.courseId === course.id && r.status === 'approved'
    );
    const hasGrantedLessons = userAccess?.grantedLessonIds && userAccess.grantedLessonIds.length > 0;

    function getAllLessons() {
        return course!.modules.flatMap(m => m.lessons).sort((a, b) => {
            const modA = course!.modules.find(m => m.id === a.moduleId)!;
            const modB = course!.modules.find(m => m.id === b.moduleId)!;
            if (modA.order !== modB.order) return modA.order - modB.order;
            return a.order - b.order;
        });
    }

    const allLessons = getAllLessons();
    const currentLessonObj = allLessons.find(l => l.id === activeLesson);
    const currentIndex = allLessons.findIndex(l => l.id === activeLesson);
    const overallProgress = allLessons.length > 0
        ? Math.round((completedLessons.length / allLessons.length) * 100) : 0;

    const isLessonUnlocked = (lessonId: string): boolean => {
        // If access is restricted to specific lessons
        if (hasGrantedLessons) {
            return userAccess!.grantedLessonIds!.includes(lessonId);
        }
        const idx = allLessons.findIndex(l => l.id === lessonId);
        if (idx === 0) return true;
        const prevLesson = allLessons[idx - 1];
        // Previous lesson must be completed
        if (!completedLessons.includes(prevLesson.id)) return false;
        // If previous lesson has a quiz, it must be passed
        if (prevLesson.quiz) {
            const attempt = quizResults[prevLesson.id];
            if (!attempt || !attempt.passed) return false;
        }
        return true;
    };

    const isLessonFullyComplete = (lessonId: string): boolean => {
        if (!completedLessons.includes(lessonId)) return false;
        const lesson = allLessons.find(l => l.id === lessonId);
        if (lesson?.quiz) {
            const attempt = quizResults[lessonId];
            if (!attempt || !attempt.passed) return false;
        }
        return true;
    };

    const toggleModule = (modId: string) => {
        setExpandedModules(prev =>
            prev.includes(modId) ? prev.filter(id => id !== modId) : [...prev, modId]
        );
    };

    const handleLessonSelect = (lessonId: string) => {
        if (isLessonUnlocked(lessonId)) {
            setActiveLesson(lessonId);
            setShowQuiz(false);
            setVideoCompleted(false);
        }
    };

    const handleLessonComplete = () => {
        if (!activeLesson) return;
        const lesson = allLessons.find(l => l.id === activeLesson);

        // If lesson has a quiz, show quiz after video
        if (lesson?.quiz && !quizResults[activeLesson]?.passed) {
            setVideoCompleted(true);
            setShowQuiz(true);
            return;
        }

        // No quiz — mark complete directly
        markLessonComplete();
    };

    const markLessonComplete = () => {
        if (activeLesson && !completedLessons.includes(activeLesson)) {
            const newCompleted = [...completedLessons, activeLesson];
            setCompletedLessons(newCompleted);
            autoAdvance(newCompleted);
        }
    };

    const handleQuizPass = (attempt: QuizAttempt) => {
        if (!activeLesson) return;
        const newQuizResults = { ...quizResults, [activeLesson]: attempt };
        setQuizResults(newQuizResults);

        // Mark lesson complete after quiz pass
        if (!completedLessons.includes(activeLesson)) {
            const newCompleted = [...completedLessons, activeLesson];
            setCompletedLessons(newCompleted);
            setTimeout(() => {
                setShowQuiz(false);
                autoAdvance(newCompleted);
            }, 2000);
        }
    };

    const autoAdvance = (newCompleted: string[]) => {
        if (currentIndex < allLessons.length - 1) {
            setTimeout(() => {
                const nextLesson = allLessons[currentIndex + 1];
                setActiveLesson(nextLesson.id);
                setVideoCompleted(false);
                setShowQuiz(false);
                if (!expandedModules.includes(nextLesson.moduleId)) {
                    setExpandedModules(prev => [...prev, nextLesson.moduleId]);
                }
            }, 1500);
        }
        if (newCompleted.length === allLessons.length) {
            // Course completed
        }
    };

    const handleVideoProgress = () => {
        // Save progress
    };

    const hasQuiz = currentLessonObj?.quiz;

    return (
        <AppLayout pageTitle={course.title}>
            <button className="btn-ghost" onClick={() => router.push('/courses')} style={{ marginBottom: '16px' }}>
                <HiOutlineArrowLeft /> Back to Courses
            </button>

            <div className="course-detail-layout">
                {/* Main Content */}
                <div className="course-main">
                    {/* Video Player / Quiz */}
                    {currentLessonObj ? (
                        <div className="course-video-section">
                            {showQuiz && currentLessonObj.quiz ? (
                                <QuizPlayer
                                    quiz={currentLessonObj.quiz}
                                    lessonId={currentLessonObj.id}
                                    userId={userProfile.uid}
                                    onPass={handleQuizPass}
                                    existingAttempt={quizResults[currentLessonObj.id]}
                                />
                            ) : (
                                <>
                                    <VideoPlayer
                                        videoUrl={currentLessonObj.videoUrl || undefined}
                                        lessonTitle={currentLessonObj.title}
                                        onProgress={handleVideoProgress}
                                        onComplete={handleLessonComplete}
                                        initialPosition={0}
                                    />
                                    {hasQuiz && videoCompleted && (
                                        <div className="quiz-prompt">
                                            <HiOutlineClipboardDocumentList />
                                            <div>
                                                <strong>Quiz Required</strong>
                                                <p>Complete the quiz to proceed to the next lesson</p>
                                            </div>
                                            <button className="btn-primary-custom" onClick={() => setShowQuiz(true)}>
                                                Start Quiz
                                            </button>
                                        </div>
                                    )}
                                    {hasQuiz && !videoCompleted && (
                                        <div className="quiz-notice">
                                            <HiOutlineClipboardDocumentList />
                                            <span>This lesson has a quiz — complete the video first, then pass the quiz to unlock the next lesson.</span>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="course-empty-state">
                            <HiOutlinePlay className="empty-icon-large" />
                            <h3>Select a Lesson to Begin</h3>
                            <p>Choose your first lesson from the module list</p>
                        </div>
                    )}

                    {/* Course Info */}
                    <div className="card-custom course-info-card">
                        <div className="card-body-content">
                            <div className="course-info-header">
                                <h3>{course.destination}</h3>
                                <span className={`badge-custom ${course.difficulty === 'beginner' ? 'success' : course.difficulty === 'intermediate' ? 'warning' : 'danger'}`}>
                                    {course.difficulty}
                                </span>
                            </div>

                            <p className="course-description">{course.description}</p>

                            {/* Course Meta */}
                            <div className="course-meta-grid">
                                <div className="course-meta-item">
                                    <div className="meta-value">{course.totalLessons}</div>
                                    <div className="meta-label">Lessons</div>
                                </div>
                                <div className="course-meta-item">
                                    <div className="meta-value">{course.modules.length}</div>
                                    <div className="meta-label">Modules</div>
                                </div>
                                <div className="course-meta-item">
                                    <div className="meta-value">{formatDuration(course.totalDuration)}</div>
                                    <div className="meta-label">Duration</div>
                                </div>
                                <div className="course-meta-item">
                                    <div className="meta-value">{overallProgress}%</div>
                                    <div className="meta-label">Progress</div>
                                </div>
                            </div>

                            {/* Highlights */}
                            <div className="course-section">
                                <h4><HiOutlineStar /> Highlights</h4>
                                <div className="tags-wrap">
                                    {course.highlights.map((h, i) => (
                                        <span key={i} className="badge-custom success">{h}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Travel Season */}
                            <div className="course-section">
                                <h4><HiOutlineSun /> Best Travel Season</h4>
                                <p className="section-text">{course.travelSeason}</p>
                            </div>

                            {/* Selling Tips */}
                            <div className="course-section">
                                <h4><HiOutlineLightBulb /> Selling Tips</h4>
                                <ul className="tips-list">
                                    {course.sellingTips.map((tip, i) => (
                                        <li key={i}>{tip}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Course Modules Sidebar */}
                <div className="course-sidebar">
                    {/* Overall Progress */}
                    <div className="card-custom" style={{ marginBottom: '12px' }}>
                        <div className="card-body-content">
                            <div className="progress-label">
                                <span className="progress-text" style={{ fontWeight: 600 }}>Course Progress</span>
                                <span className="progress-percent">{overallProgress}%</span>
                            </div>
                            <div className="progress-custom" style={{ height: '10px' }}>
                                <div className="progress-fill" style={{ width: `${overallProgress}%` }} />
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                                {completedLessons.length} of {allLessons.length} lessons completed
                            </div>
                            {overallProgress === 100 && (
                                <button
                                    className="btn-primary-custom"
                                    onClick={() => router.push('/certificates')}
                                    style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}
                                >
                                    <HiOutlineAcademicCap /> View Certificate
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Access restriction notice */}
                    {hasGrantedLessons && (
                        <div className="access-notice">
                            <strong>Limited Access</strong>
                            <p>You have access to {userAccess!.grantedLessonIds!.length} specific lessons in this course.</p>
                        </div>
                    )}

                    {/* Modules Accordion */}
                    {course.modules.map(mod => {
                        const isExpanded = expandedModules.includes(mod.id);
                        const modLessons = mod.lessons;
                        const modCompleted = modLessons.filter(l => isLessonFullyComplete(l.id)).length;
                        const modProgress = modLessons.length > 0 ? Math.round((modCompleted / modLessons.length) * 100) : 0;

                        return (
                            <div className="module-accordion" key={mod.id}>
                                <button className="module-header" onClick={() => toggleModule(mod.id)}>
                                    <div>
                                        <div className="module-title">{mod.title}</div>
                                        <div className="module-meta">
                                            {modCompleted}/{modLessons.length} lessons • {modProgress}% complete
                                        </div>
                                    </div>
                                    <span className={`module-chevron ${isExpanded ? 'open' : ''}`}>
                                        <HiOutlineChevronDown />
                                    </span>
                                </button>
                                {isExpanded && (
                                    <div className="module-content">
                                        <div className="lesson-list">
                                            {modLessons.map(lesson => {
                                                const isComplete = isLessonFullyComplete(lesson.id);
                                                const videoComplete = completedLessons.includes(lesson.id);
                                                const isCurrent = activeLesson === lesson.id;
                                                const isUnlocked = isLessonUnlocked(lesson.id);
                                                const needsQuiz = lesson.quiz && videoComplete && !quizResults[lesson.id]?.passed;

                                                return (
                                                    <button
                                                        key={lesson.id}
                                                        className={`lesson-item ${isCurrent ? 'active' : ''} ${!isUnlocked ? 'locked' : ''}`}
                                                        onClick={() => handleLessonSelect(lesson.id)}
                                                    >
                                                        <div className={`lesson-icon ${isComplete ? 'completed' : isCurrent ? 'current' : 'locked'}`}>
                                                            {isComplete ? (
                                                                <HiOutlineCheckCircle />
                                                            ) : !isUnlocked ? (
                                                                <HiOutlineLockClosed />
                                                            ) : (
                                                                <HiOutlinePlay />
                                                            )}
                                                        </div>
                                                        <div className="lesson-info">
                                                            <div className="lesson-title">{lesson.title}</div>
                                                            <div className="lesson-duration">
                                                                <HiOutlineClock style={{ marginRight: '4px' }} />
                                                                {formatDuration(lesson.videoDuration)}
                                                                {lesson.quiz && (
                                                                    <span className="lesson-quiz-badge">
                                                                        <HiOutlineClipboardDocumentList /> Quiz
                                                                    </span>
                                                                )}
                                                                {needsQuiz && (
                                                                    <span className="quiz-pending-badge">Quiz pending</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
}
