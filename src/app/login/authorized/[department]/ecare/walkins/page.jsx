"use client"

import React, { useState } from "react";
import styles from "./page.module.css";
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

    const {ActivePanel, setActivePanel} = useState("WALKINS");

    const SideNavigation = () => {
      <div className={styles.SideNavigations}>
        <button className={`${styles.Button} ${styles.SideNavigation}`} onClick={setActivePanel("WALKINS")}>WALKINS</button>
        <button className={`${styles.Button} ${styles.SideNavigation}`} onClick={setActivePanel("MESSAGES")}>MESSAGES</button>
        <button className={`${styles.Button} ${styles.SideNavigation}`} onClick={setActivePanel("CLEARANCES")}>CLEARANCES</button>
        <button className={`${styles.Button} ${styles.SideNavigation}`} onClick={setActivePanel("PROGRESS")}>PROGRESS</button>
      </div>
    };

    const WALKINS = () => {
      <div className={styles.Panel}>
        
      </div>
    };

    const MESSAGES = () => {
      <div className={styles.Panel}>
        
      </div>
    };

    const CLEARANCES = () => {
      <div className={styles.Panel}>
        
      </div>
    };

    const PROGRESS = () => {
      <div className={styles.Panel}>
        
      </div>
    };

  return (
    <div className={styles.mainContainer}>
      
     
    </div>
  );
};

export default ecare;
