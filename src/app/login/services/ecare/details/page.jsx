"use client"

import React, { useState, useEffect } from "react";
import useSWR from "swr";
import styles from "./page.module.css";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Image from "next/image";
import UserDefault from "public/UserDefault.png"
import ActionConfirmation from "@/components/ActionConfirmation/ActionConfirmation";
import { Data } from "@/models/Data";

const Page = () => {
	const { data: session, status } = useSession();
	const [GoogleEmail, setGoogleEmail] = useState("");
	const [UploadingForm,setUploadingForm] = useState(false);
  
	useEffect(() => {
	  if (status === "authenticated" && session?.user?.email) {
		console.log(session.user.email);
		setGoogleEmail(session.user.email);
	  }
	}, [status, session]);

	const [isUpdatingDetails,setUpdatingDetails] = useState(false);

	const [showConfirmation,setShowConfirmation] = useState(false);
	const [ConfirmationData, setConfirmationData] = useState({
		title: "",
		content: "",
		onYes: () => {},
		onCancel: () => {},
	});
  
	const fetcher = (...args) => fetch(...args).then((res) => res.json());
  
	const { data, mutate, error, isLoading } = useSWR(
	  `/api/accounts/details?GoogleEmail=${encodeURIComponent(GoogleEmail)}`,
	  fetcher
	);
 
	if(!isLoading) {
		console.log(data);
	}
  
	if (status === "loading") {
	  return (
		<div className={styles.MainContainer}>
			Session Loading...
		</div>
	  )
	}

	const UpdateDetails = async (e) => {
		try {
			setShowConfirmation(false);
			setUpdatingDetails(true)
            
            const formData = new FormData(); 
            formData.append("GoogleEmail", GoogleEmail);
			formData.append("Key", e.target.dataset.key);
            formData.append("Value", e.target.value);

            const response = await fetch("/api/accounts/updateDetails", {
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
  
	const DetailsForm = () => {
		return (
			<div className={styles.DetailsFormContainer}>

				<div className={styles.ProfileContainer}>
					<Image
						className={styles.ProfileImage}
						src={session.user?.image??UserDefault}
						alt="profile picture" 
						width={150}
						height={150}
					/>
					<p className={styles.ProfileName}>{session.user.name}</p>
					<p className={styles.ProfileEmail}>{session.user.email}</p>
				</div>

				<div className={styles.DetailsForm}>
					<div className={styles.DetailsRow}>
						<p className={styles.DetailsFormTitle}>Please update your details.</p>
					</div>
					<div className={styles.DetailsRow}>
						<input className={styles.DetailsFields} type="text" name="LastName" data-key="LastName" defaultValue={data?.Details?.LastName??""} data-value={data?.Details?.LastName??""}  placeholder="LastName" onBlur={ChangeConfirmation}/>
						<input className={styles.DetailsFields} type="text" name="FirstName" data-key="FirstName"  defaultValue={data?.Details?.FirstName??""} data-value={data?.Details?.FirstName??""} placeholder="FirstName" onBlur={ChangeConfirmation}/>
						<input className={styles.DetailsFields} type="text" name="MiddleName" data-key="MiddleName" defaultValue={data?.Details?.MiddleName??""} data-value={data?.Details?.MiddleName??""} placeholder="MiddleName" onBlur={ChangeConfirmation}/>
					</div>
					<div className={styles.DetailsRow}>
						<input className={styles.DetailsFields} type="text" name="Address" data-key="Address" defaultValue={data?.Details?.Address??""} data-value={data?.Details?.Address??""} placeholder="Address" onBlur={ChangeConfirmation}/>
					</div>
					<div className={styles.DetailsRow}>
						<input className={styles.DetailsFields} type="date" name="Birthday" data-key="Birthday" defaultValue={data?.Details?.Birthday??""} data-value={data?.Details?.Birthday??""} placeholder="Birthday" onChange={ChangeConfirmation}/>
						<input className={styles.DetailsFields} type="text" name="Age" data-key="Age" placeholder="Age" defaultValue={data?.Details?.Age??""} data-value={data?.Details?.Age??""} onBlur={ChangeConfirmation}/>
						<select className={styles.DetailsFields} type="text" name="Sex" placeholder="Sex" defaultValue={data?.Details?.Sex??""} data-value={data?.Details?.Sex??""} onChange={ChangeConfirmation}> 
							<option value="">Sex...</option>
							{Data.Gender.map((element, index) => (
								<option key={index} value={element}>{element}</option>
							))}
						</select>
						<select className={styles.DetailsFields} ype="text" name="Category" readOnly value={session.user.role} placeholder="Category" disabled> 
							<option value="Student">Student</option>
							<option value="Lay Collaborator">Lay Collaborator</option>
						</select>
					</div>
					<div className={styles.DetailsRow}>
						<select className={styles.DetailsFields} type="text" name="CourseStrand" data-key="CourseStrand" defaultValue={data?.Details?.CourseStrand??""} data-value={data?.Details?.CourseStrand??""} placeholder="Course / Strand" onChange={ChangeConfirmation}> 
							<option value="">Course / Strand...</option>
							{Data.Courses.map((element, index) => (
								<option key={index} value={element}>{element}</option>
							))}
						</select>
						<select className={styles.DetailsFields} type="text" name="YearLevel" data-key="YearLevel" defaultValue={data?.Details?.YearLevel??""} data-value={data?.Details?.YearLevel??""}  placeholder="Year Level" onChange={ChangeConfirmation}> 
							<option value="">YearLevel....</option>
							{Data.YearLevel.map((element, index) => (
								<option key={index} value={element}>{element}</option>
							))}
						</select>
						<input className={styles.DetailsFields} type="text" name="GoogleEmail" readOnly value={GoogleEmail} data-key="GoogleEmail" placeholder="School Email" disabled />
						<input className={styles.DetailsFields} type="text" name="StudentNumber" data-key="StudentNumber" defaultValue={data?.Details?.StudentNumber??""} data-value={data?.Details?.StudentNumber??""} placeholder="Student Number" onBlur={ChangeConfirmation}/>
					</div>	
					<div className={styles.DetailsRow}>
						<input className={styles.DetailsFields} type="text" name="ContactNumber" data-key="ContactNumber" defaultValue={data?.Details?.ContactNumber??""} data-value={data?.Details?.ContactNumber??""}  placeholder="Contact Number" onChange={ChangeConfirmation} />
						<input className={styles.DetailsFields} type="text" name="InCaseOfEmergencyPerson" data-key="InCaseOfEmergencyPerson" defaultValue={data?.Details?.InCaseOfEmergencyPerson??""} data-value={data?.Details?.InCaseOfEmergencyPerson??""} placeholder="In case of emergency person" onChange={ChangeConfirmation} />
						<input className={styles.DetailsFields} type="text" name="InCaseOfEmergencyNumber" data-key="InCaseOfEmergencyNumber" defaultValue={data?.Details?.InCaseOfEmergencyNumber??""} data-value={data?.Details?.InCaseOfEmergencyNumber??""} placeholder="In case of emergency number" onChange={ChangeConfirmation} />
					</div>	
				</div>	
			</div>
		)
	}

	return (
		<div className={styles.MainContainer}>

			{showConfirmation && (
                <ActionConfirmation
                    title={ConfirmationData.title}
                    content={ConfirmationData.content}
                    onYes={ConfirmationData.onYes}
                    onCancel={ConfirmationData.onCancel}
                />
            )}

			<DetailsForm />
		</div>
	);
};

export default Page;
