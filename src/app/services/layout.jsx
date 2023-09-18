"use client"

import React from 'react';
import { useSession } from 'next-auth/react';
import AuthProvider from '@/components/AuthProvider/AuthProvider.jsx';

const Layout = ({ children }) => {
  // const { data: session, status } = useSession();
  // if (status === 'loading') {
  //   return <div>Loading...</div>;
  // }
  // if (!session) {
  //   return window.location.href = '/login';
  // }
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};

export default Layout;
