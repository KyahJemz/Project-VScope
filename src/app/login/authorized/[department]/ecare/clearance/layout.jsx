"use client"

import styles from "./page.module.css";
import React, { useState } from "react";

export default function RootLayout(prop) {
  const Department = prop.params.department;

  return (
    <div className={styles.MainContainer}>

        <div className={styles.Header}>
          Clearance
        </div>

        <div className={styles.Nav}>  
          <a href={'/login/authorized/'+Department+'/ecare/clearance/notifications'} className={`${styles.NavButton}`}>Notifications</a>
          <a href={'/login/authorized/'+Department+'/ecare/clearance/walkins'} className={`${styles.NavButton}`}>Walk Ins</a>
          <a href={'/login/authorized/'+Department+'/ecare/clearance/appointments'} className={`${styles.NavButton}`}>Appointments</a>
        </div>  

        <div className={styles.Body}>
          {prop.children}
        </div>

    </div>
  );
}
