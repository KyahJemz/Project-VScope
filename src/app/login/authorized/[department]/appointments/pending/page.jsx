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
	const Status = "Pending";
	const router = useRouter();

	const [filter,setFilter] = useState("");
	const [appointmentId,setAppintmentId] = useState("");
	const [isApproving,setIsApproving] = useState(false);
	const [isReScheduling,setIsReScheduling] = useState(false);
	const [isUpdatingDetails,setUpdatingDetails] = useState(false);
	const [selectedDate,setselectedDate] = useState(null);
	const [selectedTime,setselectedTime] = useState(null);

	const [showConfirmation,setShowConfirmation] = useState(false);
	const [ConfirmationData, setConfirmationData] = useState({
		title: "",
		content: "",
		onYes: () => {},
		onCancel: () => {},
	});

	const [showReSchedulePanel,setShowReSchedulePanel] = useState(false);

	const formatShortDate = (timestamp) => {
		const options = { month: 'short', day: 'numeric', year: 'numeric' };
		const formattedDate = new Date(timestamp).toLocaleDateString(undefined, options);
	  
		return `${formattedDate}`;
	};

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
		`/api/records/GET_Records?GoogleEmail=&Department=${encodeURIComponent(Department)}&Status=${encodeURIComponent(Status)}`,
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

	const UpdateDetails = async (e) => {
		try {
			setShowConfirmation(false);
			setUpdatingDetails(true)

			console.log(e.target.dataset.key+" : "+e.target.value);
            
            const formData = new FormData(); 
            formData.append("AppointmentId", appointmentId);
			formData.append("Department", Department);
			formData.append("Key", e.target.dataset.key);
            formData.append("Value", e.target.value);

            const response = await fetch("", {
                method: "POST",
                body: formData,
            });
        
			setUpdatingDetails(false)

            mutate(); 
           
            if (response.ok) {
                console.log("Complete");
            } else {
                console.log("Failed");
            }
        } catch (err) {
            console.log(err);
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

	const UpdateApprove = async (e) => {
		try {
			setShowConfirmation(false);
            setIsApproving(true);
            
            const formData = new FormData(); 
            formData.append("AppointmentId", appointmentId);
			formData.append("Department", Department);
            formData.append("Status", "Approved");

            const response = await fetch("/api/appointments/POST_UpdateStatus", {
                method: "POST",
                body: formData,
            });
        
            setIsApproving(false);

            mutate(); 
           
            if (response.ok) {
                console.log("Complete");
            } else {
                console.log("Failed");
            }
        } catch (err) {
            console.log(err);
        }
	}

	const OnApprove = (e) => {
		setConfirmationData({
			title: "Approve Confirmation",
			content: "Please confirm your action",
			onYes: () => UpdateApprove(e),
			onCancel: () => setShowConfirmation(false),
		});
		setShowConfirmation(true);
	}

	const OnReSchedule= (e) => {
		if (appointmentId !== "") {
			const details = data.find(appointment => appointment._id === appointmentId);
			setselectedDate(new Date(e.target.dataset.date));
			setselectedTime(e.target.dataset.time);
			setShowReSchedulePanel(true);
			setIsReScheduling(true);
		}
	}

	const UpdateSchedule = async (e) => {
		try {

			const formattedDate = format(selectedDate, 'yyyy-MM-dd');
            const formData = new FormData(); 
            formData.append("AppointmentId", appointmentId);
			formData.append("Department", Department);
            formData.append("Date", formattedDate);
			formData.append("Time", selectedTime);

            const response = await fetch("/api/records/POST_UpdateSchedule", {
                method: "POST",
                body: formData,
            });
        
            setIsReScheduling(false);
			setselectedDate(null);
			setselectedTime(null);

            mutate(); 
           
            if (response.ok) {
                console.log("Complete");
            } else {
                console.log("Failed");
            }
        } catch (err) {
            console.log(err);
        }
	}

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
						<input className={styles.DetailsFields} type="text" defaultValue={details?.Details?.CourseStrand??""} data-value={details?.Details?.CourseStrand??""} data-key="CourseStrand" onBlur={ChangeConfirmation} placeholder="Course / Strand"/>
						<input className={styles.DetailsFields} type="text" defaultValue={details?.Details?.YearLevel??""} data-value={details?.Details?.YearLevel??""} data-key="YearLevel" onBlur={ChangeConfirmation} placeholder="Year Level"/>
						<input className={styles.DetailsFields} type="text" defaultValue={details?.Details?.OtherEmail??""} data-value={details?.Details?.OtherEmail??""} data-key="OtherEmail" onBlur={ChangeConfirmation} placeholder="Any other email to contact"/>
					</div>
					<div className={styles.DetailsRow}>
						<input className={styles.DetailsFields} type="text" defaultValue={details?.Details?.StudentNumber??""} data-value={details?.Details?.StudentNumber??""} data-key="StudentNumber" onBlur={ChangeConfirmation} placeholder="Student Id"/>
						<input className={styles.DetailsFields} type="text" defaultValue={details?.Details?.ContactNumber??""} data-value={details?.Details?.ContactNumber??""} data-key="ContactNumber" onBlur={ChangeConfirmation} placeholder="Contact Number"/>
					</div>
					<div className={styles.DetailsRow}>
						<input className={styles.DetailsFields} readOnly disabled type="text" defaultValue={`${formatShortDate(details?.AppointmentDate)??""} ${details?.AppointmentTime??""}`} placeholder="Appointment Date"/>
						<input className={styles.DetailsFields} readOnly disabled type="text" defaultValue={""} placeholder="Diagnosis"/>
					</div>
					<div className={styles.DetailsRow}>
						<textarea className={styles.DetailsFields} defaultValue={details?.Details?.Concern??""} readOnly disabled placeholder="Concern" name="" id="" cols="30" rows="10"></textarea>
					</div>
					{isApproving || isReScheduling || isUpdatingDetails? (
						<div className={styles.DetailsRow}>
							<button className={styles.DetailsButton} disabled>Loadding...</button>
							<button className={styles.DetailsButton} disabled>Loadding...</button>
						</div>
					) : (
						<div className={styles.DetailsRow}>
							<button className={styles.DetailsButton} data-date={details?.AppointmentDate??""} data-time={details?.AppointmentTime??""} onClick={OnReSchedule}>RE-SCHEDULE</button>
							<button className={styles.DetailsButton} onClick={OnApprove}>APPROVED</button>
						</div>
					)}
				</>
			);
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

			{showReSchedulePanel && (
				<div className={styles.ReSchedulePanel}>
					<div className={styles.ReScheduleForm}>
					<div className={styles.ReSchedulePanelRow}>
						<p>Schedule Date:</p>
						<DatePicker
							className={styles.ReScheduleDate}
							selected={new Date(selectedDate)}
							onChange={(date) => setselectedDate(date)}
							dateFormat="MMMM d, yyyy"
							placeholderText="Select a date"
						/>
					</div>

					<div className={styles.ReSchedulePanelRow}>
						<p>Schedule Time:</p>
						<select className={styles.ReScheduleDate} name="" id="" defaultValue={selectedTime} onChange={(e)=>setselectedTime(e.target.value)}>
							<option value="8am-10am">8am - 10am</option>
							<option value="10am-12pm">10am - 12pm</option>
							<option value="1pm-3pm">1pm - 3pm</option>
							<option value="3pm-4pm">3pm - 4pm</option>
						</select>
					</div>

					<div className={styles.ReSchedulePanelRow}>
						<button className={styles.ReScheduleButton} onClick={()=>{setShowReSchedulePanel(false); setIsReScheduling(false)}}>Cancel</button>
						<button className={styles.ReScheduleButton} onClick={(e)=>{UpdateSchedule(e); setShowReSchedulePanel(false)}}>Update</button>
					</div>
					</div>
					
				</div>
            )}
		
			<div className={styles.Header}>
				<p>Appointments {Status} List</p>
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

export default Pending;


