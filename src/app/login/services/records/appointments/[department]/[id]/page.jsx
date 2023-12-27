"use client"

import React, { useState,useEffect } from "react";
import useSWR from "swr";
import { useRouter  } from "next/navigation";
import styles from "./page.module.css";
import Image from "next/image";
import UserDefault from "/public/UserDefault.png"
import { useSession } from "next-auth/react";
import Medical from "public/Medical.jpg";
import SDPC from "public/SDPC.jpg";
import Dental from "public/Dental.jpg";

const Page = ({params}) => {
	const router = useRouter();

    const Department = params.department;
    const Id = params.id;

    const formatToDate = (timestamp) => {
        const formattedDate = new Date(timestamp).toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
	  
		return `${formattedDate}`;
	};

  	const fetcher = (...args) => fetch(...args).then((res) => res.json());
    
// MESSAGES
	const { data: RecordsData, mutate: RecordsMutate, error: RecordsError, isLoading: RecordsIsLoading } =  useSWR(
		`/api/records/GET_Record?Id=${encodeURIComponent(Id)}&Department=${encodeURIComponent(Department)}`,
		fetcher
	);

    if(!RecordsIsLoading) {
        console.log(RecordsData)
    }
	  
	return (
		<div className={styles.MainContent}>
			<div className={styles.Header}>
				<p>Appointment History</p>
			</div>
			<div className={styles.Body}>
                {RecordsIsLoading ? "Loading..." : 
                    <>
                        <p className={styles.Date}>{formatToDate(RecordsData.AppointmentDate)}</p>
                        <p className={styles.Time}>{RecordsData.AppointmentTime.replace(/-/g, ' - ')}</p>
                        <textarea className={styles.Concern} name="" id="" cols="" rows="10" value={RecordsData.Details.Concern} disabled></textarea>
                    </>
                }
			</div>
		</div>
	)
};

export default Page;


