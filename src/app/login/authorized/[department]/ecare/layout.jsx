"use client"

import styles from "./page.module.css";
import React, { useState } from "react";
import useSWR from "swr";

export default function RootLayout(prop) {
  const Department = prop.params.department;

  
  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const { data: RecordsData, mutate: RecordsMutate, error: RecordsError, isLoading: RecordsIsLoading } =  useSWR(
		`/api/messages/GET_Messages?Department=${encodeURIComponent(Department)}`,
		fetcher
	);

  const IsNew = (record) => {
		let unviewedCount = 0;

    if (record) {
      for (const item of record) {
        if (item?.Responses) {
          for (const response of item.Responses) {
            if (response.ViewedByDepartment === false) {
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
            <a href={'/login/authorized/'+Department+'/ecare/walkins'} className={`${styles.MiniNavButton}`}>WALK INS</a>
            <a href={'/login/authorized/'+Department+'/ecare/messages'} className={`${styles.MiniNavButton}`}>MESSAGES {IsNew(RecordsData) > 0 ? <div className="dot"></div> : null}</a>
            <a href={'/login/authorized/'+Department+'/ecare/clearance'} className={`${styles.MiniNavButton}`}>CLEARANCE</a>
            <a href={'/login/authorized/'+Department+'/ecare/progress'} className={`${styles.MiniNavButton}`}>PROGRESS</a>
          </div>
        </div>  

        {prop.children}

    </div>
  );
}
