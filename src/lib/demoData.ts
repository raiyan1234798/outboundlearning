import { Course, Team, UserProfile, UserProgress, Certificate, AccessRequest, Quiz } from './types';

// ============ Reusable Quiz Templates ============
const manaliIntroQuiz: Quiz = {
    id: 'quiz-m1',
    title: 'Manali Basics Quiz',
    description: 'Test your knowledge of Manali fundamentals',
    passingScore: 70,
    questions: [
        {
            id: 'q-m1-1',
            question: 'What is the best time to visit Manali for snow experiences?',
            options: ['July-August', 'December-February', 'March-April', 'September-October'],
            correctAnswer: 1,
            explanation: 'December to February is the peak snow season in Manali.',
        },
        {
            id: 'q-m1-2',
            question: 'Which valley is famous for adventure sports near Manali?',
            options: ['Kashmir Valley', 'Solang Valley', 'Spiti Valley', 'Kullu Valley'],
            correctAnswer: 1,
            explanation: 'Solang Valley is the primary adventure hub with skiing, paragliding, and zorbing.',
        },
        {
            id: 'q-m1-3',
            question: 'Which pass near Manali requires a permit to visit?',
            options: ['Rohtang Pass', 'Khyber Pass', 'Banihal Pass', 'Zoji La Pass'],
            correctAnswer: 0,
            explanation: 'Rohtang Pass requires a government permit due to environmental protection.',
        },
    ],
};

const ootyPlacesQuiz: Quiz = {
    id: 'quiz-o2',
    title: 'Ooty Attractions Quiz',
    description: 'How well do you know Ooty\'s tourist spots?',
    passingScore: 70,
    questions: [
        {
            id: 'q-o2-1',
            question: 'The Nilgiri Mountain Railway is a UNESCO World Heritage Site. What type of train is it?',
            options: ['Bullet train', 'Toy train / Rack railway', 'Metro rail', 'Express train'],
            correctAnswer: 1,
            explanation: 'The Nilgiri Mountain Railway is a rack railway (toy train) built in 1908.',
        },
        {
            id: 'q-o2-2',
            question: 'What is Ooty famous for growing?',
            options: ['Coffee', 'Tea', 'Rubber', 'Cotton'],
            correctAnswer: 1,
            explanation: 'Ooty is famous for its tea gardens and tea production.',
        },
        {
            id: 'q-o2-3',
            question: 'Which garden in Ooty was established in 1848?',
            options: ['Rose Garden', 'Botanical Garden', 'Bryant Park', 'Sims Park'],
            correctAnswer: 1,
            explanation: 'The Government Botanical Garden was established in 1848 on 55 acres.',
        },
        {
            id: 'q-o2-4',
            question: 'What is Ooty also known as?',
            options: ['City of Lakes', 'Queen of Hill Stations', 'Garden City', 'Hill Paradise'],
            correctAnswer: 1,
            explanation: 'Ooty is popularly known as the Queen of Hill Stations.',
        },
    ],
};

const goaSalesQuiz: Quiz = {
    id: 'quiz-g3',
    title: 'Goa Sales Mastery Quiz',
    description: 'Test your Goa selling strategies',
    passingScore: 80,
    questions: [
        {
            id: 'q-g3-1',
            question: 'Which part of Goa is known for vibrant nightlife and backpacker culture?',
            options: ['South Goa', 'Central Goa', 'North Goa', 'East Goa'],
            correctAnswer: 2,
            explanation: 'North Goa (Baga, Calangute, Anjuna) is known for nightlife and backpackers.',
        },
        {
            id: 'q-g3-2',
            question: 'What is the peak tourist season for Goa?',
            options: ['June-August', 'March-May', 'November-February', 'August-October'],
            correctAnswer: 2,
            explanation: 'November to February is peak season with pleasant weather and Christmas/New Year festivities.',
        },
        {
            id: 'q-g3-3',
            question: 'When selling Goa, what is the best strategy for monsoon season packages?',
            options: ['Avoid selling monsoon packages', 'Position them as budget/romantic options', 'Only sell to international tourists', 'Recommend other destinations'],
            correctAnswer: 1,
            explanation: 'Monsoon Goa can be sold as affordable and romantic with lush green scenery.',
        },
    ],
};

