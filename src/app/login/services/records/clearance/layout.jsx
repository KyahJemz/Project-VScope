"use client"

import React, { useState, useEffect } from "react";
import styles from "./page.module.css"
import { useSession } from "next-auth/react";

const Layout = ({ children }) => {
  const { data: session, status } = useSession();
	const [GoogleEmail, setGoogleEmail] = useState("");
	const [Role, setRole] = useState("");
	useEffect(() => {
	  if (status === "authenticated" && session?.user?.email) {
		setGoogleEmail(session.user.email);
		setRole(session.user.role);
	  }
	}, [status, session]);

  return (
    <div className={styles.mainContainer}>

      <div className={styles.Header}>
        Clearance
      </div>
      
      <div className={styles.MiniNav}>  
        <div className={styles.MiniNavTop}>
          <a href={'/login/services/records/clearance/Medical'} className={`${styles.MiniNavButton}`}>Medical</a>
          <a href={'/login/services/records/clearance/Dental'} className={`${styles.MiniNavButton}`}>Dental</a>
          {Role === "Student" ? 
            <a href={'/login/services/records/clearance/SDPC'} className={`${styles.MiniNavButton}`}>SDPC</a>
          :
            null
          }
        </div>
      </div>  

      <div className={styles.Body}>
        {children}
      </div>
      
    </div>
  )
};

export default Layout;