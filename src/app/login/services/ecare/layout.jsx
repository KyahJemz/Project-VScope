"use client"

import React, { useState, useEffect } from "react";
import styles from "./page.module.css"
import { useSession } from "next-auth/react";

const Layout = ({ children }) => {
  const { data: session, status } = useSession();
	const [Role, setRole] = useState("");

  useEffect(() => {
	  if (status === "authenticated" && session?.user?.email) {
		  setRole(session.user.role);
	  }
	}, [status, session]);
  return (
    <div className={styles.mainContainer}>
        <div className={styles.MiniNav}>  
          <div className={styles.MiniNavTop}>
            <a href={'/login/services/ecare/messages'} className={`${styles.MiniNavButton}`}>Messages</a>
            <a href={'/login/services/ecare/details'} className={`${styles.MiniNavButton}`}>Details</a>
            <a href={'/login/services/ecare/progress'} className={`${styles.MiniNavButton}`}>Progress</a>
            {Role === "Student" ? <a href={'/login/services/ecare/assessment'} className={`${styles.MiniNavButton}`}>SDPC Assessments</a> : null}
          </div>
        </div>  

        {children}

    </div>
  )
};

export default Layout;