// ============ Demo Courses ============
export const demoCourses: Course[] = [
    {
        id: 'course-manali',
        title: 'Manali Travel Training',
        destination: 'Manali',
        description: 'Complete training on Manali as a travel destination. Learn about packages, best seasons, key attractions, and selling strategies for this Himalayan paradise.',
        thumbnail: '/images/manali.jpg',
        highlights: ['Snow-capped mountains', 'Adventure sports', 'Solang Valley', 'Old Manali', 'Rohtang Pass'],
        travelSeason: 'October to June (Peak: Dec-Feb for snow, May-Jun for summer)',
        sellingTips: [
            'Highlight honeymoon packages for newlyweds',
            'Promote adventure sports for youth groups',
            'Emphasize snow experiences for families',
            'Bundle with Shimla for extended trips'
        ],
        modules: [
            {
                id: 'mod-m1', title: 'Introduction to Manali', description: 'Overview of Manali as a destination', order: 1,
                lessons: [
                    { id: 'les-m1-1', title: 'Welcome to Manali Training', description: 'Learn why Manali is a top destination', videoUrl: '', videoDuration: 420, order: 1, moduleId: 'mod-m1' },
                    { id: 'les-m1-2', title: 'Geography & Climate', description: 'Understanding Manali weather patterns', videoUrl: '', videoDuration: 360, order: 2, moduleId: 'mod-m1' },
                    { id: 'les-m1-3', title: 'Best Time to Visit', description: 'Seasonal guide for Manali tours', videoUrl: '', videoDuration: 300, order: 3, moduleId: 'mod-m1', quiz: manaliIntroQuiz },
                ]
            },
            {
                id: 'mod-m2', title: 'Top Attractions', description: 'Key tourist spots in and around Manali', order: 2,
                lessons: [
                    { id: 'les-m2-1', title: 'Solang Valley Experience', description: 'Adventure activities at Solang', videoUrl: '', videoDuration: 480, order: 1, moduleId: 'mod-m2' },
                    { id: 'les-m2-2', title: 'Rohtang Pass Guide', description: 'Everything about Rohtang Pass tours', videoUrl: '', videoDuration: 450, order: 2, moduleId: 'mod-m2' },
                    { id: 'les-m2-3', title: 'Old Manali & Cafes', description: 'Cultural side of Manali', videoUrl: '', videoDuration: 380, order: 3, moduleId: 'mod-m2' },
                ]
            },
            {
                id: 'mod-m3', title: 'Selling Manali', description: 'Sales techniques for Manali packages', order: 3,
                lessons: [
                    { id: 'les-m3-1', title: 'Package Types & Pricing', description: 'Standard, premium, and luxury packages', videoUrl: '', videoDuration: 520, order: 1, moduleId: 'mod-m3' },
                    { id: 'les-m3-2', title: 'Handling Customer Objections', description: 'Common concerns and how to address them', videoUrl: '', videoDuration: 400, order: 2, moduleId: 'mod-m3' },
                ]
            }
        ],
        totalDuration: 3310, totalLessons: 8, isPublished: true,
        createdBy: 'admin', createdAt: '2025-01-15', updatedAt: '2025-02-10', category: 'North India', difficulty: 'beginner',
    },
    {
        id: 'course-ooty',
        title: 'Ooty Travel Guide',
        destination: 'Ooty',
        description: 'Master selling Ooty tour packages. From tea gardens to botanical parks, learn everything about the Queen of Hill Stations.',
        thumbnail: '/images/ooty.jpg',
        highlights: ['Tea Gardens', 'Botanical Garden', 'Ooty Lake', 'Nilgiri Mountain Railway', 'Rose Garden'],
        travelSeason: 'Year-round (Peak: April-June, October-November)',
        sellingTips: [
            'Promote as budget-friendly hill station',
            'Highlight Nilgiri toy train experience',
            'Bundle with Mysore and Coorg',
            'Focus on tea plantation stays'
        ],
        modules: [
            {
                id: 'mod-o1', title: 'Discovering Ooty', description: 'Introduction to the Queen of Hill Stations', order: 1,
                lessons: [
                    { id: 'les-o1-1', title: 'Introduction to Ooty', description: 'Why Ooty remains a timeless destination', videoUrl: '', videoDuration: 380, order: 1, moduleId: 'mod-o1' },
                    { id: 'les-o1-2', title: 'How to Reach Ooty', description: 'Transportation options and routes', videoUrl: '', videoDuration: 300, order: 2, moduleId: 'mod-o1' },
                ]
            },
            {
                id: 'mod-o2', title: 'Must-Visit Places', description: 'Top attractions in Ooty', order: 2,
                lessons: [
                    { id: 'les-o2-1', title: 'Tea Gardens Tour', description: 'Tea factory visits and experiences', videoUrl: '', videoDuration: 420, order: 1, moduleId: 'mod-o2' },
                    { id: 'les-o2-2', title: 'Botanical Garden & Rose Garden', description: 'Famous gardens of Ooty', videoUrl: '', videoDuration: 360, order: 2, moduleId: 'mod-o2' },
                    { id: 'les-o2-3', title: 'Nilgiri Mountain Railway', description: 'UNESCO Heritage train ride', videoUrl: '', videoDuration: 400, order: 3, moduleId: 'mod-o2', quiz: ootyPlacesQuiz },
                ]
            },
            {
                id: 'mod-o3', title: 'Selling Ooty Packages', description: 'Sales strategies for Ooty tourism', order: 3,
                lessons: [
                    { id: 'les-o3-1', title: 'Creating Attractive Packages', description: 'Designing Ooty tour packages', videoUrl: '', videoDuration: 450, order: 1, moduleId: 'mod-o3' },
                    { id: 'les-o3-2', title: 'Upselling & Cross-selling', description: 'Maximizing revenue per customer', videoUrl: '', videoDuration: 400, order: 2, moduleId: 'mod-o3' },
                ]
            }
        ],
        totalDuration: 2710, totalLessons: 7, isPublished: true,
        createdBy: 'admin', createdAt: '2025-01-20', updatedAt: '2025-02-12', category: 'South India', difficulty: 'beginner',
    },
    {
        id: 'course-kodaikanal',
        title: 'Kodaikanal Sales Training',
        destination: 'Kodaikanal',
        description: 'Comprehensive training on Kodaikanal packages. Learn about the Princess of Hill Stations and master selling its unique experiences.',
        thumbnail: '/images/kodaikanal.jpg',
        highlights: ['Kodai Lake', 'Pillar Rocks', 'Coakers Walk', 'Bryant Park', 'Silver Cascade Falls'],
        travelSeason: 'October to June (Peak: April-June)',
        sellingTips: ['Highlight romantic honeymoon appeal', 'Promote homemade chocolate shops', 'Bundle with Madurai temple visit', 'Emphasize adventure trekking packages'],
        modules: [
            {
                id: 'mod-k1', title: 'Kodaikanal Overview', description: 'Getting to know Kodaikanal', order: 1,
                lessons: [
                    { id: 'les-k1-1', title: 'Welcome to Kodaikanal', description: 'Introduction to the Princess of Hill Stations', videoUrl: '', videoDuration: 400, order: 1, moduleId: 'mod-k1' },
                    { id: 'les-k1-2', title: 'Climate & Best Season', description: 'Weather guide and planning tips', videoUrl: '', videoDuration: 320, order: 2, moduleId: 'mod-k1' },
                ]
            },
            {
                id: 'mod-k2', title: 'Attractions & Activities', description: 'Key attractions to sell', order: 2,
                lessons: [
                    { id: 'les-k2-1', title: 'Kodai Lake & Boating', description: 'The iconic star-shaped lake', videoUrl: '', videoDuration: 380, order: 1, moduleId: 'mod-k2' },
                    { id: 'les-k2-2', title: 'Trekking & Nature Walks', description: 'Adventure experiences in Kodai', videoUrl: '', videoDuration: 420, order: 2, moduleId: 'mod-k2' },
                ]
            }
        ],
        totalDuration: 1520, totalLessons: 4, isPublished: true,
        createdBy: 'admin', createdAt: '2025-02-01', updatedAt: '2025-02-15', category: 'South India', difficulty: 'intermediate',
    },
    {
        id: 'course-goa',
        title: 'Goa Premium Packages',
        destination: 'Goa',
        description: 'Sell Goa like a pro. Master premium beach resort packages, water sports, nightlife, and heritage tours in this comprehensive Goa training.',
        thumbnail: '/images/goa.jpg',
        highlights: ['Beach Resorts', 'Water Sports', 'Old Goa Churches', 'Dudhsagar Falls', 'Spice Plantations'],
        travelSeason: 'November to March (Peak: Christmas & New Year)',
        sellingTips: ['Differentiate North Goa vs South Goa', 'Promote luxury resort experiences', 'Highlight honeymoon beach villa packages', 'Push monsoon packages as budget options'],
        modules: [
            {
                id: 'mod-g1', title: 'Goa Essentials', description: 'Foundation knowledge for selling Goa', order: 1,
                lessons: [
                    { id: 'les-g1-1', title: 'Introduction to Goa Tourism', description: 'Why Goa is India\'s top beach destination', videoUrl: '', videoDuration: 450, order: 1, moduleId: 'mod-g1' },
                    { id: 'les-g1-2', title: 'North vs South Goa', description: 'Understanding the two sides of Goa', videoUrl: '', videoDuration: 380, order: 2, moduleId: 'mod-g1' },
                    { id: 'les-g1-3', title: 'Accommodation Types', description: 'Resorts, homestays, villas explained', videoUrl: '', videoDuration: 400, order: 3, moduleId: 'mod-g1' },
                ]
            },
            {
                id: 'mod-g2', title: 'Premium Experiences', description: 'Luxury and premium offerings', order: 2,
                lessons: [
                    { id: 'les-g2-1', title: 'Luxury Beach Resorts', description: 'Top premium resorts to recommend', videoUrl: '', videoDuration: 500, order: 1, moduleId: 'mod-g2' },
                    { id: 'les-g2-2', title: 'Water Sports & Adventures', description: 'Scuba, parasailing, jet ski experiences', videoUrl: '', videoDuration: 420, order: 2, moduleId: 'mod-g2' },
                ]
            },
            {
                id: 'mod-g3', title: 'Closing Goa Sales', description: 'Advanced selling techniques for Goa', order: 3,
                lessons: [
                    { id: 'les-g3-1', title: 'Building Goa Itineraries', description: 'Craft perfect 3, 5, and 7-day plans', videoUrl: '', videoDuration: 480, order: 1, moduleId: 'mod-g3' },
                    { id: 'les-g3-2', title: 'Premium Pricing Strategies', description: 'Selling premium without losing customers', videoUrl: '', videoDuration: 440, order: 2, moduleId: 'mod-g3', quiz: goaSalesQuiz },
                ]
            }
        ],
        totalDuration: 3070, totalLessons: 7, isPublished: true,
        createdBy: 'admin', createdAt: '2025-02-05', updatedAt: '2025-02-18', category: 'West India', difficulty: 'advanced',
    },
    {
        id: 'course-shimla',
        title: 'Shimla Winter Packages',
        destination: 'Shimla',
        description: 'Learn to sell Shimla packages effectively. Cover the colonial charm, Mall Road, snow activities, and Kufri excursions.',
        thumbnail: '/images/shimla.jpg',
        highlights: ['Mall Road', 'Ridge', 'Kufri', 'Christ Church', 'Jakhoo Temple'],
        travelSeason: 'Year-round (Peak: Dec-Feb for snow, May-Jun for summer)',
        sellingTips: ['Bundle with Manali for combo packages', 'Target families and honeymooners', 'Highlight colonial heritage walks', 'Promote toy train from Kalka'],
        modules: [
            {
                id: 'mod-s1', title: 'Shimla Fundamentals', description: 'Getting started with Shimla tourism', order: 1,
                lessons: [
                    { id: 'les-s1-1', title: 'Shimla Heritage Overview', description: 'Colonial history and modern tourism', videoUrl: '', videoDuration: 380, order: 1, moduleId: 'mod-s1' },
                    { id: 'les-s1-2', title: 'Key Attractions', description: 'Mall Road, Ridge, and beyond', videoUrl: '', videoDuration: 420, order: 2, moduleId: 'mod-s1' },
                ]
            },
            {
                id: 'mod-s2', title: 'Selling Shimla', description: 'Sales strategies for Shimla packages', order: 2,
                lessons: [
                    { id: 'les-s2-1', title: 'Package Design & Pricing', description: 'Creating competitive Shimla packages', videoUrl: '', videoDuration: 460, order: 1, moduleId: 'mod-s2' },
                    { id: 'les-s2-2', title: 'Customer Personas', description: 'Understanding your Shimla customers', videoUrl: '', videoDuration: 380, order: 2, moduleId: 'mod-s2' },
                ]
            }
        ],
        totalDuration: 1640, totalLessons: 4, isPublished: true,
        createdBy: 'admin', createdAt: '2025-02-08', updatedAt: '2025-02-20', category: 'North India', difficulty: 'beginner',
    },
    {
        id: 'course-intl',
        title: 'International Destinations',
        destination: 'International',
        description: 'Premium international destination training covering Dubai, Thailand, Singapore, and Bali. Learn to sell high-value international packages.',
        thumbnail: '/images/international.jpg',
        highlights: ['Dubai City Tours', 'Thailand Beaches', 'Singapore Highlights', 'Bali Temples', 'Visa Guidance'],
        travelSeason: 'Varies by destination',
        sellingTips: ['Focus on visa assistance as value-add', 'Highlight flight + hotel combos', 'Upsell travel insurance', 'Emphasize group tour discounts'],
        modules: [
            {
                id: 'mod-i1', title: 'Dubai Essentials', description: 'Selling Dubai tour packages', order: 1,
                lessons: [
                    { id: 'les-i1-1', title: 'Dubai Tourism Overview', description: 'Understanding Dubai as a destination', videoUrl: '', videoDuration: 500, order: 1, moduleId: 'mod-i1' },
                    { id: 'les-i1-2', title: 'Premium Dubai Experiences', description: 'Desert safaris, Burj Khalifa, and more', videoUrl: '', videoDuration: 450, order: 2, moduleId: 'mod-i1' },
                ]
            },
            {
                id: 'mod-i2', title: 'Thailand & Southeast Asia', description: 'Selling SE Asian destinations', order: 2,
                lessons: [
                    { id: 'les-i2-1', title: 'Thailand Packages', description: 'Bangkok, Phuket, and Pattaya', videoUrl: '', videoDuration: 480, order: 1, moduleId: 'mod-i2' },
                    { id: 'les-i2-2', title: 'Singapore & Bali', description: 'Premium island and city experiences', videoUrl: '', videoDuration: 460, order: 2, moduleId: 'mod-i2' },
                ]
            }
        ],
        totalDuration: 1890, totalLessons: 4, isPublished: true,
        createdBy: 'admin', createdAt: '2025-02-10', updatedAt: '2025-02-22', category: 'International', difficulty: 'advanced',
    },
];

