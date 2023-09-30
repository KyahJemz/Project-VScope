"use client"

import React from "react";
import styles from "./page.module.css";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { notFound } from "next/navigation";

const Services = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <div>Session Loading...</div>;
  } 

  if (!session) {
    router.push('/login');
  }

  if (status === 'authenticated'){
    const fetcher = (...args) => fetch(...args).then((res) => res.json());
    
    const { data, mutate, error, isLoading } =  useSWR(
        `/api/appointments?GoogleEmail=${encodeURIComponent(GoogleEmail)}&Department=${encodeURIComponent(department)}`,
        fetcher
    );
    console.log (response);

    // if () {
    //   return (
    //     <div className={styles.container}>
    //       <h3 className={styles.mainTitle}>Services</h3>
    //       <h3 className={styles.selectTitle}>Click down below:</h3>
    //       <div className={styles.items}>
    //         <Link href="/services/Medical" className={styles.item}>
    //           <span className={styles.title}>Medical</span>
    //         </Link>
    //         <Link href="/services/Dental" className={styles.item}>
    //           <span className={styles.title}>Dental</span>
    //         </Link>
    //         <Link href="/services/SDPC" className={styles.item}>
    //           <span className={styles.title}>SDPC</span>
    //         </Link>
    //       </div>
    //     </div>
    //   );
    // } else {
    //   return <div>Validation Loading...</div>;
    // }
  }
};

export default Services;
