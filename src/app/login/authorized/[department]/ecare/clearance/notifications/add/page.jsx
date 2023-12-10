"use client"

import React, { useState } from "react";
import useSWR from "swr";
import { useRouter  } from "next/navigation";
import styles from "./page.module.css";

const Page = ({ params }) => {
	const Department = params.department;
	const router = useRouter();

	const [IsUploading, setIsUploading] = useState(false);

	const onSubmit = (e) => {
		e.preventDefault();
		setIsUploading(true);
		try {

			router.push('/login/authorized/'+Department+'/ecare/clearance/notifications')
			
		} catch (error) {
			
		} finally {
			setIsUploading(false);
		}
	}

	return (
		<form className={styles.MainContent} onSubmit={onSubmit}>	
			<div className={styles.Row}>
				Add Form
			</div>
			<div className={styles.Row}>
				To: 
				<select className={styles.InputCategory} name="Target" id="">
					<option className={styles.InputCategoryOptions} value="All">All</option>
					<option className={styles.InputCategoryOptions} value="Students">Students</option>
					<option className={styles.InputCategoryOptions} value="Lay Collaborators">Lay Collaborators</option>
				</select>
			</div>
			<div className={styles.Row}>
				<input className={styles.Input} name="Title" type="text" id="title" placeholder="Title" />
			</div>
			<div className={styles.Row}>
				<textarea className={styles.Input} placeholder="Description" id="description" name="Descriptions" cols="30" rows="10"></textarea>
			</div>
			<div className={styles.Row}>
				<label>Start Date:</label>
				<input className={styles.Input} type="date" name="StartingDate" />
				<label>End Date:</label>
				<input className={styles.Input} type="date" name="EndingDate"/>
			</div>
			<div className={styles.Row}>
				<button className={styles.FormButton} disabled={IsUploading}>{IsUploading ? "Uploading..." : "Add"}</button>
			</div>
		</form>
	)
};

export default Page;


