'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import { demoCertificates, demoCourses } from '@/lib/demoData';
import {
    HiOutlineAcademicCap,
    HiOutlineDownload,
    HiOutlineEye,
    HiOutlineGlobeAlt,
} from 'react-icons/hi';

export default function CertificatesPage() {
    const { userProfile, loading, user } = useAuth();
    const router = useRouter();
    const [selectedCert, setSelectedCert] = useState<string | null>(null);
    const certRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!loading && !user) router.replace('/login');
    }, [loading, user, router]);

    if (loading || !userProfile) {
        return <div className="loading-screen"><div className="loading-spinner" /></div>;
    }

    const isAdmin = userProfile.role === 'admin';
    const certs = isAdmin ? demoCertificates : demoCertificates.filter(c => c.userId === userProfile.uid);

    const selected = certs.find(c => c.id === selectedCert);

    const handleDownload = async () => {
        // In production, use jsPDF + html2canvas
        window.print();
    };

    return (
        <AppLayout pageTitle="Certificates">
            {!selectedCert ? (
                <>
                    <div style={{ marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>My Certificates</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                            Certificates earned upon completing destination training courses.
                        </p>
                    </div>

                    {certs.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon"><HiOutlineAcademicCap /></div>
                            <h3>No Certificates Yet</h3>
                            <p>Complete your assigned courses to earn certificates. You need to watch all video lessons fully.</p>
                            <button className="btn-primary-custom" onClick={() => router.push('/courses')}>
                                Go to Courses
                            </button>
                        </div>
                    ) : (
                        <div className="row g-3">
                            {certs.map(cert => (
                                <div className="col-12 col-md-6" key={cert.id}>
                                    <div className="card-custom" style={{ cursor: 'pointer' }}>
                                        <div className="card-body-content">
                                            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                                <div style={{
                                                    width: '60px',
                                                    height: '60px',
                                                    borderRadius: '12px',
                                                    background: 'var(--primary-gradient)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                    fontSize: '28px',
                                                    flexShrink: 0
                                                }}>
                                                    <HiOutlineAcademicCap />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>
                                                        {cert.courseName}
                                                    </div>
                                                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                                        Destination: {cert.destination} • #{cert.certificateNumber}
                                                    </div>
                                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                                                        Completed: {new Date(cert.completedAt).toLocaleDateString('en-IN', {
                                                            year: 'numeric', month: 'long', day: 'numeric'
                                                        })}
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button
                                                            className="btn-primary-custom"
                                                            style={{ padding: '8px 16px', fontSize: '13px' }}
                                                            onClick={() => setSelectedCert(cert.id)}
                                                        >
                                                            <HiOutlineEye /> View
                                                        </button>
                                                        <button
                                                            className="btn-secondary-custom"
                                                            style={{ padding: '8px 16px', fontSize: '13px' }}
                                                            onClick={handleDownload}
                                                        >
                                                            <HiOutlineDownload /> Download
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            ) : selected ? (
                <>
                    <button
                        className="btn-ghost"
                        onClick={() => setSelectedCert(null)}
                        style={{ marginBottom: '24px' }}
                    >
                        ← Back to Certificates
                    </button>

                    {/* Certificate View */}
                    <div ref={certRef} className="certificate-container" style={{ marginBottom: '24px' }}>
                        <div className="certificate-header">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
                                <div style={{
                                    width: '44px', height: '44px', borderRadius: '10px',
                                    background: 'var(--primary-gradient)', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                    color: 'white', fontSize: '20px'
                                }}>
                                    <HiOutlineGlobeAlt />
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--primary)' }}>Outbound</div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Travelers</div>
                                </div>
                            </div>
                            <h1 className="certificate-title">Certificate of Completion</h1>
                            <div className="certificate-subtitle">Training Achievement</div>
                        </div>

                        <div className="certificate-body">
                            <p className="certificate-text">This is to certify that</p>
                            <div className="certificate-name">{selected.userName}</div>
                            <p className="certificate-text">has successfully completed the training course</p>
                            <div className="certificate-course">{selected.courseName}</div>
                            <p className="certificate-text" style={{ marginTop: '8px' }}>
                                Destination: <strong>{selected.destination}</strong>
                            </p>
                            <div className="certificate-date">
                                Completed on {new Date(selected.completedAt).toLocaleDateString('en-IN', {
                                    year: 'numeric', month: 'long', day: 'numeric'
                                })}
                            </div>
                        </div>

                        <div className="certificate-footer">
                            <div className="certificate-seal">
                                <HiOutlineAcademicCap />
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                    Certificate No: {selected.certificateNumber}
                                </div>
                            </div>
                            <div className="certificate-signature">
                                <div className="sig-line" />
                                <div className="sig-name">Outbound Travelers</div>
                                <div className="sig-title">Training Department</div>
                            </div>
                        </div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <button className="btn-primary-custom" onClick={handleDownload}>
                            <HiOutlineDownload /> Download Certificate
                        </button>
                    </div>
                </>
            ) : null}
        </AppLayout>
    );
}
