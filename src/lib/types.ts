// ============ User Types ============
export type UserRole = 'admin' | 'manager' | 'executive';

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
    role: UserRole;
    teamId?: string;
    teamName?: string;
    createdAt: string;
    lastLogin?: string;
    isActive: boolean;
}

// ============ Team Types ============
export interface Team {
    id: string;
    name: string;
    description: string;
    managerId: string;
    managerName: string;
    memberIds: string[];
    assignedCourseIds: string[];
    createdAt: string;
}

// ============ Course Types ============
export interface Course {
    id: string;
    title: string;
    destination: string;
    description: string;
    thumbnail: string;
    highlights: string[];
    travelSeason: string;
    sellingTips: string[];
    modules: CourseModule[];
    totalDuration: number;
    totalLessons: number;
    isPublished: boolean;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    category: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface CourseModule {
    id: string;
    title: string;
    description: string;
    order: number;
    lessons: Lesson[];
}

export interface Lesson {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    videoDuration: number;
    order: number;
    moduleId: string;
    resources?: LessonResource[];
    quiz?: Quiz; // Optional quiz after the lesson
}

export interface LessonResource {
    id: string;
    title: string;
    type: 'pdf' | 'link' | 'image';
    url: string;
}

// ============ Quiz Types ============
export interface Quiz {
    id: string;
    title: string;
    description?: string;
    passingScore: number; // percentage needed to pass (e.g., 70)
    questions: QuizQuestion[];
    timeLimit?: number; // seconds, optional
}

export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number; // index of correct option
    explanation?: string;
}

export interface QuizAttempt {
    quizId: string;
    lessonId: string;
    userId: string;
    answers: number[]; // selected option indices
    score: number;
    passed: boolean;
    attemptedAt: string;
}

// ============ Progress Types ============
export interface UserProgress {
    id: string;
    userId: string;
    courseId: string;
    completedLessons: string[];
    lessonProgress: Record<string, LessonProgress>;
    quizResults: Record<string, QuizAttempt>; // lessonId -> QuizAttempt
    overallProgress: number;
    startedAt: string;
    lastAccessedAt: string;
    completedAt?: string;
    certificateId?: string;
}

export interface LessonProgress {
    lessonId: string;
    watchedSeconds: number;
    totalSeconds: number;
    percentWatched: number;
    isCompleted: boolean;
    lastPosition: number;
    tabSwitches: number;
    completedAt?: string;
}

// ============ Access Request Types ============
export type AccessRequestStatus = 'pending' | 'approved' | 'rejected';

export interface AccessRequest {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    courseId: string;
    courseName: string;
    requestedAt: string;
    status: AccessRequestStatus;
    reviewedBy?: string;
    reviewedAt?: string;
    grantedLessonIds?: string[]; // specific lessons the user can access
    message?: string; // user's request message
    adminNote?: string; // admin's note
}

// ============ Certificate Types ============
export interface Certificate {
    id: string;
    userId: string;
    userName: string;
    courseId: string;
    courseName: string;
    destination: string;
    completedAt: string;
    issuedAt: string;
    certificateNumber: string;
}

// ============ Analytics Types ============
export interface CourseAnalytics {
    courseId: string;
    totalEnrollments: number;
    completionRate: number;
    avgWatchTime: number;
    dropOffPoints: Record<string, number>;
    teamPerformance: Record<string, TeamPerformance>;
}

export interface TeamPerformance {
    teamId: string;
    teamName: string;
    totalMembers: number;
    completedMembers: number;
    avgProgress: number;
}

// ============ Notification Types ============
export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: 'course_assigned' | 'lesson_unlocked' | 'certificate_earned' | 'team_update' | 'access_request' | 'access_approved';
    isRead: boolean;
    createdAt: string;
    link?: string;
}
