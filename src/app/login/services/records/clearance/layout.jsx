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
		setRole(session.user.role);
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

  const HasInProgress = (records, department) => {
    let InProgress = [];
  
    if (records) {
      for (const record of records) {
        if (record.Department === department) {
          // Check if GoogleEmail is in the Cleared array
          const isCleared = record.Cleared.includes(GoogleEmail);
  
          // If GoogleEmail is in Cleared array, mark the record as cleared
          InProgress.push({ ...record, cleared: isCleared });
        }
      }
    }
  
    const isNotCleared = InProgress.some(record => !record.cleared);
  
    return isNotCleared;
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.Header}>Clearance</div>
      
      <div className={styles.MiniNav}>
        <div className={styles.MiniNavTop}>
          {/* Render Medical link with dot if GoogleEmail is not in Cleared array */}
          <a href={'/login/services/records/clearance/Medical'} className={`${styles.MiniNavButton}`}>
            Medical{HasInProgress(filteredNotificationsData, "Medical") ? <div className="dot"></div> : null}
          </a>
          {/* Render Dental link with dot if GoogleEmail is not in Cleared array */}
          <a href={'/login/services/records/clearance/Dental'} className={`${styles.MiniNavButton}`}>
            Dental{HasInProgress(filteredNotificationsData, "Dental") ? <div className="dot"></div> : null}
          </a>
          {/* Render SDPC link with dot if GoogleEmail is not in Cleared array (for students) */}
          {Role === "Student" && (
            <a href={'/login/services/records/clearance/SDPC'} className={`${styles.MiniNavButton}`}>
              SDPC{HasInProgress(filteredNotificationsData, "SDPC") ? <div className="dot"></div> : null}
            </a>
          )}
        </div>
      </div>
  
      <div className={styles.Body}>{children}</div>
    </div>
  );
};

export default Layout;