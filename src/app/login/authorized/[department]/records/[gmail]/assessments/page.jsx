"use client"

import React, { useState,useEffect } from "react";
import useSWR from "swr";
import { useRouter  } from "next/navigation";
import styles from "./page.module.css";

const Page = ({params}) => {
	const GoogleEmail = params.gmail;
	const [Name, setName] = useState("");
	const [Filter, setFilter] = useState("All");
	const router = useRouter();

	const capitalizeEachWord = (text) => {
		const words = text.split(' ');
		const capitalizedWords = words.map(word => `${word.charAt(0).toUpperCase()}${word.slice(1)}`);
		const result = capitalizedWords.join(' ');
		return result;
	};

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
    
	const { data: RecordsData, mutate: RecordsMutate, error: RecordsError, isLoading: RecordsIsLoading } =  useSWR(
		`/api/assessments/GET_Assessments?GoogleEmail=${GoogleEmail}&Department=${encodeURIComponent("SDPC")}`,
		fetcher
	);

	const sortedRecordsData = RecordsData && !RecordsIsLoading
    ? [...RecordsData]
		.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    : [];

	const filteredRecords = sortedRecordsData
		? sortedRecordsData
			.filter((assessment) =>
				(Filter === "All" ? true : assessment.Type === Filter ? true : false)
			)
		: [];

	  
	const AssessmentList = () => {
		return (
			<>
				{RecordsIsLoading && !filteredRecords ? (
					"Loading..."
				) : (
					filteredRecords.length > 0 ? (
						filteredRecords.map((assessment, index) => (
							<ListItem
								key={index}
								name={`${assessment.Type} ${assessment.Type === "Mental Health Test" ? `[${assessment.Set}]` :""} - ${assessment.Ranking[0].SubCategory}`}
								date={formatDate(assessment.createdAt)}
								id={assessment._id}
							/>
						))
					) : (
						"No assessments yet"
					)
				)}
			</>
		);
	};
	
	const ListItem = ({key, name, date, id}) => {
		return (
			<div className={styles.ListItem} key={key} onClick={(e)=>router.push(`/login/authorized/SDPC/records/${GoogleEmail}/assessments/${id}`)}>
				<p className={styles.ListItemName}>{name}</p>
				<p className={styles.ListItemMark}>{date}</p>
			</div>
		)
	}

	return (
		<div className={styles.MainContent}>
			<div className={styles.Header}>
				<p>Assessment History</p>
				<div className={styles.FilterBtns}>
					<button className={`${styles.filterBtn} ${Filter === "All" ? styles.Active : ""}`} onClick={()=>setFilter("All")}>All</button>
					<button className={`${styles.filterBtn} ${Filter === "Educational Test" ? styles.Active : ""}`} onClick={()=>setFilter("Educational Test")}>Educational Test</button>
					<button className={`${styles.filterBtn} ${Filter === "Mental Health Test" ? styles.Active : ""}`} onClick={()=>setFilter("Mental Health Test")}>Mental Health Test</button>
					<button className={`${styles.filterBtn} ${Filter === "Personality Test" ? styles.Active : ""}`} onClick={()=>setFilter("Personality Test")}>Personality Test</button>
				</div>
			</div>
			<div className={styles.Body}>
				<AssessmentList />
			</div>
		</div>
	)
};

export default Page;


