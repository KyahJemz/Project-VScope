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
	const Department = params.department;
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
		`/api/records/GET_Records?GoogleEmail=${encodeURIComponent(GoogleEmail)}&Department=${encodeURIComponent(Department)}&Type=&Status=}`,
		fetcher
	);

	const sortedRecordsData = RecordsData && !RecordsIsLoading
	? [...RecordsData]
	  .filter(item => ['In Progress', 'Advising', 'Approved'].includes(item.Status)) // Filter records with specific statuses
	  .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
	: [];

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
							<React.Fragment key={index}>
								{record.AppointmentDate === "" ? (
									<ListItem
										name={`${formatShortDate(record.createdAt)} - Schedule (WalkIn)`}
										image={Department === "Medical" ? Medical : Department === "Dental" ? Dental : Department === "SDPC" ? SDPC : UserDefault}
										isNew={IsNew(record)}
										id={record._id}
									/>
								) : (
									<ListItem
										name={`${formatShortDate(record.createdAt)} - Schedule (${formatShortDate(record?.AppointmentDate) ?? "?"} ${record?.AppointmentTime ?? "?"})`}
										image={Department === "Medical" ? Medical : Department === "Dental" ? Dental : Department === "SDPC" ? SDPC : UserDefault}
										isNew={IsNew(record)}
										id={record._id}
									/>
								)}
							</React.Fragment>
						))
					) : (
						"No records yet"
					)
				)}
			</>
		);
	};

	const IsNew = (record) => {
		return (true)
	};
	
	const ListItem = ({key, name, image, isNew, id}) => {
		return (
			<div className={styles.ListItem} key={key} onClick={(e)=>router.push(`/login/services/ecare/progress/${Department}/${id}`)}>
				<Image
					className={styles.ListItemImage}
					src={image??UserDefault}
					alt="Image"
					width={50}
					height={50}
				/>
				<p className={styles.ListItemName}>{name}</p>
				<p className={styles.ListItemMark}>{isNew ? "New" : ""}</p>
			</div>
		)
	}

	return (
		<div className={styles.MainContent}>
			<div className={styles.Header}>
				<p>Progress</p>
			</div>
			<div className={styles.Body}>
				<input className={styles.SearchBar} placeholder="Search..." type="Date" onChange={(e)=>setDateFilter(e.target.value)}/>
				<RecordList />
			</div>
		</div>
	)
};

export default Page;


