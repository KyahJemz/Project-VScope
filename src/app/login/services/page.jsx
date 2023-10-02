"use client"

import React from "react";
import styles from "./page.module.css";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const Services = () => {
  const {data: session} = useSession({
    required: true, 
    onUnauthenticated() {
      redirect('/login?callbackUrl=/login/services');
    }
  })

    return (
      <div className={styles.container}>
        <h3 className={styles.mainTitle}>Services</h3>
        <h3 className={styles.selectTitle}>Click down below:</h3>
        <div className={styles.items}>
          <Link href="/login/services/Medical" className={styles.item}>
            <span className={styles.title}>Medical</span>
          </Link>
          <Link href="/login/services/Dental" className={styles.item}>
            <span className={styles.title}>Dental</span>
          </Link>
          <Link href="/login/services/SDPC" className={styles.item}>
            <span className={styles.title}>SDPC</span>
          </Link>
        </div>
      </div>
    );
};

export default Services;
