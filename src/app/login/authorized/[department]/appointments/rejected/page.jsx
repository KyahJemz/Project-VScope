"use client"

import React, { useState } from "react";
import useSWR from "swr";
import styles from "./page.module.css";
import Image from "next/image";

const Pending = ({ params }) => {
	const Department = params.department;
	const Status = "Rejected";

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

	const formatShortDate = (timestamp) => {
		const options = { month: 'short', day: 'numeric', year: 'numeric' };
		const formattedDate = new Date(timestamp).toLocaleDateString(undefined, options);
	  
		return `${formattedDate}`;
	};

  	const fetcher = (...args) => fetch(...args).then((res) => res.json());
    
	const { data, mutate, error, isLoading } =  useSWR(
		`/api/records/GET_Records?Department=${encodeURIComponent(Department)}&Status=${encodeURIComponent(Status)}&Type=Appointment`,
		fetcher
	);

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

	const AppointmentDetails = () => {
		if (appointmentId === "") {

		  	return <p>Select appointment...</p>;

		} else {

			const details = data.find(appointment => appointment._id === appointmentId);
		
			if (!details) {
				console.error("Appointment details not found.");
				return <p>Appointment not found.</p>;
			}
		
			return (
				<>
					<div className={styles.DetailsHeader}>
						<Image className={styles.DetailsImage} src={ details.GoogleImage } alt="" width={75} height={75}/>
						<div className={styles.DetailsProfile}>
							<p className={styles.DetailsName}>{details.Details.LastName}, {details.Details.FirstName} {details.Details.MiddleName}</p>
							<p className={styles.DetailsEmail}>{ details.GoogleEmail }</p>
						</div>
					</div>
					<div className={styles.DetailsRow}>
						<input className={styles.DetailsFields} title="Course / Strand" type="text" defaultValue={details?.Details?.CourseStrand??""} data-value={details?.Details?.CourseStrand??""} data-key="CourseStrand" disabled placeholder="Course / Strand"/>
						<input className={styles.DetailsFields} title="Year Level" type="text" defaultValue={details?.Details?.YearLevel??""} data-value={details?.Details?.YearLevel??""} data-key="YearLevel" disabled placeholder="Year Level"/>
						<input className={styles.DetailsFields} title="In Case Of Emergency Number" type="text" defaultValue={details?.Details?.InCaseOfEmergencyNumber??""} data-value={details?.Details?.InCaseOfEmergencyNumber??""} data-key="InCaseOfEmergencyNumber" disabled placeholder="Any other number to contact"/>
					</div>
					<div className={styles.DetailsRow}>
						<input className={styles.DetailsFields} title="Student Number" type="text" defaultValue={details?.Details?.StudentNumber??""} data-value={details?.Details?.StudentNumber??""} data-key="StudentNumber" disabled placeholder="Student Id"/>
						<input className={styles.DetailsFields} title="Contact Number"  type="text" defaultValue={details?.Details?.ContactNumber??""} data-value={details?.Details?.ContactNumber??""} data-key="ContactNumber" disabled placeholder="Contact Number"/>
					</div>
					<div className={styles.DetailsRow}>
						<input className={styles.DetailsFields} title="Schedule Date" readOnly disabled type="text" defaultValue={`${formatShortDate(details?.AppointmentDate)??""} ${details?.AppointmentTime??""}`} placeholder="Appointment Date"/>	
						<input className={styles.DetailsFields} title="Diagnosis" readOnly disabled type="text" defaultValue={details?.Details?.ContactNumber??""} placeholder="Diagnosis"/>
					</div>
					<div className={styles.DetailsRow}>
						<textarea className={styles.DetailsFields} title="Concern" defaultValue={details?.Details?.Concern??""} readOnly disabled placeholder="Concern" name="" id="" cols="30" rows="10"></textarea>
					</div>
				</>
			);
		}
	};

	return (
		<div className={styles.MainContent}>	
		
			<div className={styles.Header}>
				<p>Appointments {Status} List</p>
			</div>

			<div className={styles.Appoitments}>

				<input placeholder="Search..." type="search" onChange={(e)=>setFilter(e.target.value)}/>
				
				{isLoading ? "Loading..." : filteredData.length === 0 ? "No results" : filteredData?.map((appointment, index) => (
					<div key={index} className={`${styles.Appointment} ${styles.Active}`}  onClick={() => {mutate; appointmentId === appointment._id ? setAppintmentId("") : setAppintmentId(appointment._id)}}>
						<p className={styles.aName}>Name: <a className={styles.aNameText}>{appointment.Details.LastName}, {appointment.Details.FirstName}</a></p>
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

export default Pending;