// ============ Demo Teams ============
export const demoTeams: Team[] = [
    { id: 'team-south', name: 'South India Team', description: 'Handles South Indian destinations like Ooty, Kodaikanal, and Kerala', managerId: 'user-mgr-1', managerName: 'Priya Sharma', memberIds: ['user-exec-1', 'user-exec-2', 'user-exec-3'], assignedCourseIds: ['course-ooty', 'course-kodaikanal'], createdAt: '2025-01-01' },
    { id: 'team-north', name: 'North India Team', description: 'Handles North Indian destinations like Manali, Shimla, and Kashmir', managerId: 'user-mgr-2', managerName: 'Rahul Verma', memberIds: ['user-exec-4', 'user-exec-5'], assignedCourseIds: ['course-manali', 'course-shimla'], createdAt: '2025-01-05' },
    { id: 'team-premium', name: 'Premium Team', description: 'Handles premium and international destinations', managerId: 'user-mgr-1', managerName: 'Priya Sharma', memberIds: ['user-exec-1', 'user-exec-6'], assignedCourseIds: ['course-goa', 'course-intl'], createdAt: '2025-01-10' },
];

// ============ Demo Users ============
export const demoUsers: UserProfile[] = [
    { uid: 'user-admin', email: 'admin@outbound.com', displayName: 'Admin User', role: 'admin', isActive: true, createdAt: '2025-01-01' },
    { uid: 'user-mgr-1', email: 'priya@outbound.com', displayName: 'Priya Sharma', role: 'manager', teamId: 'team-south', teamName: 'South India Team', isActive: true, createdAt: '2025-01-02' },
    { uid: 'user-mgr-2', email: 'rahul@outbound.com', displayName: 'Rahul Verma', role: 'manager', teamId: 'team-north', teamName: 'North India Team', isActive: true, createdAt: '2025-01-03' },
    { uid: 'user-exec-1', email: 'anu@outbound.com', displayName: 'Anu Krishnan', role: 'executive', teamId: 'team-south', teamName: 'South India Team', isActive: true, createdAt: '2025-01-05' },
    { uid: 'user-exec-2', email: 'deepa@outbound.com', displayName: 'Deepa Nair', role: 'executive', teamId: 'team-south', teamName: 'South India Team', isActive: true, createdAt: '2025-01-06' },
    { uid: 'user-exec-3', email: 'karthik@outbound.com', displayName: 'Karthik Rajan', role: 'executive', teamId: 'team-south', teamName: 'South India Team', isActive: true, createdAt: '2025-01-07' },
    { uid: 'user-exec-4', email: 'arjun@outbound.com', displayName: 'Arjun Singh', role: 'executive', teamId: 'team-north', teamName: 'North India Team', isActive: true, createdAt: '2025-01-08' },
    { uid: 'user-exec-5', email: 'meera@outbound.com', displayName: 'Meera Joshi', role: 'executive', teamId: 'team-north', teamName: 'North India Team', isActive: true, createdAt: '2025-01-09' },
    { uid: 'user-exec-6', email: 'vivek@outbound.com', displayName: 'Vivek Patel', role: 'executive', teamId: 'team-premium', teamName: 'Premium Team', isActive: true, createdAt: '2025-01-10' },
];

