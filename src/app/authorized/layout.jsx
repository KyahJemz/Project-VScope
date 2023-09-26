"use client"

import React from 'react';
import { useSession } from 'next-auth/react';
import AuthProvider from '@/components/AuthProvider/AuthProvider.jsx';
import { useRouter } from 'next/navigation';

const Layout = ({ children }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    router.push('/login');
  } 

  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};

export default Layout;
