"use client"

import React, { useState, useEffect } from "react";
import useSWR from "swr";
import styles from "./page.module.css";
import Image from "next/image";
import UserDefault from "public/UserDefault.png"
import ActionConfirmation from "@/components/ActionConfirmation/ActionConfirmation";
import { Data } from "@/models/Data";

const Page = ({params}) => {
	const GoogleEmail = params.gmail;
	const Department = params.department;

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
	  `/api/accounts/details?GoogleEmail=`+GoogleEmail,
	  fetcher
	);

	if (isLoading) {
	  return (
		<div className={styles.MainContainer}>
			Loading...
		</div>
	  )
	}

	const UpdateDetails = async (e) => {
		try {
			setShowConfirmation(false);
			setUpdatingDetails(true)
            
            const formData = new FormData(); 
			formData.append("Department", Department)
            formData.append("GoogleEmail", decodeURIComponent(GoogleEmail));
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

	const RemoveDetails = async (e) => {
		try {
			setShowConfirmation(false);
			setUpdatingDetails(true)
            
            const formData = new FormData(); 
			formData.append("Department", Department)
            formData.append("GoogleEmail", decodeURIComponent(GoogleEmail));
			formData.append("Key", "File");
            formData.append("Value", e.target.dataset.filename);

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

	const RemoveConfirmation = (e) => {
		if(e.target.dataset.value !== e.target.value) {
			setConfirmationData({
				title: "File Remove Confirmation",
				content: `Do you like to remove the file named [ ${e.target.dataset.filename} ] ?`,
				onYes: () => RemoveDetails(e),
				onCancel: () => setShowConfirmation(false),
			});
			setShowConfirmation(true);
		}
	};

	const UploadFile = async (e) => {
		try {
			setUpdatingDetails(true)
            
            const formData = new FormData(); 
			formData.append("Department", Department)
            formData.append("GoogleEmail", decodeURIComponent(GoogleEmail));
            formData.append("Attachment", e.target.files?.[0]);

            const response = await fetch("/api/accounts/updateFile", {
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
  
	const DetailsForm = () => {
		return (
			<div className={styles.DetailsFormContainer}>

				<div className={styles.ProfileContainer}>
					<Image
						className={styles.ProfileImage}
						src={data?.GoogleImage??UserDefault}
						alt="profile picture" 
						width={150}
						height={150}
					/>
					<p className={styles.ProfileName}>{data?.GoogleName}</p>
					<p className={styles.ProfileEmail}>{data?.GoogleEmail}</p>
				</div>

				<div className={styles.DetailsForm}>
					<div className={styles.DetailsRow}>
						<p className={styles.DetailsFormTitle}>Personal Details</p>
					</div>
					<div className={styles.DetailsRow}>
						<input className={styles.DetailsFields} type="text" name="LastName" data-key="LastName" defaultValue={data?.Details?.LastName??""} disabled/>
						<input className={styles.DetailsFields} type="text" name="FirstName" data-key="FirstName"  defaultValue={data?.Details?.FirstName??""} disabled/>
						<input className={styles.DetailsFields} type="text" name="MiddleName" data-key="MiddleName" defaultValue={data?.Details?.MiddleName??""} disabled/>
					</div>
					<div className={styles.DetailsRow}>
						<input className={styles.DetailsFields} type="text" name="Address" data-key="Address" defaultValue={data?.Details?.Address??""} disabled/>
					</div>
					<div className={styles.DetailsRow}>
						<input className={styles.DetailsFields} type="date" name="Birthday" data-key="Birthday" defaultValue={data?.Details?.Birthday??""} disabled/>
						<input className={styles.DetailsFields} type="text" name="Age" data-key="Age" placeholder="Age" defaultValue={data?.Details?.Age??""} disabled/>
						<select className={styles.DetailsFields} type="text" name="Sex" placeholder="Sex" defaultValue={data?.Details?.Sex??""} disabled> 
							<option value="">Sex...</option>
							{Data.Gender.map((element, index) => (
								<option key={index} value={element}>{element}</option>
							))}
						</select>
						<select className={styles.DetailsFields} type="text" name="Category" readOnly value={data?.Role??""} disabled> 
							<option value="Student">Student</option>
							<option value="Lay Collaborator">Lay Collaborator</option>
						</select>
					</div>
					<div className={styles.DetailsRow}>
						<select className={styles.DetailsFields} type="text" name="CourseStrand" data-key="CourseStrand" defaultValue={data?.Details?.CourseStrand??""} disabled> 
							<option value="">Course / Strand...</option>
							{Data?.Courses?.map((element, index) => (
								<option key={index} value={element}>{element}</option>
							))}
						</select>
						<select className={styles.DetailsFields} type="text" name="YearLevel" data-key="YearLevel" defaultValue={data?.Details?.YearLevel??""} disabled> 
							<option value="">YearLevel....</option>
							{Data?.YearLevel?.map((element, index) => (
								<option key={index} value={element}>{element}</option>
							))}
						</select>
						<input className={styles.DetailsFields} type="text" name="GoogleEmail" value={decodeURIComponent (GoogleEmail)} disabled/>
						<input className={styles.DetailsFields} type="text" name="StudentNumber" data-key="StudentNumber" defaultValue={data?.Details?.StudentNumber??""} disabled/>
					</div>	
					<div className={styles.DetailsRow}>
						<input className={styles.DetailsFields} type="text" name="ContactNumber" data-key="ContactNumber" defaultValue={data?.Details?.ContactNumber??""} disabled/>
						<input className={styles.DetailsFields} type="text" name="InCaseOfEmergencyPerson" data-key="InCaseOfEmergencyPerson" defaultValue={data?.Details?.InCaseOfEmergencyPerson??""} disabled/>
						<input className={styles.DetailsFields} type="text" name="InCaseOfEmergencyNumber" data-key="InCaseOfEmergencyNumber" defaultValue={data?.Details?.InCaseOfEmergencyNumber??""} disabled/>
					</div>	
					{Department === "Medical" ?
						<>
							<div className={styles.DetailsRow}>
								<input className={styles.DetailsFields} disabled={isUpdatingDetails} placeholder="Height" type="text" name="Height" data-key="Height" data-value={data?.MedicalDetails?.Height??""} defaultValue={data?.MedicalDetails?.Height??""} onBlur={ChangeConfirmation}/>
								<input className={styles.DetailsFields} disabled={isUpdatingDetails} placeholder="Weight" type="text" name="Weight" data-key="Weight" data-value={data?.MedicalDetails?.Weight??""} defaultValue={data?.MedicalDetails?.Weight??""} onBlur={ChangeConfirmation}/>
								<input className={styles.DetailsFields} disabled={isUpdatingDetails} placeholder="Blood Type" type="text" name="BloodType" data-key="BloodType" data-value={data?.MedicalDetails?.BloodType??""} defaultValue={data?.MedicalDetails?.BloodType??""} onBlur={ChangeConfirmation}/>
							</div>	

							<div className={styles.FilesRow}>
								<p className={styles.FilesHeader}>Other History / Records</p>
								<input className={styles.AddFile} type="file" title="Auto Upload" onChange={UploadFile}/>
								<div className={styles.FileList}>
									{data?.MedicalDetails?.Files?.map((element, index) => (
										<>
											<div key={index} title={"Downloadable File"} className={styles.FileContainer}><a href={`/uploads/files/${element.FileName}`} download>{element.FileName}</a><button data-filename={element.FileName} className={styles.RemoveFile} onClick={RemoveConfirmation}>Remove</button></div>
										</>
									))}
								</div>
							</div>	
						</>
					: null}
					{Department === "Dental" ?
						<>
							<div className={styles.FilesRow}>
								<p className={styles.FilesHeader}>Other History / Records</p>
								<input className={styles.AddFile} type="file" title="Auto Upload" onChange={UploadFile}/>
								<div className={styles.FileList}>
									{data?.DentalDetails?.Files?.map((element, index) => (
										<div key={index} title={"Downloadable File"} className={styles.FileContainer}><a href={`/uploads/files/${element.FileName}`} download>{element.FileName}</a><button data-filename={element.FileName} className={styles.RemoveFile} onClick={RemoveConfirmation}>Remove</button></div>
									))}
								</div>
							</div>	
						</>
					: null}
					{Department === "SDPC" ?
						<>
							<div className={styles.FilesRow}>
								<p className={styles.FilesHeader}>Other History / Records</p>
								<input className={styles.AddFile} type="file" title="Auto Upload" onChange={UploadFile}/>
								<div className={styles.FileList}>
									{data?.SDPCDetails?.Files?.map((element, index) => (
										<div key={index} title={"Downloadable File"} className={styles.FileContainer}><a href={`/uploads/files/${element.FileName}`} download>{element.FileName}</a><button data-filename={element.FileName} className={styles.RemoveFile} onClick={RemoveConfirmation}>Remove</button></div>
									))}
								</div>
							</div>	
						</>
					: null}
					
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