// ============ Demo Progress ============
export const demoProgress: UserProgress[] = [
    { id: 'prog-1', userId: 'user-exec-1', courseId: 'course-ooty', completedLessons: ['les-o1-1', 'les-o1-2', 'les-o2-1', 'les-o2-2', 'les-o2-3', 'les-o3-1', 'les-o3-2'], lessonProgress: {}, quizResults: {}, overallProgress: 100, startedAt: '2025-01-20', lastAccessedAt: '2025-02-10', completedAt: '2025-02-10', certificateId: 'cert-1' },
    { id: 'prog-2', userId: 'user-exec-1', courseId: 'course-kodaikanal', completedLessons: ['les-k1-1', 'les-k1-2'], lessonProgress: {}, quizResults: {}, overallProgress: 50, startedAt: '2025-02-01', lastAccessedAt: '2025-02-18' },
    { id: 'prog-3', userId: 'user-exec-2', courseId: 'course-ooty', completedLessons: ['les-o1-1', 'les-o1-2', 'les-o2-1'], lessonProgress: {}, quizResults: {}, overallProgress: 43, startedAt: '2025-01-25', lastAccessedAt: '2025-02-15' },
    { id: 'prog-4', userId: 'user-exec-4', courseId: 'course-manali', completedLessons: ['les-m1-1', 'les-m1-2', 'les-m1-3', 'les-m2-1', 'les-m2-2', 'les-m2-3', 'les-m3-1', 'les-m3-2'], lessonProgress: {}, quizResults: {}, overallProgress: 100, startedAt: '2025-01-15', lastAccessedAt: '2025-02-05', completedAt: '2025-02-05', certificateId: 'cert-2' },
    { id: 'prog-5', userId: 'user-exec-5', courseId: 'course-manali', completedLessons: ['les-m1-1', 'les-m1-2', 'les-m1-3', 'les-m2-1'], lessonProgress: {}, quizResults: {}, overallProgress: 50, startedAt: '2025-02-01', lastAccessedAt: '2025-02-19' },
    { id: 'prog-6', userId: 'user-exec-6', courseId: 'course-goa', completedLessons: ['les-g1-1', 'les-g1-2'], lessonProgress: {}, quizResults: {}, overallProgress: 29, startedAt: '2025-02-10', lastAccessedAt: '2025-02-20' },
];

