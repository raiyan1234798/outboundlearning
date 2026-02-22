'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="loading-screen">
      <div className="home-loading-wrapper">
        <div className="loading-spinner home-loading-spinner" />
        <p className="home-loading-text">Loading Outbound Travelers...</p>
      </div>
    </div>
  );
}
