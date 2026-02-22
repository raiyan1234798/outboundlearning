'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import { demoCourses } from '@/lib/demoData';
import {
    HiOutlinePlusCircle,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineEye,
    HiOutlineBookOpen,
    HiOutlineClock,
    HiOutlineGlobeAlt,
    HiOutlineCheckCircle,
    HiOutlineXCircle,
    HiOutlineSearch,
} from 'react-icons/hi';
import { formatDuration } from '@/lib/demoData';

export default function AdminCoursesPage() {
    const { userProfile, loading, user, isAdmin } = useAuth();
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [showBuilder, setShowBuilder] = useState(false);
    const [courseName, setCourseName] = useState('');
    const [courseDesc, setCourseDesc] = useState('');
    const [destination, setDestination] = useState('');
    const [category, setCategory] = useState('');
    const [difficulty, setDifficulty] = useState('beginner');
    const [travelSeason, setTravelSeason] = useState('');
    const [modules, setModules] = useState([
        { id: 'mod-new-1', title: '', description: '', lessons: [{ id: 'les-new-1', title: '', videoUrl: '' }] }
    ]);

    const [courses, setCourses] = useState(demoCourses);
    const [editingCourseId, setEditingCourseId] = useState<string | null>(null);

    useEffect(() => {
        if (!loading && !user) router.replace('/login');
    }, [loading, user, router]);

    if (loading || !userProfile) {
        return <div className="loading-screen"><div className="loading-spinner" /></div>;
    }

    const filtered = courses.filter(c =>
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.destination.toLowerCase().includes(search.toLowerCase())
    );

    const resetForm = () => {
        setCourseName('');
        setCourseDesc('');
        setDestination('');
        setCategory('');
        setDifficulty('beginner');
        setTravelSeason('');
        setModules([
            { id: 'mod-new-1', title: '', description: '', lessons: [{ id: 'les-new-1', title: '', videoUrl: '' }] }
        ]);
        setEditingCourseId(null);
    };

    const handleEdit = (course: any) => {
        setCourseName(course.title);
        setCourseDesc(course.description);
        setDestination(course.destination);
        setCategory(course.category);
        setDifficulty(course.difficulty);
        setTravelSeason(course.travelSeason);
        setModules(course.modules.length ? JSON.parse(JSON.stringify(course.modules)) : [{ id: 'mod-new-1', title: '', description: '', lessons: [{ id: 'les-new-1', title: '', videoUrl: '' }] }]);
        setEditingCourseId(course.id);
        setShowBuilder(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this course?")) {
            setCourses(courses.filter(c => c.id !== id));
        }
    };


    const addModule = () => {
        setModules([...modules, {
            id: `mod-new-${modules.length + 1}`,
            title: '',
            description: '',
            lessons: [{ id: `les-new-${Date.now()}`, title: '', videoUrl: '' }]
        }]);
    };

    const addLesson = (modIndex: number) => {
        const updated = [...modules];
        updated[modIndex].lessons.push({
            id: `les-new-${Date.now()}`,
            title: '',
            videoUrl: ''
        });
        setModules(updated);
    };

    const removeModule = (modIndex: number) => {
        setModules(modules.filter((_, i) => i !== modIndex));
    };

    const removeLesson = (modIndex: number, lesIndex: number) => {
        const updated = [...modules];
        updated[modIndex].lessons = updated[modIndex].lessons.filter((_, i) => i !== lesIndex);
        setModules(updated);
    };

    return (
        <AppLayout pageTitle="Course Builder">
            {!showBuilder ? (
                <>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                            <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>Manage Courses</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Create, edit, and manage destination training courses.</p>
                        </div>
                        <button className="btn-primary-custom" onClick={() => { resetForm(); setShowBuilder(true); }}>
                            <HiOutlinePlusCircle /> Create Course
                        </button>
                    </div>

                    {/* Search */}
                    <div className="search-bar" style={{ marginBottom: '20px', maxWidth: '400px' }}>
                        <HiOutlineSearch className="search-icon" />
                        <input
                            placeholder="Search courses..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Courses Table */}
                    <div className="card-custom">
                        <div className="card-body-content" style={{ padding: 0 }}>
                            <div style={{ overflowX: 'auto' }}>
                                <table className="table-custom">
                                    <thead>
                                        <tr>
                                            <th>Course</th>
                                            <th>Category</th>
                                            <th>Lessons</th>
                                            <th>Duration</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map(course => (
                                            <tr key={course.id}>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <div style={{
                                                            width: '36px', height: '36px', borderRadius: '8px',
                                                            background: 'var(--primary-lighter)', display: 'flex',
                                                            alignItems: 'center', justifyContent: 'center',
                                                            color: 'var(--primary)', fontSize: '18px'
                                                        }}>
                                                            <HiOutlineGlobeAlt />
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: 600 }}>{course.title}</div>
                                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{course.destination}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="badge-custom info">{course.category}</span>
                                                </td>
                                                <td>{course.totalLessons}</td>
                                                <td>{formatDuration(course.totalDuration)}</td>
                                                <td>
                                                    <span className={`badge-custom ${course.isPublished ? 'success' : 'warning'}`}>
                                                        {course.isPublished ? 'Published' : 'Draft'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '6px' }}>
                                                        <button className="btn-ghost" style={{ padding: '6px 8px' }}
                                                            onClick={() => router.push(`/courses/${course.id}`)}>
                                                            <HiOutlineEye />
                                                        </button>
                                                        <button
                                                            className="btn-ghost"
                                                            style={{ padding: '6px 8px' }}
                                                            onClick={() => handleEdit(course)}
                                                            title="Edit Course"
                                                        >
                                                            <HiOutlinePencil />
                                                        </button>
                                                        <button
                                                            className="btn-ghost"
                                                            style={{ padding: '6px 8px', color: 'var(--accent-red)' }}
                                                            onClick={() => handleDelete(course.id)}
                                                            title="Delete Course"
                                                        >
                                                            <HiOutlineTrash />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                /* Course Builder */
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <div>
                            <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>{editingCourseId ? 'Edit Course' : 'Create New Course'}</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Build a destination training course with modules and lessons.</p>
                        </div>
                        <button className="btn-ghost" onClick={() => { setShowBuilder(false); resetForm(); }}>Cancel</button>
                    </div>

                    {/* Course Details */}
                    <div className="card-custom" style={{ marginBottom: '20px' }}>
                        <div className="card-body-content">
                            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Course Details</h3>
                            <div className="row g-3">
                                <div className="col-12 col-md-6">
                                    <div className="form-group-custom">
                                        <label>Course Title</label>
                                        <input placeholder="e.g., Manali Travel Training" value={courseName} onChange={e => setCourseName(e.target.value)} />
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="form-group-custom">
                                        <label>Destination</label>
                                        <input placeholder="e.g., Manali" value={destination} onChange={e => setDestination(e.target.value)} />
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="form-group-custom">
                                        <label>Description</label>
                                        <input placeholder="Course description..." value={courseDesc} onChange={e => setCourseDesc(e.target.value)} />
                                    </div>
                                </div>
                                <div className="col-12 col-md-4">
                                    <div className="form-group-custom">
                                        <label>Category</label>
                                        <input placeholder="e.g., North India" value={category} onChange={e => setCategory(e.target.value)} />
                                    </div>
                                </div>
                                <div className="col-12 col-md-4">
                                    <div className="form-group-custom">
                                        <label>Difficulty</label>
                                        <select
                                            style={{
                                                width: '100%', padding: '12px 16px',
                                                border: '1.5px solid var(--border-color)',
                                                borderRadius: 'var(--border-radius-sm)',
                                                fontFamily: 'Poppins, sans-serif', fontSize: '14px',
                                                outline: 'none', background: 'white'
                                            }}
                                            value={difficulty}
                                            onChange={e => setDifficulty(e.target.value)}
                                        >
                                            <option value="beginner">Beginner</option>
                                            <option value="intermediate">Intermediate</option>
                                            <option value="advanced">Advanced</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-12 col-md-4">
                                    <div className="form-group-custom">
                                        <label>Travel Season</label>
                                        <input placeholder="e.g., October to June" value={travelSeason} onChange={e => setTravelSeason(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Modules */}
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Modules & Lessons</h3>
                            <button className="btn-secondary-custom" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={addModule}>
                                <HiOutlinePlusCircle /> Add Module
                            </button>
                        </div>

                        {modules.map((mod, modIdx) => (
                            <div className="card-custom" key={mod.id} style={{ marginBottom: '12px' }}>
                                <div className="card-body-content">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{
                                                width: '28px', height: '28px', borderRadius: '50%',
                                                background: 'var(--primary)', color: 'white',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '12px', fontWeight: 700
                                            }}>
                                                {modIdx + 1}
                                            </span>
                                            <h4 style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>Module {modIdx + 1}</h4>
                                        </div>
                                        {modules.length > 1 && (
                                            <button className="btn-ghost" style={{ padding: '4px 8px', color: 'var(--accent-red)' }} onClick={() => removeModule(modIdx)}>
                                                <HiOutlineTrash />
                                            </button>
                                        )}
                                    </div>

                                    <div className="row g-2 mb-3">
                                        <div className="col-12 col-md-6">
                                            <input
                                                placeholder="Module title"
                                                value={mod.title}
                                                onChange={e => {
                                                    const u = [...modules];
                                                    u[modIdx].title = e.target.value;
                                                    setModules(u);
                                                }}
                                                style={{
                                                    width: '100%', padding: '10px 14px',
                                                    border: '1.5px solid var(--border-color)',
                                                    borderRadius: 'var(--border-radius-sm)',
                                                    fontFamily: 'Poppins, sans-serif', fontSize: '13px',
                                                    outline: 'none'
                                                }}
                                            />
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <input
                                                placeholder="Module description"
                                                value={mod.description}
                                                onChange={e => {
                                                    const u = [...modules];
                                                    u[modIdx].description = e.target.value;
                                                    setModules(u);
                                                }}
                                                style={{
                                                    width: '100%', padding: '10px 14px',
                                                    border: '1.5px solid var(--border-color)',
                                                    borderRadius: 'var(--border-radius-sm)',
                                                    fontFamily: 'Poppins, sans-serif', fontSize: '13px',
                                                    outline: 'none'
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Lessons */}
                                    <div style={{
                                        background: 'var(--gray-50)',
                                        borderRadius: '8px',
                                        padding: '12px'
                                    }}>
                                        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                                            LESSONS
                                        </div>
                                        {mod.lessons.map((les, lesIdx) => (
                                            <div key={les.id} style={{
                                                display: 'flex',
                                                gap: '8px',
                                                marginBottom: '8px',
                                                alignItems: 'center'
                                            }}>
                                                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', width: '24px' }}>
                                                    {lesIdx + 1}.
                                                </span>
                                                <input
                                                    placeholder="Lesson title"
                                                    value={les.title}
                                                    onChange={e => {
                                                        const u = [...modules];
                                                        u[modIdx].lessons[lesIdx].title = e.target.value;
                                                        setModules(u);
                                                    }}
                                                    style={{
                                                        flex: 1, padding: '8px 12px',
                                                        border: '1px solid var(--border-color)',
                                                        borderRadius: '6px',
                                                        fontFamily: 'Poppins, sans-serif', fontSize: '13px',
                                                        outline: 'none', background: 'white'
                                                    }}
                                                />
                                                <input
                                                    placeholder="Video URL (Drive/Vimeo)"
                                                    value={les.videoUrl}
                                                    onChange={e => {
                                                        const u = [...modules];
                                                        u[modIdx].lessons[lesIdx].videoUrl = e.target.value;
                                                        setModules(u);
                                                    }}
                                                    style={{
                                                        flex: 1, padding: '8px 12px',
                                                        border: '1px solid var(--border-color)',
                                                        borderRadius: '6px',
                                                        fontFamily: 'Poppins, sans-serif', fontSize: '13px',
                                                        outline: 'none', background: 'white'
                                                    }}
                                                />
                                                {mod.lessons.length > 1 && (
                                                    <button
                                                        onClick={() => removeLesson(modIdx, lesIdx)}
                                                        style={{
                                                            background: 'none', border: 'none',
                                                            color: 'var(--accent-red)', cursor: 'pointer',
                                                            padding: '4px'
                                                        }}
                                                    >
                                                        <HiOutlineXCircle />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            className="btn-ghost"
                                            style={{ fontSize: '12px', padding: '4px 10px', marginTop: '4px' }}
                                            onClick={() => addLesson(modIdx)}
                                        >
                                            <HiOutlinePlusCircle /> Add Lesson
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Save */}
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                        <button className="btn-secondary-custom" onClick={() => { setShowBuilder(false); resetForm(); }}>
                            Cancel
                        </button>
                        <button className="btn-primary-custom" onClick={() => {
                            if (editingCourseId) {
                                setCourses(courses.map(c => c.id === editingCourseId ? { ...c, title: courseName, description: courseDesc, destination, category, difficulty: difficulty as any, travelSeason, modules: modules as any } : c));
                                alert('Course updated successfully!');
                            } else {
                                const newCourse = {
                                    id: `course-${Date.now()}`,
                                    title: courseName,
                                    description: courseDesc,
                                    destination,
                                    category,
                                    difficulty: difficulty as any,
                                    travelSeason,
                                    modules: modules as any,
                                    thumbnail: 'https://images.unsplash.com/photo-auto?q=80&w=800',
                                    highlights: [],
                                    sellingTips: [],
                                    totalDuration: 0,
                                    totalLessons: modules.reduce((acc, m) => acc + m.lessons.length, 0),
                                    isPublished: true,
                                    createdBy: userProfile.uid,
                                    createdAt: new Date().toISOString(),
                                    updatedAt: new Date().toISOString()
                                };
                                setCourses([...courses, newCourse]);
                                alert('Course created successfully!');
                            }
                            setShowBuilder(false);
                            resetForm();
                        }}>
                            <HiOutlineCheckCircle /> {editingCourseId ? 'Save Changes' : 'Publish Course'}
                        </button>
                    </div>
                </>
            )}
        </AppLayout>
    );
}
