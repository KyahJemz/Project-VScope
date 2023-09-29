"use client"

import React from 'react';
import { useSession } from 'next-auth/react';
import AuthProvider from '@/components/AuthProvider/AuthProvider.jsx';
import { useRouter } from 'next/navigation';

const Layout = ({ children }) => {
  // const { data: session, status } = useSession();
  // const router = useRouter();
  
  // if (status === 'loading') {
  //   return <div>Loading...</div>;
  // }

  // if (status === 'authenticated'){
  //   if(session.UserDate?.Department){
  //     router.push('/authorized/'+session.UserDate.Department);
  //   }
  // }

  // if (!session) {
  //   router.push('/login');
  // }

  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};

export default Layout;
