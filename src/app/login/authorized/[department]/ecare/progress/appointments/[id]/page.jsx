"use client"

import React, { useState } from "react";
import useSWR from "swr";
import { useRouter  } from "next/navigation";
import styles from "./page.module.css";
import Image from "next/image";
import UserDefault from "public/UserDefault.png";
import ActionConfirmation from "@/components/ActionConfirmation/ActionConfirmation";
import { Data } from "@/models/Data";
import DentalNgipinList from "public/DentalNgipinList.png";

const Page = ({ params }) => {
	const Department = params.department;
	const Id = params.id;
	const router = useRouter();
	const dateRange = [];

	const [IsDiagnosisProcess, setIsDiagnosisProcess] = useState(false);
	const [IsPrescriptionsProcess, setIsPrescriptionsProcess] = useState(false);
	const [IsNotesProcess, setIsNotesProcess] = useState(false);
	const [IsStatusProcess, setIsStatusProcess] = useState(false);

	const [showConfirmation,setShowConfirmation] = useState(false);
	const [ConfirmationData, setConfirmationData] = useState({
		title: "",
		content: "",
		onYes: () => {},
		onCancel: () => {},
	});

	const fetcher = (...args) => fetch(...args).then((res) => res.json());
    
	const { data, mutate, error, isLoading } =  useSWR(
		`/api/records/GET_Record?Department=${encodeURIComponent(Department)}&Id=${encodeURIComponent(Id)}`,
		fetcher
	);

	const { data: PrescriptionData, mutate: Prescriptionmutate, error: Prescriptionerror, isLoading: PrescriptionisLoading } =  useSWR(
		`/api/inventory/GET_Items?Department=${encodeURIComponent(Department)}`,
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

	const AddDiagnosis = async (e) => {
		e.preventDefault();
		setIsDiagnosisProcess(true);
		try {
            const formData = new FormData(e.target); 
			formData.append("Department", Department);
			formData.append("RecordId", Id);
			formData.append("Key", "Diagnosis");

            const response = await fetch("/api/records/POST_UpdateRecordOthers", {
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
			e.target.reset();
			setIsDiagnosisProcess(false);
			mutate();
		}
	}

	const AddPrescriptions = async (e) => {
		e.preventDefault();
		setIsPrescriptionsProcess(true);
		try {
            const formData = new FormData(e.target); 
			formData.append("Department", Department);
			formData.append("RecordId", Id);
			formData.append("Key", "Prescription");

            const response = await fetch("/api/records/POST_UpdateRecordOthers", {
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
			e.target.reset();
			setIsPrescriptionsProcess(false);
			mutate();
		}
	}

	const AddNotes = async (e) => {
		e.preventDefault();
		setIsNotesProcess(true);
		try {
            const formData = new FormData(e.target); 
			formData.append("Department", Department);
			formData.append("RecordId", Id);
			formData.append("Key", "Note");

            const response = await fetch("/api/records/POST_UpdateRecordOthers", {
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
			e.target.reset();
			setIsNotesProcess(false);
			mutate();
		}
	}

	const RemoveDiagnosis = async (e) => {
		setShowConfirmation(false);
		setIsDiagnosisProcess(true);
		try {
            const formData = new FormData(); 
			formData.append("Department", Department);
			formData.append("RecordId", Id);
			formData.append("Key", "Diagnosis");
			formData.append("Value", e.target.dataset.value);

            const response = await fetch("/api/records/POST_DeleteRecordOthers", {
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
			setIsDiagnosisProcess(false);
			mutate();
		}
	}

	const RemovePrescriptions = async (e) => {
		setShowConfirmation(false);
		setIsPrescriptionsProcess(true);
		try {
            const formData = new FormData(); 
			formData.append("Department", Department);
			formData.append("RecordId", Id);
			formData.append("Key", "Prescription");
			formData.append("Value", e.target.dataset.value);

            const response = await fetch("/api/records/POST_DeleteRecordOthers", {
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
			setIsPrescriptionsProcess(false);
			mutate();
		}
	}

	const RemoveNotes = async (e) => {
		setShowConfirmation(false);
		setIsNotesProcess(true);
		try {
            const formData = new FormData(); 
			formData.append("Department", Department);
			formData.append("RecordId", Id);
			formData.append("Key", "Note");
			formData.append("Value", e.target.dataset.value);

            const response = await fetch("/api/records/POST_DeleteRecordOthers", {
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
			setIsNotesProcess(false);
			mutate();
		}
	}

	const ChangeStatus = async (e) => {
		setShowConfirmation(false);
		setIsStatusProcess(true);
		try {
            const formData = new FormData(); 
			formData.append("Department", Department);
			formData.append("RecordId", Id);
			formData.append("Status", e.target.dataset.value);
			formData.append("Gmail", data.GoogleEmail);

            const response = await fetch("/api/records/POST_UpdateStatus", {
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
			setIsStatusProcess(false);
			mutate();
		}
	}

	const ConfirmRemove = (e) => {
		const key = e.target.dataset.key;
		setConfirmationData({
			title: "Delete Confirmation",
			content: `Do you like to delete this [ ${e.target.dataset.text} ]?`,
			onYes: () => {key === "Note" ? RemoveNotes(e) : key === "Prescription" ? RemovePrescriptions(e) : key === "Diagnosis" ? RemoveDiagnosis(e) : setShowConfirmation(false)},
			onCancel: () => setShowConfirmation(false),
		});
		setShowConfirmation(true);
	}

	const ConfirmChangeStatus = (e) => {
		setConfirmationData({
			title: `Status Change Confirmation`,
			content: `Do you want to mark this record as [ ${e.target.dataset.value === "Completed" ? "Cleared" : "Advising"}? ] ?`,
			onYes: () => ChangeStatus(e),
			onCancel: () => setShowConfirmation(false),
		});
		setShowConfirmation(true);
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
						</div>
						<div className={styles.ProfileBot}>
							<button className={`${styles.HistoryBtn}`} onClick={()=>router.push(`/login/authorized/${Department}/records/${data.GoogleEmail}`)}>History</button>
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
								<button className={styles.ListItemBtn} disabled={IsDiagnosisProcess} data-key={"Diagnosis"} data-value={diagnosis.UniqueId} data-text={diagnosis.Diagnosis} onClick={ConfirmRemove}>x</button>
							</div>
						)) : 
							"No Records"
						}
						<hr className={styles.Line}/>
						<form className={styles.ListItem} onSubmit={AddDiagnosis}>
							<input name="Value" className={styles.ListItemText} disabled={IsDiagnosisProcess} list="DiagnosisList" placeholder="Diagnosis" />
								<datalist id="DiagnosisList">
									{Data?.Diagnosis[Department]?.map((element, index) => (
										<option key={index} value={element}/>
									))}
								</datalist>
							<button className={styles.ListItemAddBtn} disabled={IsDiagnosisProcess}>+</button>
						</form>
					</div>



					<div className={styles.Prescription}>
						<p className={styles.ListTitle}>Prescriptions</p>
						<hr className={styles.Line} />
						{data && data?.Prescriptions && data.Prescriptions.length > 0 ? data.Prescriptions.map((prescription, index) => (
							<div key={index} className={styles.ListItem}>
								<p className={styles.ListItemText}>{prescription.Prescription}</p>
								<button className={styles.ListItemBtn} disabled={IsPrescriptionsProcess} data-key={"Prescription"} data-value={prescription.UniqueId} data-text={prescription.Prescription} onClick={ConfirmRemove}>x</button>
							</div>
						)) : 
							"No Records"
						}
						<hr className={styles.Line}/>
						<form className={styles.ListItem} onSubmit={AddPrescriptions}>
							<input name="Value" className={styles.ListItemText} disabled={IsPrescriptionsProcess} list="PrescriptionsList" placeholder="Prescription"/>
								<datalist id="PrescriptionsList">
									{Data?.Prescriptions[Department]?.map((element, index) => (
										<option key={index} value={element}/>
									))}
									{PrescriptionData?.map((element, index) => (
										<option key={index} value={element.Name}/>
									))}
								</datalist>
							<button className={styles.ListItemAddBtn} disabled={IsPrescriptionsProcess}>+</button>
						</form>
					</div>



					<div className={styles.Note}>
						<p className={styles.ListTitle}>Notes</p>
						<hr className={styles.Line}/>
						{data && data?.Notes && data.Notes.length > 0 ? data.Notes.map((note, index) => (
							<div key={index} className={styles.ListItem}>
								<p className={styles.ListItemText}>{note.Note}</p>
								<button className={styles.ListItemBtn} disabled={IsNotesProcess} data-key={"Note"} data-value={note.UniqueId} data-text={note.Note} onClick={ConfirmRemove}>x</button>
							</div>
						)) : 
							"No Records"
						}
						<hr className={styles.Line}/>
						<form className={styles.ListItem} onSubmit={AddNotes}>
							<input name="Value" className={styles.ListItemText} disabled={IsNotesProcess} type="text" placeholder="Note"/>
							<button className={styles.ListItemAddBtn} disabled={IsNotesProcess}>+</button>
						</form>
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
						{data.Status === "Completed" ? 
							"Cleared"
						:
							<>
								<button className={styles.StatusAdvisingBtn} disabled={IsStatusProcess} data-value={"Advising"} onClick={ConfirmChangeStatus}>{IsStatusProcess ? "..." : "Advising"}</button>
								<button className={styles.StatusClearedBtn} disabled={IsStatusProcess} data-value={"Completed"} onClick={ConfirmChangeStatus}>{IsStatusProcess ? "..." : "Cleared"}</button>
							</>	
						}
					</div>
				</>
			}	
		</div>
	)
};

export default Page;


