"use client"
import React, { useState } from "react";
import styles from "./page.module.css";
import { useRouter } from 'next/navigation';
import useSWR from "swr";

export default function RootLayout(prop) {
  const Department = prop.params.department
  const router = useRouter();

  const [SearchFilter, setSearchFilter] = useState("");

  let uniqueEmails = null;

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
    
	const { data, mutate, error, isLoading } =  useSWR(
		`/api/records/GET_Records?GoogleEmail=&Department=${encodeURIComponent(Department)}&Status=&Type=${encodeURIComponent("All")}`,
		fetcher
	);

	if (!isLoading) {
    const uniqueEmailsMap = new Map();
    data.forEach(item => {
      uniqueEmailsMap.set(item.GoogleEmail, item);
    });
    uniqueEmails = Array.from(uniqueEmailsMap.values());
  }

  const ViewHistory = (e) => {
    router.push('/login/authorized/'+Department+'/records/'+e.target.dataset.value);
  }

  const filteredRecordsData = uniqueEmails?.filter((record) => {
		const FullName = `${record?.Details?.LastName??"?"}, ${record?.Details?.FirstName??"?"} ${record?.Details?.MiddleName??""}`;
		if (SearchFilter !== "" && !FullName.toLowerCase().includes(SearchFilter.toLowerCase())) return false;
		return true;
	});

  return (
    <div className={styles.MainContainer}>
        <div className={styles.PersonList}>
          <p className={styles.SearchTitle}>Records</p>
          <hr />
          <input className={styles.SearchBox} type="search" placeholder="Search..." onChange={(e)=>setSearchFilter(e.target.value)}/>
          <hr />
          <div className={styles.SearchList}>
            {isLoading ? "Loading..." :
              filteredRecordsData.map((item, index) => 
                <div className={styles.RecordName} key={index} data-value={item.GoogleEmail} onClick={ViewHistory}>
                  {`${item?.Details?.LastName??"?"}, ${item?.Details?.FirstName??"?"} ${item?.Details?.MiddleName??""}`}
                </div>
              )
            }
          </div>
        </div>
        <div className={styles.Record}>
          {prop.children}
        </div>
    </div>
  );
}
