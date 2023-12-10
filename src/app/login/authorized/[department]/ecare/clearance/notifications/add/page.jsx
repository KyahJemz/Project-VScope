"use client"

import React, { useState } from "react";
import useSWR from "swr";
import { useRouter  } from "next/navigation";
import styles from "./page.module.css";

const Page = ({ params }) => {
	const Department = params.department;
	const router = useRouter();

	return (
		<form className={styles.MainContent}>	
			<div className={styles.Row}>
				Add Form
			</div>
			<div className={styles.Row}>
				To: 
				<select className={styles.Input} name="Target" id="">
					<option value="All">All</option>
					<option value="Students">Students</option>
					<option value="Lay Collaborators">Lay Collaborators</option>
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
				<button>Add</button>
			</div>
		</form>
	)
};

export default Page;


