"use client"

import React, { useState } from "react";
import useSWR from "swr";
import { useRouter  } from "next/navigation";
import styles from "./page.module.css";

const Page = ({ params }) => {
	const Department = params.department;
	const Id = params.id;
	const router = useRouter();

	const [IsUploading, setIsUploading] = useState(false);

	const fetcher = (...args) => fetch(...args).then((res) => res.json());
    
	const { data, mutate, error, isLoading } =  useSWR(
		`/api/notifications/GET_Notification?Department=${encodeURIComponent(Department)}&Id=${encodeURIComponent(Id)}`,
		fetcher
	);

	if(!isLoading){
		console.log(data)
	}

	return (
		<div className={styles.MainContent}>
			{isLoading && !data ? 
				"Loading..."
			:
				<>
					<div className={styles.Row}>
						{data.Title}
					</div>
					<div className={styles.Row}>
						To: 
						<select className={styles.InputCategory} name="Target" id="" disabled value={data.Target}>
							<option className={styles.InputCategoryOptions} value="All">All</option>
							<option className={styles.InputCategoryOptions} value="Students">Students</option>
							<option className={styles.InputCategoryOptions} value="Lay Collaborators">Lay Collaborators</option>
						</select>
					</div>
					<div className={styles.Row}>
						<input className={styles.Input} name="Title" type="text" id="title" placeholder="Title" disabled value={data.Title}/>
					</div>
					<div className={styles.Row}>
						<textarea className={styles.Input} placeholder="Description" id="description" name="Descriptions" cols="30" rows="10" disabled value={data.Descriptions}></textarea>
					</div>
					<div className={styles.Row}>
						<label>Start Date:</label>
						<input className={styles.Input} type="date" name="StartingDate" disabled value={data.StartingDate}/>
						<label>End Date:</label>
						<input className={styles.Input} type="date" name="EndingDate" disabled value={data.EndingDate}/>
					</div>
				</>
			}	
		</div>
	)
};

export default Page;


