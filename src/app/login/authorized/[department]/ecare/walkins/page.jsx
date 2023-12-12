"use client"

import React, { useState } from "react";
import useSWR from "swr";
import { useRouter  } from "next/navigation";
import styles from "./page.module.css";
import ActionConfirmation from "@/components/ActionConfirmation/ActionConfirmation";
import 'react-datepicker/dist/react-datepicker.css';


const WalkIn = ({ params }) => {
	const Department = params.department;
	const router = useRouter();

	const [filter,setFilter] = useState("");
	const [UploadingForm,setUploadingForm] = useState(false);
	const [UpdatingForm,setUpdatingForm] = useState(false);
	const [DeletingRecord,setDeletingRecord] = useState(false);

	const [SelectedPanel,setSelectedPanel] = useState("WalkIn Form");

	const [SelectedRecordId,setSelectedRecordId] = useState("");

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

	const UpdateDetails = async (e) => {
		try {
			setShowConfirmation(false);
			setUpdatingForm(true);

			console.log(e.target.dataset.key+" : "+e.target.value);
			
			const formData = new FormData(); 
			formData.append("RecordId", SelectedRecordId);
			formData.append("Department", Department);
			formData.append("Key", e.target.dataset.key);
			formData.append("Value", e.target.value);

			const response = await fetch("/api/records/POST_UpdateRecordDetails", {
				method: "POST",
				body: formData,
			});
		
			if (response.ok) {
				console.log("Complete");
			} else {
				console.log("Failed");
			}
		} catch (err) {
			console.log(err);
		} finally {
			setUpdatingForm(false);
			mutate(); 
		}
	};

	const DeleteRecord = async (e) => {
		setShowConfirmation(false);
		try {
			setDeletingRecord(true);
			
			const formData = new FormData(); 
			formData.append("RecordId", e.target.dataset.record);
			formData.append("Department", Department);

			const response = await fetch("/api/records/POST_DeleteRecord", {
				method: "POST",
				body: formData,
			});
		
			if (response.ok) {
				console.log("Complete");
			} else {
				console.log("Failed");
			}
		} catch (err) {
			console.log(err);
		} finally {
			setDeletingRecord(false);
			mutate(); 
		}
	};

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

	const DeleteConfirmation = (e) => {
		if(e.target.dataset.record) {
			setConfirmationData({
				title: "Delete Record Confirmation",
				content: `Do you like to delete this record of [ ${e.target.dataset.name} ]?`,
				onYes: () => DeleteRecord(e),
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

	let details = null;
	if(SelectedRecordId){
		details = data.find(record => record._id === SelectedRecordId);
	}
	

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
							<input className={styles.DetailsFields} type="text" name="Address" data-key="Address" placeholder="Address" required/>
						</div>
						<div className={styles.DetailsRow}>
							<input className={styles.DetailsFields} type="date" name="Birthday" data-key="Birthday" placeholder="Birthday" required/>
							<input className={styles.DetailsFields} type="text" name="Age" data-key="Age" placeholder="Age" required/>
							<select className={styles.DetailsFields} type="text" name="Sex" placeholder="Sex" required> 
								<option value="">Sex...</option>
								<option value="Male">Male</option>
								<option value="Female">Female</option>
							</select>
							<select className={styles.DetailsFields} ype="text" name="Category" placeholder="Category" required> 
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
							<input className={styles.DetailsFields} type="text" name="ContactNumber" data-key="ContactNumber"  placeholder="Contact Number" required />
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
					<div className={styles.Header}>
						<div className={styles.title}>Walk in Edit Form</div>
						<button className={`${styles.panelButton}`} onClick={() => { setSelectedPanel("WalkIn Form") }}>Walk in Form</button>
						<button className={`${styles.panelButton}`} onClick={() => { setSelectedPanel("WalkIn List") }}>Walk in List</button>
					</div>

					{details ? (

						<div className={styles.Body}>
							<div className={styles.DetailsRow}>
								<input className={styles.DetailsFields} disabled={UpdatingForm} type="text" name="LastName" onBlur={ChangeConfirmation} defaultValue={details?.Details?.LastName??""} data-key="LastName" data-value={details?.Details?.LastName??""}  placeholder="LastName" required/>
								<input className={styles.DetailsFields} disabled={UpdatingForm} type="text" name="FirstName" onBlur={ChangeConfirmation} defaultValue={details?.Details?.FirstName??""} data-key="FirstName" data-value={details?.Details?.FirstName??""}  placeholder="FirstName" required/>
								<input className={styles.DetailsFields} disabled={UpdatingForm} type="text" name="MiddleName" onBlur={ChangeConfirmation} defaultValue={details?.Details?.MiddleName??""} data-key="MiddleName" data-value={details?.Details?.MiddleName??""} placeholder="MiddleName"/>
							</div>
							<div className={styles.DetailsRow}>
								<input className={styles.DetailsFields} disabled={UpdatingForm} type="text" name="Address" onBlur={ChangeConfirmation} defaultValue={details?.Details?.Address??""} data-key="Address" data-value={details?.Details?.Address??""} placeholder="Address" required/>
							</div>
							<div className={styles.DetailsRow}>
								<input className={styles.DetailsFields} disabled={UpdatingForm} type="date" name="Birthday" onChange={ChangeConfirmation} defaultValue={details?.Details?.Birthday??""} data-key="Birthday" data-value={details?.Details?.Birthday??""} placeholder="Birthday" required/>
								<input className={styles.DetailsFields} disabled={UpdatingForm} type="text" name="Age" onBlur={ChangeConfirmation} defaultValue={details?.Details?.Age??""} data-key="Age" data-value={details?.Details?.Age??""} placeholder="Age" required/>
								<select className={styles.DetailsFields} disabled={UpdatingForm} type="text" name="Sex" onChange={ChangeConfirmation} defaultValue={details?.Details?.Sex??""} data-key="Sex" data-value={details?.Details?.Sex??""} placeholder="Sex" required> 
									<option value="">Sex...</option>
									<option value="Male">Male</option>
									<option value="Female">Female</option>
								</select>
								<select className={styles.DetailsFields} disabled={UpdatingForm} type="text" name="Category" onChange={ChangeConfirmation} defaultValue={details?.Category??""}  data-key="Category" data-value={details?.Category??""} placeholder="Category" required> 
									<option value="">Category...</option>
									<option value="Student">Student</option>
									<option value="Lay Collaborator">Lay Collaborator</option>
								</select>
							</div>
							<div className={styles.DetailsRow}>
								<input className={styles.DetailsFields} disabled={UpdatingForm} type="text" name="CourseStrand" onBlur={ChangeConfirmation} defaultValue={details?.Details?.CourseStrand??""} data-key="CourseStrand" data-value={details?.Details?.CourseStrand??""}  placeholder="Course / Strand"/>
								<input className={styles.DetailsFields} disabled={UpdatingForm} type="text" name="YearLevel" onBlur={ChangeConfirmation} defaultValue={details?.Details?.YearLevel??""} data-key="YearLevel" data-value={details?.Details?.YearLevel??""}  placeholder="Year Level"/>
								<input className={styles.DetailsFields} disabled={UpdatingForm} type="text" name="GoogleEmail" onBlur={ChangeConfirmation} defaultValue={details?.GoogleEmail??""} data-key="GoogleEmail" data-value={details?.GoogleEmail??""} placeholder="School Email" required />
								<input className={styles.DetailsFields} disabled={UpdatingForm} type="text" name="StudentNumber" onBlur={ChangeConfirmation} defaultValue={details?.Details?.StudentNumber??""} data-key="StudentNumber" data-value={details?.Details?.StudentNumber??""} placeholder="Student Number"/>
							</div>	
							<div className={styles.DetailsRow}>
								<input className={styles.DetailsFields} disabled={UpdatingForm} type="text" name="ContactNumber" onBlur={ChangeConfirmation} defaultValue={details?.Details?.ContactNumber??""} data-key="ContactNumber" data-value={details?.Details?.ContactNumber??""}  placeholder="Contact Number" required />
								<input className={styles.DetailsFields} disabled={UpdatingForm} type="text" name="InCaseOfEmergencyPerson" onBlur={ChangeConfirmation} defaultValue={details?.Details?.InCaseOfEmergencyPerson??""} data-key="InCaseOfEmergencyPerson" data-value={details?.Details?.InCaseOfEmergencyPerson??""}  placeholder="In case of emergency person" required />
								<input className={styles.DetailsFields} disabled={UpdatingForm} type="text" name="InCaseOfEmergencyNumber" onBlur={ChangeConfirmation} defaultValue={details?.Details?.InCaseOfEmergencyNumber??""} data-key="InCaseOfEmergencyNumber" data-value={details?.Details?.InCaseOfEmergencyNumber??""} placeholder="In case of emergency number" required />
							</div>	
							<div className={styles.DetailsRow}>
								<textarea className={styles.DetailsFields} disabled={UpdatingForm} placeholder="Concern" name="Concern" onBlur={ChangeConfirmation} defaultValue={details?.Details?.Concern??""} id="" cols="30" rows="10" required></textarea>
							</div>
						</div>	
					) : (
						<p>Appointment not found.</p>
					)}
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
							<div key={index} className={`${styles.record} ${styles.Active}`}>
								<p className={styles.recordName}>{record.Details.LastName}, {record.Details.FirstName} {record.Details.MiddleName}</p>
								<button disabled={DeletingRecord} className={styles.recordEditBtn} data-record={record._id} onClick={() => {mutate; SelectedRecordId === record._id ? null : setSelectedRecordId(record._id); setSelectedPanel("WalkIn Edit Form")}}>Edit</button>
								<button disabled={DeletingRecord} className={styles.recordDeleteBtn} data-record={record._id} data-name={`${record.Details.LastName}, ${record.Details.FirstName} ${record.Details.MiddleName}`} onClick={DeleteConfirmation}>Delete</button>
							</div>
						))}

					</div>
				</>
			)}
		
		</div>
	)
};

export default WalkIn;


