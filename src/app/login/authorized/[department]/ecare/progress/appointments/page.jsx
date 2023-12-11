"use client"

import React, { useState } from "react";
import useSWR from "swr";
import { useRouter  } from "next/navigation";
import styles from "./page.module.css";
import Image from "next/image";
import UserDefault from "/public/UserDefault.png";

const Page = ({ params }) => {
  const Department = params.department;
  const router = useRouter();

  const [Status, setStatus] = useState("All");
	const [Search, setSearch] = useState("");

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
    
	const { data, mutate, error, isLoading } =  useSWR(
		`/api/records/GET_Records?GoogleEmail=&Department=${encodeURIComponent(Department)}&Status=&Type=${encodeURIComponent("Appointment")}`,
		fetcher
	);

  const sortedRecords = data && data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
	
	const filteredRecords = sortedRecords
    ? sortedRecords
        .filter(
          (record) =>
          Status === "All" || record.Status === Status
        )
        .filter((record) =>
          (record?.Details?.LastName ?? "").toLowerCase().includes(Search.toLowerCase()) ||
          (record?.Details?.FirstName ?? "").toLowerCase().includes(Search.toLowerCase()) ||
          (record?.Details?.MiddleName ?? "").toLowerCase().includes(Search.toLowerCase())
        )
    : [];


  return (
    <div className={styles.MainContent}>	
      <div className={styles.Header}>
        <input className={styles.SearchBar} type="search" name="" id="" placeholder="Search..." onChange={(e)=>setSearch(e.target.value)}/>
        <button className={`${styles.StatusBtn} ${Status === "All" ? styles.Active : null}`} onClick={()=>setStatus("All")}>All</button>
        <button className={`${styles.StatusBtn} ${Status === "Approved" ? styles.Active : null}`} onClick={()=>setStatus("Approved")}>Approved</button>
        <button className={`${styles.StatusBtn} ${Status === "Advising" ? styles.Active : null}`} onClick={()=>setStatus("Advising")}>Advising</button>
        <button className={`${styles.StatusBtn} ${Status === "Completed" ? styles.Active : null}`} onClick={()=>setStatus("Completed")}>Cleared</button>
      </div>
      <div className={styles.List}>
        {isLoading ? "Loading..." : filteredRecords.length === 0 ? "No results" : filteredRecords?.map((record, index) => (
          <div key={index} className={styles.Record} onClick={()=>router.push('/login/authorized/'+Department+'/ecare/progress/appointments/'+record._id)}>
            <Image 
              className={styles.RecordImage}
              src={record.GoogleImage === "" ||  record.GoogleImage === null ? UserDefault : record.GoogleImage}
              alt="X"
              width={50}
              height={50}
            />
            <p className={styles.RecordName}>{record?.Details?.LastName ?? ""}, {record?.Details?.FirstName ?? ""} {record?.Details?.MiddleName ?? ""}</p>
            <div className={`${styles.RecordStatus} ${styles[record.Status.replace(/\s+/g, '')]}`}>{record.Status}</div>
          </div>
        ))}
      </div>
    </div>
  )
};

export default Page;


