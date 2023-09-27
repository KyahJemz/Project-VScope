"use client"

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const Authorized = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === 'loading'){
      console.log('-----AUTHORIZED', session)
      return <div>Loading...</div>
    }

    if (status === 'authenticated') {
      console.log('-----AUTHORIZED', session)
      if (session.UserData?.Department) {
        router.push('/authorized/'+session.UserData.Department);
      } else {
        router.push('/login');
      }
    }

    if (!session){
      router.push('/login');
    }

    return <div>end</div>
};

export default Authorized;

