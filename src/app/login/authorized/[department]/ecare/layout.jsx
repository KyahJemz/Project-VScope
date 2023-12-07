"use client"

import styles from "./page.module.css";
import React, { useState } from "react";

export default function RootLayout(prop) {
  const Department = prop.params.department;

  return (
    <div className={styles.mainContainer}>

        <div className={styles.MiniNav}>  
          <div className={styles.MiniNavTop}>
            <a href={'/login/authorized/'+Department+'/ecare/walkins'} className={`${styles.MiniNavButton}`}>WALK INS</a>
            <a href={'/login/authorized/'+Department+'/ecare/messages'} className={`${styles.MiniNavButton}`}>MESSAGES</a>
            <a href={'/login/authorized/'+Department+'/ecare/clearance'} className={`${styles.MiniNavButton}`}>CLEARANCE</a>
            <a href={'/login/authorized/'+Department+'/ecare/progress'} className={`${styles.MiniNavButton}`}>PROGRESS</a>
          </div>
        </div>  

        {prop.children}

    </div>
  );
}
