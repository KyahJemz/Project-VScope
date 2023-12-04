"use client"

import styles from "./page.module.css";
import React, { useState } from "react";

export default function RootLayout(prop) {
  const Department = prop.params.department;

  const [panel, setPanel] = useState("Pending");

  return (
    <div className={styles.mainContainer}>

        <div className={styles.MiniNav}>  
          <div className={styles.MiniNavTop}>
            <a href={'/login/authorized/'+Department+'/appointments/pending'} className={`${styles.MiniNavButton} ${panel === "Pending" ? styles.active : null}`} onClick={()=>setPanel("Pending")}>PENDING</a>
            <a href={'/login/authorized/'+Department+'/appointments/approved'} className={`${styles.MiniNavButton} ${panel === "Approved" ? styles.active : null}`} onClick={()=>setPanel("Approved")}>APPROVED</a>
            <a href={'/login/authorized/'+Department+'/appointments/canceled'} className={`${styles.MiniNavButton} ${panel === "Canceled" ? styles.active : null}`} onClick={()=>setPanel("Canceled")}>CANCELED</a>
            <a href={'/login/authorized/'+Department+'/appointments/rejected'} className={`${styles.MiniNavButton} ${panel === "Rejected" ? styles.active : null}`} onClick={()=>setPanel("Rejected")}>REJECTED</a>
          </div>
          <div className={styles.MiniNavBot}>
          <a href={'/login/authorized/'+Department+'/appointments/schedule'} className={styles.MiniNavButton}>SET SCHEDULE</a>
          </div>
        </div>  

        {prop.children}

    </div>
  );
}
