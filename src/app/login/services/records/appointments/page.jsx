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
	const { data: session, status } = useSession();
	const [GoogleEmail, setGoogleEmail] = useState("");
	const router = useRouter();

	useEffect(() => {
		if (status === "authenticated" && session?.user?.email) {
		  setGoogleEmail(session.user.email);
		}
	}, [status, session]);

	const [DateFilter, setDateFilter] = useState("");

	const formatDate = (timestamp) => {
		const options = { month: 'short', day: 'numeric', year: 'numeric' };
		const formattedDate = new Date(timestamp).toLocaleDateString(undefined, options);
	  
		const hours = new Date(timestamp).getHours();
		const minutes = new Date(timestamp).getMinutes();
		const amOrPm = hours >= 12 ? 'pm' : 'am';
		const formattedTime = `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')}${amOrPm}`;
	  
		return `${formattedDate} ${formattedTime}`;
	};

	const formatShortDate = (timestamp) => {
		const options = { month: 'short', day: 'numeric', year: 'numeric' };
		const formattedDate = new Date(timestamp).toLocaleDateString(undefined, options);
	  
		return `${formattedDate}`;
	};

  	const fetcher = (...args) => fetch(...args).then((res) => res.json());
    
// MESSAGES
	const { data: RecordsData, mutate: RecordsMutate, error: RecordsError, isLoading: RecordsIsLoading } =  useSWR(
		`/api/records/GET_Records?GoogleEmail=${encodeURIComponent(GoogleEmail)}&Department=&Type=Appointment&Status=}`,
		fetcher
	);

	const sortedRecordsData = RecordsData && !RecordsIsLoading
	? [...RecordsData]
	  .filter(item => ['In Progress', 'Advising', 'Approved'].includes(item.Status)) // Filter records with specific statuses
	  .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
	: [];

	if (!RecordsIsLoading) {
		console.log(RecordsData)
	}

	const filteredRecordsData = sortedRecordsData.filter((record) => {
		const filterDate = new Date(DateFilter);
		const recordDate = new Date(record.createdAt);
	  
		if (DateFilter !== "" && filterDate.toDateString() !== recordDate.toDateString()) {
		  return false;
		}
	  
		return true;
	  });
	  
	const RecordList = () => {
		return (
			<>
				{RecordsIsLoading && !filteredRecordsData ? (
					"Loading..."
				) : (
					filteredRecordsData.length > 0 ? (
						filteredRecordsData.map((record, index) => (
							<ListItem key={index} department={record.Department} name={`${formatShortDate(record.createdAt)} - Schedule (${formatShortDate(record?.AppointmentDate) ?? "?"} ${record?.AppointmentTime ?? "?"})`} image={record?.Department === "Medical" ? Medical : record?.Department === "Dental" ? Dental : record?.Department === "SDPC" ? SDPC : UserDefault} id={record._id} status={record.Status}/>
						))
					) : (
						"No messages yet"
					)
				)}
			</>
		);
	};
	
	const ListItem = ({key, department, name, image, id, status}) => {
		return (
			<div className={styles.ListItem} key={key} onClick={(e)=>router.push(`/login/services/records/appointments/${department}/${id}`)}>
				<Image
					className={styles.ListItemImage}
					src={image??UserDefault}
					alt="Image"
					width={50}
					height={50}
				/>
				<p className={styles.ListItemName}>{name}</p>
				<p className={`${styles.ListItemMark} ${styles[status.replace(/\s/g, '')]}`}>{status}</p>
			</div>
		)
	}

	return (
		<div className={styles.MainContent}>
			<div className={styles.Header}>
				<p>Appointment History</p>
			</div>
			<div className={styles.Body}>
				<input className={styles.SearchBar} placeholder="Search..." type="Date" onChange={(e)=>setDateFilter(e.target.value)}/>
				<RecordList />
			</div>
		</div>
	)
};

export default Page;