// ============ Demo Certificates ============
export const demoCertificates: Certificate[] = [
    { id: 'cert-1', userId: 'user-exec-1', userName: 'Anu Krishnan', courseId: 'course-ooty', courseName: 'Ooty Travel Guide', destination: 'Ooty', completedAt: '2025-02-10', issuedAt: '2025-02-10', certificateNumber: 'OT-2025-0001' },
    { id: 'cert-2', userId: 'user-exec-4', userName: 'Arjun Singh', courseId: 'course-manali', courseName: 'Manali Travel Training', destination: 'Manali', completedAt: '2025-02-05', issuedAt: '2025-02-05', certificateNumber: 'OT-2025-0002' },
];

// ============ Demo Access Requests ============
export const demoAccessRequests: AccessRequest[] = [
    { id: 'req-1', userId: 'user-exec-3', userName: 'Karthik Rajan', userEmail: 'karthik@outbound.com', courseId: 'course-goa', courseName: 'Goa Premium Packages', requestedAt: '2025-02-20', status: 'pending', message: 'I want to learn about Goa packages for upcoming summer season sales.' },
    { id: 'req-2', userId: 'user-exec-2', userName: 'Deepa Nair', userEmail: 'deepa@outbound.com', courseId: 'course-manali', courseName: 'Manali Travel Training', requestedAt: '2025-02-19', status: 'pending', message: 'Would like to cross-train on North India destinations.' },
    { id: 'req-3', userId: 'user-exec-5', userName: 'Meera Joshi', userEmail: 'meera@outbound.com', courseId: 'course-intl', courseName: 'International Destinations', requestedAt: '2025-02-18', status: 'approved', reviewedBy: 'user-admin', reviewedAt: '2025-02-19', grantedLessonIds: ['les-i1-1', 'les-i1-2'], message: 'Need access to Dubai section for client meeting.' },
    { id: 'req-4', userId: 'user-exec-6', userName: 'Vivek Patel', userEmail: 'vivek@outbound.com', courseId: 'course-ooty', courseName: 'Ooty Travel Guide', requestedAt: '2025-02-17', status: 'rejected', reviewedBy: 'user-admin', reviewedAt: '2025-02-18', adminNote: 'Not part of South India team. Please speak with your manager first.' },
];

// ============ Helpers ============
export const getCoursesForTeam = (teamId: string): Course[] => {
    const team = demoTeams.find(t => t.id === teamId);
    if (!team) return [];
    return demoCourses.filter(c => team.assignedCourseIds.includes(c.id));
};

export const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const hrs = Math.floor(mins / 60);
    const remainMins = mins % 60;
    if (hrs > 0) return `${hrs}h ${remainMins}m`;
    return `${mins}m`;
};

export const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
};
