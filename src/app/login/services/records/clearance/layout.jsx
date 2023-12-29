"use client"

import React from "react";
import styles from "./page.module.css"

const Layout = ({ children }) => {
  return (
    <div className={styles.mainContainer}>

      <div className={styles.Header}>
        Clearance
      </div>
      
      <div className={styles.MiniNav}>  
        <div className={styles.MiniNavTop}>
          <a href={'/login/services/records/clearance/Medical'} className={`${styles.MiniNavButton}`}>Medical</a>
          <a href={'/login/services/records/clearance/Dental'} className={`${styles.MiniNavButton}`}>Dental</a>
          <a href={'/login/services/records/clearance/SDPC'} className={`${styles.MiniNavButton}`}>SDPC</a>
        </div>
      </div>  

      <div className={styles.Body}>
        {children}
      </div>
      
    </div>
  )
};

export default Layout;