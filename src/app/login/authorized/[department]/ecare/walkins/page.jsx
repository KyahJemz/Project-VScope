"use client"

import React, { useState } from "react";
import useSWR from "swr";
import { useRouter  } from "next/navigation";
import styles from "./page.module.css";
import ActionConfirmation from "@/components/ActionConfirmation/ActionConfirmation";
import 'react-datepicker/dist/react-datepicker.css';


const Pending = ({ params }) => {
	const Department = params.department;
	const router = useRouter();

	const [filter,setFilter] = useState("");
	const [UploadingForm,setUploadingForm] = useState(false);

	const [SelectedPanel,setSelectedPanel] = useState("WalkIn Form");
	const [SelectedAppointmentId,setSelectedAppointmentId] = useState(null);

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
		`/api/records/GET_Records?GoogleEmail=&Department=${encodeURIComponent(Department)}&Status&Type=${encodeURIComponent("WalkIn")}`,
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
		const fullName = `${appointment.Details.FirstName} ${appointment.Details.MiddleName} ${appointment.Details.LastName}`;
		const lowerCaseFilter = filter.toLowerCase();
		
		if (filter !== "" && !fullName.toLowerCase().includes(lowerCaseFilter)) {
		  return false;
		}
		
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

	const UploadWalkIn = async (e) => {
		e.preventDefault();
		setUploadingForm(true)

		try {

			const formData = new FormData(e.target);
			formData.append("Type", "WalkIn");
			formData.append("Status", "In Progress");
			formData.append("Department", Department);
			formData.append("GoogleImage", "");

			const response = await fetch("/api/records/POST_AddRecord", {
				method: "POST",
				body: formData,
			});

			mutate(); 
           
            if (response.ok) {
                console.log("Complete");
            } else {
                console.log("Failed");
            }
        } catch (err) {
            console.log(err);
        } finally {
			setUploadingForm(false);
			e.target.reset();
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

					<form className={styles.Body} onSubmit={UploadWalkIn}>
						<div className={styles.DetailsRow}>
							<input className={styles.DetailsFields} type="text" name="LastName" data-key="LastName"  placeholder="LastName" required/>
							<input className={styles.DetailsFields} type="text" name="FirstName" data-key="FirstName"  placeholder="FirstName" required/>
							<input className={styles.DetailsFields} type="text" name="MiddleName" data-key="MiddleName" placeholder="MiddleName"/>
						</div>
						<div className={styles.DetailsRow}>
							<input className={styles.DetailsFields} type="text" name="LastName" data-key="Address" placeholder="Address" required/>
						</div>
						<div className={styles.DetailsRow}>
							<input className={styles.DetailsFields} type="date" name="Birthday" data-key="Birthday" placeholder="Birthday" required/>
							<input className={styles.DetailsFields} type="text" name="Age" data-key="Age" placeholder="Age" required/>
							<select className={styles.DetailsFields} type="text" name="Sex" placeholder="Sex" required> 
								<option value="">Sex...</option>
								<option value="Male">Male</option>
								<option value="Female">Female</option>
							</select>
							<select className={styles.DetailsFields} type="text" name="Category" placeholder="Category" required> 
								<option value="">Category...</option>
								<option value="Student">Student</option>
								<option value="Lay Collaborator">Lay Collaborator</option>
							</select>
						</div>
						<div className={styles.DetailsRow}>
							<input className={styles.DetailsFields} type="text" name="CourseStrand" data-key="CourseStrand"  placeholder="Course / Strand"/>
							<input className={styles.DetailsFields} type="text" name="YearLevel" data-key="YearLevel"  placeholder="Year Level"/>
							<input className={styles.DetailsFields} type="text" name="GoogleEmail" data-key="GoogleEmail" placeholder="School Email" required />
							<input className={styles.DetailsFields} type="text" name="StudentNumber" data-key="StudentNumber" placeholder="Student Number"/>
						</div>	
						<div className={styles.DetailsRow}>
							<input className={styles.DetailsFields} type="text" name="CourseStrand" data-key="CourseStrand"  placeholder="Contact Number" required />
							<input className={styles.DetailsFields} type="text" name="InCaseOfEmergencyPerson" data-key="InCaseOfEmergencyPerson"  placeholder="In case of emergency person" required />
							<input className={styles.DetailsFields} type="text" name="InCaseOfEmergencyNumber" data-key="InCaseOfEmergencyNumber" placeholder="In case of emergency number" required />
						</div>	
						<div className={styles.DetailsRow}>
							<textarea className={styles.DetailsFields} placeholder="Concern" name="Concern" id="" cols="30" rows="10" required></textarea>
						</div>
						<div className={styles.DetailsRow}>
							{UploadingForm ? (
								<button type="submit" disabled className={styles.DetailsButton}>Uploading...</button>
							) : (
								<button type="submit" className={styles.DetailsButton}>Add record</button>
							)} 
							
						</div>
					</form>	
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

						<input className={styles.SearchBar} placeholder="Search..." type="search" onChange={(e)=>setFilter(e.target.value)}/>
						
						{isLoading ? "Loading..." : filteredData.length === 0 ? "No results" : filteredData?.map((record, index) => (
							<div key={index} className={`${styles.record} ${styles.Active}`}  onClick={() => {mutate; SelectedAppointmentId === record._id ? setSelectedAppointmentId("") : setSelectedAppointmentId(record._id)}}>
								<p className={styles.recordName}>{record.Details.LastName}, {record.Details.FirstName} {record.Details.MiddleName}</p>
								<button className={styles.recordEditBtn} data-record={record._id}>Edit</button>
								<button className={styles.recordDeleteBtn} data-record={record._id}>Delete</button>
							</div>
						))}

					</div>
				</>
			)}
		
			
		
		</div>
	)
};

export default Pending;


