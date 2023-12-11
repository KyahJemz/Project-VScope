"use client"

import React, { useState } from "react";
import useSWR from "swr";
import { useRouter  } from "next/navigation";
import styles from "./page.module.css";
import Image from "next/image";

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
					<div className={styles.Profile}>
						<div className={styles.ProfileTop}>
							<Image 
							/>
							<p className={styles.ProfileName}>test</p>
							<p className={styles.ProfileId}>test</p>
							<p className={styles.ProfileEmail}>test</p>
						</div>
						<div className={styles.ProfileBot}>
							<button>History</button>
							<button>Report</button>
						</div>
					</div>
					<div className={styles.Details}>
						
					</div>
		
					<div className={styles.Diagnosis}>
						
					</div>
					<div className={styles.Prescription}>
						
					</div>
					<div className={styles.Note}>
						
					</div>
					<div className={styles.Days}>
						
					</div>
					<div className={styles.Status}>
						
					</div>
				</>
			}	
		</div>
	)
};

export default Page;


