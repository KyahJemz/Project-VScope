"use client"

import React from "react";
import styles from "./page.module.css"

const Layout = async ({ children }) => {
  return (
    <div className={styles.mainContainer}>
        <div className={styles.MiniNav}>  
          <div className={styles.MiniNavTop}>
            <a href={'/login/services/ecare/messages'} className={`${styles.MiniNavButton}`}>Messages</a>
            <a href={'/login/services/ecare/details'} className={`${styles.MiniNavButton}`}>Details</a>
            <a href={'/login/services/ecare/progress'} className={`${styles.MiniNavButton}`}>Progress</a>
          </div>
        </div>  

        {children}

    </div>
  )
};

export default Layout;