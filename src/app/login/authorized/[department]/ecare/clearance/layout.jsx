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
          <a href={'/login/authorized/'+Department+'/ecare/clearance/accounts'} className={`${styles.NavButton}`}>Accounts</a>
        </div>  

        <div className={styles.Body}>
          {prop.children}
        </div>

    </div>
  );
}
