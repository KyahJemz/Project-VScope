"use client"

import React, { useState } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import { useRouter  } from "next/navigation";

const formatDate = (timestamp) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = new Date(timestamp).toLocaleDateString(undefined, options);

  const hours = new Date(timestamp).getHours();
  const minutes = new Date(timestamp).getMinutes();
  const amOrPm = hours >= 12 ? 'pm' : 'am';
  const formattedTime = `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')}${amOrPm}`;

  return `${formattedDate} ${formattedTime}`;
};

const ecare = ({ params }) => {
    const Department = params.department;
    const router = useRouter();

    const SideNavigation = () => {
      <div className={styles.SideNavigations}>
        <Link className={`${styles.Button} ${styles.SideNavigation}`} onClick={setActivePanel("WALKINS")}>WALKINS</Link>
        <Link className={`${styles.Button} ${styles.SideNavigation}`} onClick={setActivePanel("MESSAGES")}>MESSAGES</Link>
        <Link className={`${styles.Button} ${styles.SideNavigation}`} onClick={setActivePanel("CLEARANCES")}>CLEARANCES</Link>
        <Link className={`${styles.Button} ${styles.SideNavigation}`} onClick={setActivePanel("PROGRESS")}>PROGRESS</Link>
      </div>
    };

    
  return (
    <div className={styles.mainContainer}>
      <h1>{Department}</h1>
      <h3 className={styles.title}>e-CARE</h3>
      
     
    </div>
  );
};

export default ecare;
