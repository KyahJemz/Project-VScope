"use client"

import React, { useState } from "react";
import useSWR from "swr";
import { useRouter  } from "next/navigation";
import styles from "./page.module.css";
import Image from "next/image";
import UserDefault from "/public/UserDefault.png";
import ActionConfirmation from "@/components/ActionConfirmation/ActionConfirmation";

const Page = ({ params }) => {
  const Department = params.department;
  const router = useRouter();

  const [Status, setStatus] = useState("All");
	const [Search, setSearch] = useState("");

  const [IsStatusChanging,setIsStatusChanging] = useState(false);

  const [showConfirmation,setShowConfirmation] = useState(false);
	const [ConfirmationData, setConfirmationData] = useState({
		title: "",
		content: "",
		onYes: () => {},
		onCancel: () => {},
	});

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
    
	const { data, mutate, error, isLoading } =  useSWR(
		`/api/records/GET_Records?GoogleEmail=&Department=${encodeURIComponent(Department)}&Status=&Type=${encodeURIComponent("WalkIn")}`,
		fetcher
	);

  const sortedRecords = data && data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
	
	const filteredRecords = sortedRecords
    ? sortedRecords
        .filter(
          (record) =>
          Status === "All" || record.ClearanceStatus === Status
        )
        .filter((record) =>
          (record?.Details?.LastName ?? "").toLowerCase().includes(Search.toLowerCase()) ||
          (record?.Details?.FirstName ?? "").toLowerCase().includes(Search.toLowerCase()) ||
          (record?.Details?.MiddleName ?? "").toLowerCase().includes(Search.toLowerCase())
        )
    : [];

  const ChangeStatus = async (e) => {
    setShowConfirmation(false);
    setIsStatusChanging(true);
    try {
      const formData = new FormData(); 
      formData.append("Department", Department);
      formData.append("RecordId", e.target.dataset.recordid);
      formData.append("Status", e.target.value);
      formData.append("Gmail", data.GoogleEmail);

      const response = await fetch("/api/clearance/POST_UpdateClearanceStatus", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Complete");
      } else {
        console.log("Failed");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsStatusChanging(false);
      mutate();
    }
  }

  const ConfirmChangeStatus = (e) => {
    setConfirmationData({
      title: `Clearance Status Change Confirmation`,
      content: `Do you want to mark this record as [ ${e.target.value}? ] ?`,
      onYes: () => ChangeStatus(e),
      onCancel: () => {e.target.value = e.target.dataset.value;setShowConfirmation(false); mutate();},
    });
    setShowConfirmation(true);
  }
  
  return (
    <div className={styles.MainContent}>	

      {showConfirmation && (
				<ActionConfirmation
					title={ConfirmationData.title}
					content={ConfirmationData.content}
					onYes={ConfirmationData.onYes}
					onCancel={ConfirmationData.onCancel}
				/>
			)}

      <div className={styles.Header}>
        <input className={styles.SearchBar} type="search" name="" id="" placeholder="Search..." onChange={(e)=>setSearch(e.target.value)}/>
        <button className={`${styles.StatusBtn} ${Status === "All" ? styles.Active : null}`} onClick={()=>setStatus("All")}>All</button>
        <button className={`${styles.StatusBtn} ${Status === "In Progress" ? styles.Active : null}`} onClick={()=>setStatus("In Progress")}>In Progress</button>
        <button className={`${styles.StatusBtn} ${Status === "Cleared" ? styles.Active : null}`} onClick={()=>setStatus("Cleared")}>Cleared</button>
      </div>
      <div className={styles.List}>
        {isLoading ? "Loading..." : filteredRecords.length === 0 ? "No results" : filteredRecords?.map((record, index) => (
          <div key={index} className={styles.Record}>
            <Image 
              className={styles.RecordImage}
              src={record.GoogleImage === "" ||  record.GoogleImage === null ? UserDefault : record.GoogleImage}
              alt="X"
              width={50}
              height={50}
            />
            <p className={styles.RecordName}>{record?.Details?.LastName ?? ""}, {record?.Details?.FirstName ?? ""} {record?.Details?.MiddleName ?? ""}</p>
            <select className={`${styles.RecordStatus} ${styles[record?.ClearanceStatus?.replace(/\s+/g, '')]}`} name="ClearanceStatus" data-recordid={record._id} data-value={record?.ClearanceStatus} defaultValue={record?.ClearanceStatus} onChange={ConfirmChangeStatus} disabled={IsStatusChanging}>
              <option value="In Progress">In Progress</option>
              <option value="Cleared">Cleared</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  )
};

export default Page;


