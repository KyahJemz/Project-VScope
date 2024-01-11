"use client"

import React, { useState, useEffect } from "react";
import styles from "./page.module.css"
import { useSession } from "next-auth/react";
import useSWR from "swr";

const Layout = ({ children }) => {

  const { data: session, status } = useSession();
	const [GoogleEmail, setGoogleEmail] = useState("");
	const [Role, setRole] = useState("");

	useEffect(() => {
		if (status === "authenticated" && session?.user?.email) {
		  setGoogleEmail(session.user.email);
		  setRole(session.user.role)
		}
	}, [status, session]);

  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const { data: NotificationData, mutate: NotificationMutate, error: NotificationError, isLoading: NotificationIsLoading } =  useSWR(
  `/api/notifications/GET_Notifications`,
  fetcher
);

const filteredNotificationsData = NotificationData?.filter((notification) => {
  if (notification.Target !== "All" && notification.Target !== Role+"s"){
    return false;
  }
    return true;
  });

  if(!NotificationIsLoading) {
    console.log(filteredNotificationsData);
  }

  const HasInProgress = (records) => {
    let InProgress = [];
  
    if (records) {
      for (const record of records) {

          // Check if GoogleEmail is in the Cleared array
          const isCleared = record.Cleared.includes(GoogleEmail);
  
          // If GoogleEmail is in Cleared array, mark the record as cleared
          InProgress.push({ ...record, cleared: isCleared });
      }
    }
  
    const isNotCleared = InProgress.some(record => !record.cleared);
  
    return isNotCleared;
  };

  return (
    <div className={styles.mainContainer}>
        <div className={styles.MiniNav}>  
          <div className={styles.MiniNavTop}>
            <a href={'/login/services/records/appointments'} className={`${styles.MiniNavButton}`}>Appointments</a>
            <a href={'/login/services/records/healthservices'} className={`${styles.MiniNavButton}`}>Health Services</a>
            <a href={'/login/services/records/clearance'} className={`${styles.MiniNavButton}`}>Clearance{HasInProgress(filteredNotificationsData) ? <div className="dot"></div> : null}</a>
          </div>
        </div>  

        {children}

    </div>
  )
};

export default Layout;