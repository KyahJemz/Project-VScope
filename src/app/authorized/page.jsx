"use client"

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

async function redirect(email){
    const router = useRouter();
    try {
      const response = await fetch(`/api/access?GoogleEmail=${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        return router.push(`/authorized/${data.data[0].Department}`);
      } else {
        return router.push('/login');
      }
    } catch (error) {
      return router.push(`/login?Error=${error.message}`);
    }
}

const Authorized = () => {
    const { data: session, status } = useSession();

    if (status === 'authenticated') {
        const Email = session.user.email;
        console.log(Email);
        return redirect(Email); 
    }
};

export default Authorized;

