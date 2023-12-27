"use client"

import React from "react";
import styles from "./page.module.css"

const Layout = ({ children }) => {
  return (
    <div className={styles.mainContainer}>
        <div className={styles.MiniNav}>  
          <div className={styles.MiniNavTop}>
            <a href={'/login/services/records/appointments'} className={`${styles.MiniNavButton}`}>Appointments</a>
            <a href={'/login/services/records/healthservices'} className={`${styles.MiniNavButton}`}>Health Services</a>
            <a href={'/login/services/records/clearance'} className={`${styles.MiniNavButton}`}>Clearance</a>
          </div>
        </div>  

        {children}

    </div>
  )
};

export default Layout;