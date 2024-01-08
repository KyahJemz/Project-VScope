"use client"
import React, { useState } from "react";
import styles from "./page.module.css";
import { useRouter } from 'next/navigation';
import useSWR from "swr";
import Image from "next/image";
import UserDefault from "/public/UserDefault.png"
import { set } from "mongoose";

export default function RootLayout(prop) {
    const Department = prop.params.department
    const router = useRouter();

    const [MessagesFilter, setMessagesFilter] = useState("");
	const [DirectMessagesFilter, setDirectMessagesFilter] = useState("");

    const [SelectedPanel, setSelectedPanel] = useState("Sickness Update");


    const fetcher = (...args) => fetch(...args).then((res) => res.json());
    
  // MESSAGES
    const { data: RecordsData, mutate: RecordsMutate, error: RecordsError, isLoading: RecordsIsLoading } =  useSWR(
        `/api/messages/GET_Messages?Department=${encodeURIComponent(Department)}&Type=${encodeURIComponent("Message")}`,
        fetcher
    );

    const sortedRecordsData = RecordsData && !RecordsIsLoading
    ? [...RecordsData]
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    : [];

    const filteredRecordsData = sortedRecordsData.filter((record) => {
        const FullName = `${record?.Details?.LastName??"?"}, ${record?.Details?.FirstName??"?"} ${record?.Details?.MiddleName??""}`;
        if (MessagesFilter !== "" && !FullName.toLowerCase().includes(MessagesFilter.toLowerCase())) return false;
        return true;
    });
  
// DIRECT
    const { data: DirectData, mutate: DirectMutate, error: DirectError, isLoading: DirectIsLoading } =  useSWR(
        `/api/messages/GET_Messages?GoogleEmail=&Department=${encodeURIComponent(Department)}&Type=${encodeURIComponent("Direct Message")}`,
        fetcher
    );

    const sortedDirectData = DirectData && !DirectIsLoading
    ? [...DirectData]
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    : [];

    const filteredDirectData = sortedDirectData.filter((record) => {
        const fullName = record?.FullName??"?";
        if (DirectMessagesFilter !== "" && !fullName.toLowerCase().includes(DirectMessagesFilter.toLowerCase())) return false;
        return true;
    });

    const ViewHistory = (e) => {
        RecordsMutate();
        DirectMutate();
        router.push('/login/authorized/'+Department+'/ecare/messages/'+e.target.dataset.value);
    }

    const formatShortDate = (timestamp) => {
		const options = { month: 'short', day: 'numeric', year: 'numeric' };
		const formattedDate = new Date(timestamp).toLocaleDateString(undefined, options);
	  
		return `${formattedDate}`;
	};

    const IsNew = (record) => {
		let unviewedCount = 0;

		if (record?.Responses) {
			for (const response of record.Responses) {
			if (response.ViewedByDepartment === false) {
				unviewedCount++;
			}
			}
		}

		return (unviewedCount > 0);
	};

  return (
    <div className={styles.MainContainer}>
        <div className={styles.PersonList}>
            <div className={styles.Header}>
                <p className={styles.SearchTitle}>{SelectedPanel}</p>
                <button className={styles.PanelBtn} onClick={()=>{SelectedPanel === "Sickness Update" ? setSelectedPanel("Direct Messages") : setSelectedPanel("Sickness Update")}}>Switch</button>
            </div>
            <hr />
            {SelectedPanel === "Sickness Update" ? (
                <>
                    <input className={styles.SearchBox} type="search" placeholder="Search..." onChange={(e)=>setMessagesFilter(e.target.value)}/>
                    <hr />
                    <div className={styles.SearchList}>
                        {RecordsIsLoading ? "Loading..." :
                            filteredRecordsData?.map((item, index) => 
                                <div className={styles.RecordName} key={index} data-value={item?._id} onClick={ViewHistory}>
                                    <Image
                                        data-value={item?._id}
                                        className={styles.MessageImage}
                                        src={item.Type === "WalkIn" ? UserDefault : item?.GoogleImage??UserDefault}
                                        alt="Image"
                                        height={50}
                                        width={50}
                                    />
                                    <p data-value={item?._id} className={`${styles.MessageName} ${IsNew(item) ? styles.Active : null}`}>{`${item?.Details?.LastName??"?"}, ${item?.Details?.FirstName??"?"} ${item?.Details?.MiddleName??""}`}</p>
                                    <div data-value={item?._id} className={styles.MessageDetails}>
                                        <p data-value={item?._id} className={`${styles.MessageLatest} ${IsNew(item) ? styles.Active : null}`}>{item?.Responses[item.Responses.length - 1]?.Response ?? "..."}</p>
                                        <p data-value={item?._id} className={`${styles.MessageTime} ${IsNew(item) ? styles.Active : null}`}>{formatShortDate(item.updatedAt)}</p>
                                    </div>

                                </div>
                            )
                        }
                    </div>
                </>
                ) : (
                <>
                    <input className={styles.SearchBox} type="search" placeholder="Search..." onChange={(e)=>setDirectMessagesFilter(e.target.value)}/>
                    <hr />
                    <div className={styles.SearchList}>
                        {DirectIsLoading ? "Loading..." :
                            filteredDirectData?.map((item, index) => 
                                <div className={styles.RecordName} key={index} data-value={item?._id} onClick={ViewHistory}>
                                    <Image
                                        data-value={item?._id}
                                        className={styles.MessageImage}
                                        src={item?.GoogleImage??UserDefault}
                                        alt="Image"
                                        height={50}
                                        width={50}
                                    />
                                    <p data-value={item?._id} className={`${styles.MessageName} ${IsNew(item) ? styles.Active : null}`}>{item.FullName}</p>
                                    <div data-value={item?._id} className={styles.MessageDetails}>
                                        <p data-value={item?._id} className={`${styles.MessageLatest} ${IsNew(item) ? styles.Active : null}`}>{item?.Responses[item.Responses.length - 1]?.Response ?? "..."}</p>
                                        <p data-value={item?._id} className={`${styles.MessageTime} ${IsNew(item) ? styles.Active : null}`}>{formatShortDate(item.updatedAt)}</p>
                                    </div>

                                </div>
                            )
                        }
                    </div>
                </>
          )}
          
        </div>
        <div className={styles.Record}>
          {prop.children}
        </div>
    </div>
  );
}
