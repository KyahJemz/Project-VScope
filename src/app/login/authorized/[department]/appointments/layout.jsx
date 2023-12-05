"use client"

import styles from "./page.module.css";
import React, { useState } from "react";

export default function RootLayout(prop) {
  const Department = prop.params.department;

  return (
    <div className={styles.mainContainer}>

        <div className={styles.MiniNav}>  
          <div className={styles.MiniNavTop}>
            <a href={'/login/authorized/'+Department+'/appointments/pending'} className={`${styles.MiniNavButton}`}>PENDING</a>
            <a href={'/login/authorized/'+Department+'/appointments/approved'} className={`${styles.MiniNavButton}`}>APPROVED</a>
            <a href={'/login/authorized/'+Department+'/appointments/canceled'} className={`${styles.MiniNavButton}`}>CANCELED</a>
            <a href={'/login/authorized/'+Department+'/appointments/rejected'} className={`${styles.MiniNavButton}`}>REJECTED</a>
          </div>
          <div className={styles.MiniNavBot}>
          <a href={'/login/authorized/'+Department+'/appointments/schedule'} className={styles.MiniNavButton}>SET SCHEDULE</a>
          </div>
        </div>  

        {prop.children}

    </div>
  );
}
