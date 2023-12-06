"use client"

import React, { useState } from "react";
import useSWR from "swr";
import { useRouter  } from "next/navigation";
import styles from "./page.module.css";
import Image from "next/image";
import Calendar from "@/components/Calendar/Calendar";

const Schedule = ({ params }) => {
	const Department = params.department;
	const Status = "Pending";
	const router = useRouter();

	const [filter,setFilter] = useState("");
	const [SelectedDay, setSelectedDay] = useState(null);

	const [hasSchedule, setHasSchedule] = useState(null);

	const formatDate = (timestamp) => {
		const options = { month: 'short', day: 'numeric', year: 'numeric' };
		const formattedDate = new Date(timestamp).toLocaleDateString(undefined, options);
	  
		const hours = new Date(timestamp).getHours();
		const minutes = new Date(timestamp).getMinutes();
		const amOrPm = hours >= 12 ? 'pm' : 'am';
		const formattedTime = `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')}${amOrPm}`;
	  
		return `${formattedDate} ${formattedTime}`;
	};
	  
  	const fetcher = (...args) => fetch(...args).then((res) => res.json());
    
	const { data, mutate, error, isLoading } =  useSWR(
		`/api/appointments/GET_Appointments?GoogleEmail=&Department=${encodeURIComponent(Department)}&Status=${encodeURIComponent(Status)}`,
		fetcher
	);

	if(!isLoading) {
		console.log(data)
	}

	const sortedData = data && !isLoading
    ? [...data]
		.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
		.map(item => ({
			...item,
			createdAt: formatDate(item.createdAt)
		}))
    : [];

	console.log(SelectedDay);

	return (
		<div className={styles.MainContent}>	
		
			<div className={styles.Header}>
				<p>Set Appointment Schedules</p>
			</div>

			<div className={styles.Schedules}>

				<p style={{ fontWeight: 'bold', textAlign: 'center' }}>Schedules</p>
				
				{isLoading ? "Loading..." : sortedData.length === 0 ? "No results" : sortedData?.map((appointment, index) => (
					<div key={index} className={`${styles.Appointment} ${styles.Active}`}>
					
					</div>
				))}

			</div>

			<div className={styles.TimeSelection}>
				<p style={{ fontWeight: 'bold', textAlign: 'center' }}>Availability</p>

				{hasSchedule ? null :
					<>
						<label className={styles.radioForm} htmlFor="schedulingtime1"><input type="radio" name="test" id="schedulingtime1" value="8am-10am" />8am-10am</label>

						<label className={styles.radioForm} htmlFor="schedulingtime2"><input type="radio" name="test" id="schedulingtime2" value="10am-12pm" />10am-12pm</label>

						<label className={styles.radioForm} htmlFor="schedulingtime3"><input type="radio" name="test" id="schedulingtime3" value="1pm-3pm" />1pm-3pm</label>

						<label className={styles.radioForm} htmlFor="schedulingtime4"><input type="radio" name="test" id="schedulingtime4" value="3pm-5pm" />3pm-5pm</label>

						<label className={styles.radioForm} htmlFor="schedulingtime5"><input type="radio" name="test" id="schedulingtime5" value="morning" />Morning</label>

						<label className={styles.radioForm} htmlFor="schedulingtime6"><input type="radio" name="test" id="schedulingtime6" value="afternoon" />Afternoon</label>

						<label className={styles.radioForm} htmlFor="schedulingtime7"><input type="radio" name="test" id="schedulingtime7" value="wholeday" />Whole Day</label>

						<button onClick={OnAdd}>Add</button>
					</>
				}

			</div>

			<div className={styles.AppoitmentDetails}>
				<Calendar callback={setSelectedDay} />
			</div>
		
		</div>
	)
};

export default Schedule;


