"use client"

import React, { useState } from "react";
import useSWR from "swr";
import { useRouter  } from "next/navigation";
import styles from "./page.module.css";
import Image from "next/image";
import ActionConfirmation from "@/components/ActionConfirmation/ActionConfirmation";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';


const Pending = ({ params }) => {
	const Department = params.department;
	const Status = "Approved";
	const router = useRouter();

	const [filter,setFilter] = useState("");

	const [SelectedPanel,setSelectedPanel] = useState("WalkIn Form");

	const [showConfirmation,setShowConfirmation] = useState(false);
	const [ConfirmationData, setConfirmationData] = useState({
		title: "",
		content: "",
		onYes: () => {},
		onCancel: () => {},
	});

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

	const ChangeConfirmation = (e) => {
		if(e.target.dataset.value !== e.target.value) {
			setConfirmationData({
				title: "Change Confirmation",
				content: `Do you like to change [ ${e.target.dataset.value} ] to [ ${e.target.value} ]?`,
				onYes: () => UpdateDetails(e),
				onCancel: () => setShowConfirmation(false),
			});
			setShowConfirmation(true);
		}
	};

	return (
		<div className={styles.MainContent}>	

			{showConfirmation && (
                <ActionConfirmation
                    title={ConfirmationData.title}
                    content={ConfirmationData.content}
                    onYes={ConfirmationData.onYes}
                    onCancel={ConfirmationData.onCancel}
                />
            )}

			{SelectedPanel === "WalkIn Form" ? (
				<>
					<div className={styles.Header}>
						<div className={styles.title}>Walk in Application Form</div>
						<button className={`${styles.panelButton} ${styles.Active}`} onClick={()=>{setSelectedPanel("WalkIn Form")}}>Walk in Form</button>
						<button className={`${styles.panelButton}`} onClick={()=>{setSelectedPanel("WalkIn List")}}>Walk in List</button>
					</div>

					<div className={styles.Body}>
						<div className={styles.DetailsRow}>
							<input className={styles.DetailsFields} type="text" data-key="LastName"  placeholder="LastName"/>
							<input className={styles.DetailsFields} type="text" data-key="FirstName"  placeholder="FirstName"/>
							<input className={styles.DetailsFields} type="text" data-key="MiddleName" placeholder="MiddleName"/>
						</div>
						<div className={styles.DetailsRow}>
							<input className={styles.DetailsFields} type="text" data-key="Address" placeholder="Address"/>
						</div>
						<div className={styles.DetailsRow}>
							<input className={styles.DetailsFields} type="date" data-key="Birthday" placeholder="Birthday"/>
							<input className={styles.DetailsFields} type="text" data-key="Age" placeholder="Age"/>
							<select className={styles.DetailsFields} type="text" placeholder="Sex"> 
								<option value="">Sex...</option>
								<option value="Male">Male</option>
								<option value="Female">Female</option>
							</select>
						</div>
						<div className={styles.DetailsRow}>
							<input className={styles.DetailsFields} type="text" data-key="CourseStrand"  placeholder="Course / Strand"/>
							<input className={styles.DetailsFields} type="text" data-key="YearLevel"  placeholder="Year Level"/>
							<input className={styles.DetailsFields} type="text" data-key="SchoolEmail" placeholder="School Email"/>
							<input className={styles.DetailsFields} type="text" data-key="StudentNumber" placeholder="Student Number"/>
						</div>	
						<div className={styles.DetailsRow}>
							<input className={styles.DetailsFields} type="text" data-key="CourseStrand"  placeholder="Contact Number"/>
							<input className={styles.DetailsFields} type="text" data-key="InCaseOfEmergencyPerson"  placeholder="In case of emergency person"/>
							<input className={styles.DetailsFields} type="text" data-key="InCaseOfEmergencyNumber" placeholder="In case of emergency number"/>
						</div>	
						<div className={styles.DetailsRow}>
							<textarea className={styles.DetailsFields} placeholder="Concern" name="" id="" cols="30" rows="10"></textarea>
						</div>
						<div className={styles.DetailsRow}>
							<button className={styles.DetailsButton}>Add record</button>
						</div>
					</div>	
				</>
			) : SelectedPanel === "WalkIn Edit Form" ? (
				<>
					{/* <div className={styles.Header}>
						<div className={styles.title}>Walk in List</div>
						<button className={`${styles.panelButton}`} onClick={()=>{setSelectedPanel("WalkIn Form")}}>Walk in Form</button>
						<button className={`${styles.panelButton} ${styles.Active}`} onClick={()=>{setSelectedPanel("WalkIn List")}}>Walk in List</button>
					</div>

					<div className={styles.Body}>

						<input placeholder="Search..." type="search" onChange={(e)=>setFilter(e.target.value)}/>
						
						{isLoading ? "Loading..." : filteredData.length === 0 ? "No results" : filteredData?.map((appointment, index) => (
							<div key={index} className={`${styles.Appointment} ${styles.Active}`}  onClick={() => {mutate; appointmentId === appointment._id ? setAppintmentId("") : setAppintmentId(appointment._id)}}>
								<p className={styles.aName}>Name: <a className={styles.aNameText}>{appointment.Name}</a></p>
								<p className={styles.aDate}>Date: <a className={styles.aDateText}>{appointment.createdAt}</a></p>
							</div>
						))}

					</div> */}
				</>
			) : (
				<>
					<div className={styles.Header}>
						<div className={styles.title}>Walk in List</div>
						<button className={`${styles.panelButton}`} onClick={()=>{setSelectedPanel("WalkIn Form")}}>Walk in Form</button>
						<button className={`${styles.panelButton} ${styles.Active}`} onClick={()=>{setSelectedPanel("WalkIn List")}}>Walk in List</button>
					</div>

					<div className={styles.Body}>

						<input placeholder="Search..." type="search" onChange={(e)=>setFilter(e.target.value)}/>
						
						{isLoading ? "Loading..." : filteredData.length === 0 ? "No results" : filteredData?.map((appointment, index) => (
							<div key={index} className={`${styles.Appointment} ${styles.Active}`}  onClick={() => {mutate; appointmentId === appointment._id ? setAppintmentId("") : setAppintmentId(appointment._id)}}>
								<p className={styles.aName}>Name: <a className={styles.aNameText}>{appointment.Name}</a></p>
								<p className={styles.aDate}>Date: <a className={styles.aDateText}>{appointment.createdAt}</a></p>
							</div>
						))}

					</div>
				</>
			)}
		
			
		
		</div>
	)
};

export default Pending;


