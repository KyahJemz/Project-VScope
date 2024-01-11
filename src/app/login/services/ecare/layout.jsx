"use client"

import React, { useState, useEffect } from "react";
import styles from "./page.module.css"
import { useSession } from "next-auth/react";
import useSWR from "swr";

const Layout = ({ children }) => {
  const { data: session, status } = useSession();
	const [Role, setRole] = useState("");
  const [GoogleEmail, setGoogleEmail] = useState("");

  useEffect(() => {
	  if (status === "authenticated" && session?.user?.email) {
		  setRole(session.user.role);
      setGoogleEmail(session.user.email)
	  }
	}, [status, session]);

  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const { data: RecordsData, mutate: RecordsMutate, error: RecordsError, isLoading: RecordsIsLoading } =  useSWR(
		`/api/messages/GET_Messages?GoogleEmail=${encodeURIComponent(GoogleEmail)}`,
		fetcher
	);

  const IsNew = (record) => {
		let unviewedCount = 0;

    if (record) {
      for (const item of record) {
        if (item?.Responses) {
          for (const response of item.Responses) {
            if (response.ViewedByClient === false) {
              unviewedCount++;
            }
          }
        }
      }
    }

		return unviewedCount;
	};

  const { data, mutate, error, isLoading } = useSWR(
    `/api/messages/GET_Message?GoogleEmail=${encodeURIComponent(GoogleEmail)}`,
    fetcher
);

const HasDirectMessages = (record) => {
let unviewedCount = 0;

if (record) {
  for (const item of record) {
    if (item?.Responses) {
    for (const response of item.Responses) {
      if (response.ViewedByClient === false) {
      unviewedCount++;
      }
    }
    }
  }
  }

return unviewedCount;
};



  return (
    <div className={styles.mainContainer}>
        <div className={styles.MiniNav}>  
          <div className={styles.MiniNavTop}>
            <a href={'/login/services/ecare/messages'} className={`${styles.MiniNavButton}`}>Messages {(Number(IsNew(RecordsData)) + Number(HasDirectMessages(data))) > 0 ? <div className="dot"></div> : null}</a>
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