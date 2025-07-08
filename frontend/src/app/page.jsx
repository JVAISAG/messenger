'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/utils/Auth';
import Home from './Home';

function AuthWrapper() {
  const { checkAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (checkAuth()) {
      router.push('/dashboard'); // Redirect after mount
    }
  }, []);

  return <Home />;
}

export default function Page() {
  return (
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  );
}
