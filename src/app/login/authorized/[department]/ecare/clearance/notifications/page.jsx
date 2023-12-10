"use client"

import React, { useState } from "react";
import useSWR from "swr";
import { useRouter  } from "next/navigation";
import styles from "./page.module.css";

const Page = ({ params }) => {
	const Department = params.department;
	const router = useRouter();

	const [Category, setCategory] = useState("All");

	return (
		<div className={styles.MainContent}>	
			<div className={styles.Header}>
				<input className={styles.SearchBar} type="search" name="" id="" placeholder="Search..."/>
				<button className={`${styles.CategoryBtn} ${Category === "All" ? styles.Active : null}`} onClick={()=>setCategory("All")}>All</button>
				<button className={`${styles.CategoryBtn} ${Category === "Students" ? styles.Active : null}`} onClick={()=>setCategory("Students")}>Students</button>
				<button className={`${styles.CategoryBtn} ${Category === "Lay Collaborator" ? styles.Active : null}`} onClick={()=>setCategory("Lay Collaborator")}>Lay Collaborator</button>
			</div>
			<div className={styles.Add}>
				<button className={`${styles.CategoryBtn}`} onClick={()=>router.push('/login/authorized/'+Department+'/ecare/clearance/notifications/add')}>+ Add</button>
			</div>
			<div className={styles.List}>

			</div>
		</div>
	)
};

export default Page;


