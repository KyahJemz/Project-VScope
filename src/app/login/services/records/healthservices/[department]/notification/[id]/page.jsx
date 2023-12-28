"use client"

import React, { useState,useEffect } from "react";
import useSWR from "swr";
import { useRouter  } from "next/navigation";
import styles from "./page.module.css";

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
    

	const { data, mutate, error, isLoading } =  useSWR(
		`/api/notifications/GET_Notification?Id=${encodeURIComponent(Id)}&Department=${encodeURIComponent(Department)}`,
		fetcher
	);

    if(!isLoading) {
        console.log(data)
    }
	  
	return (
		<div className={styles.MainContent}>
			<div className={styles.Header}>
				<p>Notification</p>
			</div>
			<div className={styles.Body}>
                {isLoading ? "Loading..." : 
                    <>
                        <p className={styles.Date}>{data.Title}</p>
                        <p className={styles.Time}>{formatToDate(data.StartingDate)} - {formatToDate(data.EndingDate)}</p>
                        <textarea className={styles.Concern} name="" id="" cols="" rows="10" value={data.Descriptions} disabled></textarea>
                    </>
                }
			</div>
		</div>
	)
};

export default Page;


