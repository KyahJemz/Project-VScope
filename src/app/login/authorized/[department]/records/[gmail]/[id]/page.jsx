"use client"

import React, { useState } from "react";
import useSWR from "swr";
import { useRouter  } from "next/navigation";
import styles from "./page.module.css";
import Image from "next/image";
import UserDefault from "public/UserDefault.png";
import ActionConfirmation from "@/components/ActionConfirmation/ActionConfirmation";
import DentalNgipinList from "public/DentalNgipinList.png";

const Page = ({ params }) => {
	const Department = params.department;
	const GoogleEmail = params.gmail;
	const Id = params.id;
	const router = useRouter();
	const dateRange = [];

	const fetcher = (...args) => fetch(...args).then((res) => res.json());
    
	const { data, mutate, error, isLoading } =  useSWR(
		`/api/records/GET_Record?Department=${encodeURIComponent(Department)}&Id=${encodeURIComponent(Id)}`,
		fetcher
	);

	if (!isLoading) {
		let DateApproved = new Date(data.DateApproved);
		console.log(data.DateApproved);
		
		let DateCleared = data.DateCleared;
		if (!DateCleared || DateCleared.trim() === "") {
		  DateCleared = new Date();
		} else {
		  DateCleared = new Date(DateCleared);
		}
	
		const timeDifference = DateCleared.getTime() - DateApproved.getTime();
		const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
	
		for (let i = 0; i <= daysDifference; i++) {
		  const currentDate = new Date(DateApproved);
		  currentDate.setDate(DateApproved.getDate() + i);
		  dateRange.push(currentDate);
		}
		console.log(dateRange);
	}

	return (
		<div className={styles.MainContent}>

			{isLoading && !data ? 
				"Loading..."
			:
				<>

					{Department === "Dental" ? 
						<>
							<Image 
								className={styles.NgipinList}
								src={DentalNgipinList}
								alt="x"
								width="auto"
								height="auto"
							/>
						</>
					: null}


					<div className={styles.Profile}>
						<div className={styles.ProfileTop}>
							<Image 
								className={styles.ProfileImage}
								src={data.GoogleImage === "" || data.GoogleImage === null ? UserDefault : data.GoogleImage}
								alt="x"
								width={150}
								height={150}
							/>
							<p className={styles.ProfileName}>{data?.Details?.FirstName??""} {data?.Details?.MiddleName??""} {data?.Details?.LastName??""}</p>
							<p className={styles.ProfileId}>{data?.Details?.StudentNumber??"n/a"}</p>
							<p className={styles.ProfileEmail}>{data?.GoogleEmail??"n/a"}</p>
							{data.Status === "Pending" || data.Status === "Rejected" ? null :
								<button className={styles.AssessmentHistoryBtn} onClick={()=>router.push('/login/authorized/'+Department+'/records/'+GoogleEmail+'/'+Id+'/messages')}>View Messages</button>
							}
						</div>

					</div>



					<div className={styles.Details}>
						<div className={styles.DetailsRow}>
							<input className={styles.DetailsInput} value={data?.Details?.LastName??"n/a"} type="text" readOnly disabled name="LastName" placeholder="Last Name" title="Last Name"/>
							<input className={styles.DetailsInput} value={data?.Details?.FirstName??"n/a"} type="text" readOnly disabled name="FirstName" placeholder="First Name" title="First Name"/>
							<input className={styles.DetailsInput} value={data?.Details?.MiddleName??"n/a"} type="text" readOnly disabled name="MiddleName" placeholder="Middle Name" title="Middle Name"/>
						</div>
						<div className={styles.DetailsRow}>
							<input className={styles.DetailsInput} value={data?.Details?.CourseStrand??"n/a"} type="text" readOnly disabled name="CourseStrand" placeholder="Course / Strand" title="Course / Strand"/>
							<input className={styles.DetailsInput} value={data?.Details?.YearLevel??"n/a"} type="text" readOnly disabled name="YearLevel" placeholder="Year Level" title="Year Level"/>
						</div>
						<div className={styles.DetailsRow}>
							<input className={styles.DetailsInput} value={data?.Details?.StudentNumber??"n/a"} type="text" readOnly disabled name="StudentNumber" placeholder="Student Number" title="Student Number"/>
							<input className={styles.DetailsInput} value={data?.Details?.SchoolEmail??"n/a"} type="text" readOnly disabled name="SchoolEmail" placeholder="School Email" title="School Email"/>
						</div>
						<div className={styles.DetailsRow}>
							<input className={styles.DetailsInput} value={data?.Details?.Address??"n/a"} type="text" readOnly disabled name="Address" placeholder="Address" title="Address"/>
						</div>
						<div className={styles.DetailsRow}>
							<input className={styles.DetailsInput} value={data?.Details?.Birthday??"n/a"} type="text" readOnly disabled name="Birthday" placeholder="Birthday" title="Birthday"/>
							<input className={styles.DetailsInput} value={data?.Details?.Age??"n/a"} type="text" readOnly disabled name="Age" placeholder="Age" title="Age"/>
							<input className={styles.DetailsInput} value={data?.Details?.Sex??"n/a"} type="text" readOnly disabled name="Sex" placeholder="Sex" title="Sex"/>
							<input className={styles.DetailsInput} value={data?.Details?.ContactNumber??"n/a"} type="text" readOnly disabled name="ContactNumber" placeholder="Contact Number" title="Contact Number"/>
						</div>
						<div className={styles.DetailsRow}>
							<input className={styles.DetailsInput} value={data?.Details?.InCaseOfEmergencyPerson??"n/a"} type="text" readOnly disabled name="InCaseOfEmergencyPerson" placeholder="Emergency Person" title="Emergency Person"/>
							<input className={styles.DetailsInput} value={data?.Details?.InCaseOfEmergencyNumber??"n/a"} type="text" readOnly disabled name="InCaseOfEmergencyNumber" placeholder="Emergency Number" title="Emergency Number"/>
						</div>
					</div>
		

		
					<div className={styles.Diagnosis}>
						<p className={styles.ListTitle}>Diagnosis</p>
						<hr className={styles.Line}/>
						{data && data?.Diagnosis && data.Diagnosis.length > 0 ? data.Diagnosis.map((diagnosis, index) => (
							<div key={index} className={styles.ListItem}>
								<p className={styles.ListItemText}>{diagnosis.Diagnosis}</p>
							</div>
						)) : 
							"No Records"
						}
					</div>



					<div className={styles.Prescription}>
						<p className={styles.ListTitle}>Prescriptions</p>
						<hr className={styles.Line} />
						{data && data?.Prescriptions && data.Prescriptions.length > 0 ? data.Prescriptions.map((prescription, index) => (
							<div key={index} className={styles.ListItem}>
								<p className={styles.ListItemText}>{prescription.Prescription}</p>
							</div>
						)) : 
							"No Records"
						}
					</div>
					{Department === "SDPC" ? 
						<div className={styles.Prescription}>
							<p className={styles.ListTitle}>Service Offered</p>
							<hr className={styles.Line} />
							{data && data?.Prescriptions && data.Prescriptions.length > 0 ? data.Prescriptions.map((prescription, index) => (
								<div key={index} className={styles.ListItem}>
									<p className={styles.ListItemText}>{prescription.Prescription}</p>
								</div>
							)) : 
								"No Records"
							}
						</div>
					:
						<div className={styles.Prescription}>
							<p className={styles.ListTitle}>Prescriptions</p>
							<hr className={styles.Line} />
							{data && data?.Prescriptions && data.Prescriptions.length > 0 ? data.Prescriptions.map((prescription, index) => (
								<div key={index} className={styles.ListItem}>
									<p className={styles.ListItemText}>{prescription.Prescription}</p>
								</div>
							)) : 
								"No Records"
							}
						</div>
					}



					<div className={styles.Note}>
						<p className={styles.ListTitle}>Notes</p>
						<hr className={styles.Line}/>
						{data && data?.Notes && data.Notes.length > 0 ? data.Notes.map((note, index) => (
							<div key={index} className={styles.ListItem}>
								<p className={styles.ListItemText}>{note.Note}</p>
							</div>
						)) : 
							"No Records"
						}
					</div>
					


					<div className={styles.Days}>
						<div className={styles.DaysTitle}>Day:</div>
						{dateRange.map((date, index) => (
							<div key={index} className={styles.DayItem}>
								{index+1}
							</div>
						))}
					</div>



					<div className={styles.Status}>
						{data.Status}
					</div>
				</>
			}	
		</div>
	)
};

export default Page;


