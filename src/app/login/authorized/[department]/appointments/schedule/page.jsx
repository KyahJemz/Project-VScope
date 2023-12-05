"use client"

import React, { useState } from "react";
import useSWR from "swr";
import { useRouter  } from "next/navigation";
import styles from "./page.module.css";
import Image from "next/image";

const Schedule = ({ params }) => {
	const Department = params.department;
	const Status = "Pending";
	const router = useRouter();

	const [filter,setFilter] = useState("");
	const [appointmentId,setAppintmentId] = useState("");

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

	const filteredData = sortedData.filter((appointment) => {
		if (filter !== "" && !appointment.Name.toLowerCase().includes(filter.toLowerCase())) return false;
		return true;
	});

	const UpdateRecord = (e) => {

	};

	const ChangeConfirmation = (e) => {
		console.log("test");
		console.log(e.target.dataset.value);
	};

	const AppointmentDetails = () => {
		if (appointmentId === "") {

		  	return <p>Select appointment...</p>;

		} else {

			const details = data.find(appointment => appointment._id === appointmentId);
		
			if (!details) {
				console.error("Appointment details not found.");
				return <p>Appointment not found.</p>;
			}
		
			console.log(details);
		
			return (
				<>
					<div className={styles.DetailsHeader}>
						<Image className={styles.DetailsImage} src={ details.GoogleImage } alt="" width={75} height={75}/>
						<div className={styles.DetailsProfile}>
							<p className={styles.DetailsName}>{ details.Name }</p>
							<p className={styles.DetailsEmail}>{ details.GoogleEmail }</p>
						</div>
					</div>
					<div className={styles.DetailsRow}>
						<input className={styles.DetailsFields} type="search" defaultValue={details?.Details?.CourseStrand??""} data-value={details?.Details?.CourseStrand??""} onChange={ChangeConfirmation} placeholder="Course / Strand"/>
						<input className={styles.DetailsFields} type="search" defaultValue={details?.Details?.YearLevel??""} data-value={details?.Details?.YearLevel??""} onChange={ChangeConfirmation} placeholder="Year Level"/>
						<input className={styles.DetailsFields} type="search" defaultValue={details?.Details?.OtherEmail??""} data-value={details?.Details?.OtherEmail??""} onChange={ChangeConfirmation} placeholder="Any other email to contact"/>
					</div>
					<div className={styles.DetailsRow}>
						<input className={styles.DetailsFields} type="search" defaultValue={details?.Details?.StudentNumber??""} data-value={details?.Details?.StudentNumber??""} onChange={ChangeConfirmation} placeholder="Student Id"/>
						<input className={styles.DetailsFields} type="search" defaultValue={details?.Details?.ContactNumber??""} data-value={details?.Details?.ContactNumber??""} onChange={ChangeConfirmation} placeholder="Contact Number"/>
					</div>
					<div className={styles.DetailsRow}>
						<input className={styles.DetailsFields} readOnly disabled type="text" defaultValue={details?.Details?.Date??""} placeholder="Appointment Data"/>
						<input className={styles.DetailsFields} readOnly disabled type="text" defaultValue={details?.Details?.ContactNumber??""} placeholder="Diagnosis"/>
					</div>
					<div className={styles.DetailsRow}>
						<textarea className={styles.DetailsFields} defaultValue={details?.Details?.Concern??""} readOnly disabled placeholder="Concern" name="" id="" cols="30" rows="10"></textarea>
					</div>
					<div className={styles.DetailsRow}>
						<button className={styles.DetailsButton}>RE-SCHEDULE</button>
						<button className={styles.DetailsButton}>APPROVED</button>
					</div>	
				</>
			);
		}
	};

	return (
		<div className={styles.MainContent}>	
		
			<div className={styles.Header}>
				<p>Set Appointment Schedules</p>
			</div>

			<div className={styles.Appoitments}>

				<input placeholder="Search..." type="search" onChange={(e)=>setFilter(e.target.value)}/>
				
				{isLoading ? "Loading..." : filteredData.length === 0 ? "No results" : filteredData?.map((appointment, index) => (
					<div key={index} className={`${styles.Appointment} ${styles.Active}`}  onClick={() => {mutate; appointmentId === appointment._id ? setAppintmentId("") : setAppintmentId(appointment._id)}}>
						<p className={styles.aName}>Name: <a className={styles.aNameText}>{appointment.Name}</a></p>
						<p className={styles.aDate}>Date: <a className={styles.aDateText}>{appointment.createdAt}</a></p>
					</div>
				))}

			</div>

			<div className={styles.AppoitmentDetails}>
				<AppointmentDetails />
			</div>
		
		</div>
	)
};

export default Schedule;


