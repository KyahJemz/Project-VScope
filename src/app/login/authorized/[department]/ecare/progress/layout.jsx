"use client"

import styles from "./page.module.css";
import React, { useState } from "react";

export default function RootLayout(prop) {
  const Department = prop.params.department;

  return (
    <div className={styles.MainContainer}>

        <div className={styles.Header}>
          Progress
        </div>

        <div className={styles.Nav}>  
          <a href={'/login/authorized/'+Department+'/ecare/progress/walkins'} className={`${styles.NavButton}`}>Walk Ins</a>
          <a href={'/login/authorized/'+Department+'/ecare/progress/appointments'} className={`${styles.NavButton}`}>Appointments</a>
          <a href={'/login/authorized/'+Department+'/ecare/progress/prescriptions'} className={`${styles.NavButton}`}>Prescriptions</a>
        </div>  

        <div className={styles.Body}>
          {prop.children}
        </div>

    </div>
  );
}