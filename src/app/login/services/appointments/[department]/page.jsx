"use client"

import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { useRouter  } from "next/navigation";
import styles from "./page.module.css";
import Image from "next/image";
import Calendar from "@/components/Calendar/Calendar";
import { useSession } from "next-auth/react";
import ActionConfirmation from "@/components/ActionConfirmation/ActionConfirmation";
import { Data } from "@/models/Data";

const Page = ({ params }) => {
	const Department = params.department;
	const { data: session, status } = useSession();
	const [GoogleEmail, setGoogleEmail] = useState("");
	const [GoogleImage, setGoogleImage] = useState("");
	const [Role, setRole] = useState("");
	const [HasAlreadySetSchedule, setHasAlreadySetSchedule] = useState(false);
	const router = useRouter();
	
	const [IsUploading, setIsUploading] = useState(false);

	const [showConfirmation,setShowConfirmation] = useState(false);
	const [ConfirmationData, setConfirmationData] = useState({
		title: "",
		content: "",
		onYes: () => {},
		onCancel: () => {},
	});

	useEffect(() => {
		if (status === "authenticated" && session?.user?.email) {
		  setGoogleEmail(session.user.email);
		}
		if (status === "authenticated" && session?.user?.image) {
			setGoogleImage(session.user.image);
		}
		if (status === "authenticated" && session?.user?.role) {
			setRole(session.user.role);
		}
	}, [status, session]);

	const [SelectedDay, setSelectedDay] = useState(null);
	const [SelectedTime, setSelectedTime] = useState(null);

	const [hasSchedule, setHasSchedule] = useState(null);
	const [Schedule, setSchedule] = useState(null);

	const formatDate = (timestamp) => {
		const options = { month: 'short', day: 'numeric', year: 'numeric' };
		const formattedDate = new Date(timestamp).toLocaleDateString(undefined, options);
	  
		return `${formattedDate}`;
	};
	  
  	const fetcher = (...args) => fetch(...args).then((res) => res.json());
    
	const { data: DeptData, mutate: DeptMutate, error: DeptError, isLoading: DeptIsLoading } =  useSWR(
		`/api/calendar/GET_Schedules?Department=${encodeURIComponent(Department)}`,
		fetcher
	);

	const [Status, setStatus] = useState("All");

	const { data: HistoryData, mutate: HistoryMutate, error: HistoryError, isLoading: HistoryIsLoading } =  useSWR(
		`/api/records/GET_Records?GoogleEmail=${encodeURIComponent(GoogleEmail)}&Department=${encodeURIComponent(Department)}&Type=${encodeURIComponent("Appointment")}`,
		fetcher
	);

	const sortedData = HistoryData ? [...HistoryData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];

	const filteredData = Status === "All"
		? sortedData.filter(record => ["Pending", "Approved", "Canceled", "Rescheduled"].includes(record.Status))
		: Status === "Rescheduled" ? sortedData.filter(record => record.ReScheduled === true) : sortedData.filter(record => record.Status === Status);

	useEffect(() => {
		const hasSetSchedule = HistoryData?.some(element => SelectedDay === element.AppointmentDate && element.Status !== "Canceled" && element.Status !== "Rejected");
		setHasAlreadySetSchedule(hasSetSchedule);
	}, [SelectedDay, HistoryData]);

	useEffect(() => {
		if (SelectedDay) {
		  const hasScheduleOnSelectedDay = DeptData?.some(appointment => appointment.Date === SelectedDay);
		  const scheduleOnSelectedDay = DeptData?.find(appointment => appointment.Date === SelectedDay);
		  setSchedule(scheduleOnSelectedDay);
		  setHasSchedule(hasScheduleOnSelectedDay);
		  setSelectedTime("");
		  console.log(hasScheduleOnSelectedDay, scheduleOnSelectedDay);
		}
	  }, [SelectedDay, DeptData]);

	const OnSubmit = async (e) => {
		e.preventDefault();
		setIsUploading(true);
		try {
			const formData = new FormData(e.target);
			formData.append("Type", "Appointment");
			formData.append("Status", "Pending");
			formData.append("Department", Department);
			formData.append("GoogleImage", GoogleImage);
			formData.append("GoogleEmail", GoogleEmail);
			formData.append("Category", Role);

			const response = await fetch("/api/records/POST_AddRecord", {
				method: "POST",
				body: formData,
			});

            if (response.ok) {
                console.log("Complete");
				alert("Appointment Submitted!")
				e.target.reset();
            } else {
				alert("Connection Failed. Try Again! :<")
                console.log("Failed");
            }
		} catch (error) {
			console.log(error)
		} finally {
			HistoryMutate(); 
			DeptMutate();
			setIsUploading(false);
		}
	}

	const ConfirmChangeStatus = (e) => {
		setConfirmationData({
			title: `Status cancel Confirmation`,
			content: `Do you want to mark this schedule as [ Canceled ] ?`,
			onYes: () => ChangeStatus(e),
			onCancel: () => setShowConfirmation(false),
		});
		setShowConfirmation(true);
	}

	const ChangeStatus = async (e) => {
		setShowConfirmation(false);
		try {
            const formData = new FormData(); 
			formData.append("Department", Department);
			formData.append("RecordId", e.target.dataset.recordid);
			formData.append("Status", "Canceled");
			formData.append("Gmail", GoogleEmail);

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
			HistoryMutate();
		}
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

			<div className={styles.CalendarConatiner}>
				<Calendar callback={setSelectedDay} Schedules={DeptData} />
			</div>

			<div className={styles.TimeSummaryContainer}>
				{SelectedDay ? (
					<>
						{(() => {
							if (HasAlreadySetSchedule) {
								return (
										<>
										</>
								);
							}
							switch (Schedule?.Time??"") {
								case "wholeday":
									return (
										<>
											<div className={styles.TimeSummaryItem}>
												<div className={styles.TimeSummaryDate}>8am - 10am</div>
												<div className={`${styles.TimeSummaryTotal} ${Schedule["8am10am"] && Schedule["8am10am"].length >= 4 ? styles.False : styles.True}`}>{Schedule["8am10am"] && Schedule["8am10am"].length}</div>
											</div>
											<div className={styles.TimeSummaryItem}>
												<div className={styles.TimeSummaryDate}>10am - 12am</div>
												<div className={`${styles.TimeSummaryTotal} ${Schedule["10am12pm"] && Schedule["10am12pm"].length >= 4 ? styles.False : styles.True}`}>{Schedule["10am12pm"] && Schedule["10am12pm"].length}</div>
											</div>
											<div className={styles.TimeSummaryItem}>
												<div className={styles.TimeSummaryDate}>1pm - 3pm</div>
												<div className={`${styles.TimeSummaryTotal} ${Schedule["1pm3pm"] && Schedule["1pm3pm"].length >= 4 ? styles.False : styles.True}`}>{Schedule["1pm3pm"] && Schedule["1pm3pm"].length}</div>
											</div>
											<div className={styles.TimeSummaryItem}>
												<div className={styles.TimeSummaryDate}>3pm - 5pm</div>
												<div className={`${styles.TimeSummaryTotal} ${Schedule["3pm5pm"] && Schedule["3pm5pm"].length >= 4 ? styles.False : styles.True}`}>{Schedule["3pm5pm"] && Schedule["3pm5pm"].length}</div>
											</div>
										</>
									);
								case "morning":
									return (
										<>
											<div className={styles.TimeSummaryItem}>
												<div className={styles.TimeSummaryDate}>8am - 10am</div>
												<div className={`${styles.TimeSummaryTotal} ${Schedule["8am10am"] && Schedule["8am10am"].length >= 4 ? styles.False : styles.True}`}>{Schedule["8am10am"] && Schedule["8am10am"].length}</div>
											</div>
											<div className={styles.TimeSummaryItem}>
												<div className={styles.TimeSummaryDate}>10am - 12am</div>
												<div className={`${styles.TimeSummaryTotal} ${Schedule["10am12pm"] && Schedule["10am12pm"].length >= 4 ? styles.False : styles.True}`}>{Schedule["10am12pm"] && Schedule["10am12pm"].length}</div>
											</div>
										</>
									);
								case "afternoon":
									return (
										<>
											<div className={styles.TimeSummaryItem}>
												<div className={styles.TimeSummaryDate}>1pm - 3pm</div>
												<div className={`${styles.TimeSummaryTotal} ${Schedule["1pm3pm"] && Schedule["1pm3pm"].length >= 4 ? styles.False : styles.True}`}>{Schedule["1pm3pm"] && Schedule["1pm3pm"].length}</div>
											</div>
											<div className={styles.TimeSummaryItem}>
												<div className={styles.TimeSummaryDate}>3pm - 5pm</div>
												<div className={`${styles.TimeSummaryTotal} ${Schedule["3pm5pm"] && Schedule["3pm5pm"].length >= 4 ? styles.False : styles.True}`}>{Schedule["3pm5pm"] && Schedule["3pm5pm"].length}</div>
											</div>
										</>
									);
								case "8am-10am":
									return (
										<>
											<div className={styles.TimeSummaryItem}>
												<div className={styles.TimeSummaryDate}>8am - 10am</div>
												<div className={`${styles.TimeSummaryTotal} ${Schedule["8am10am"] && Schedule["8am10am"].length >= 4 ? styles.False : styles.True}`}>{Schedule["8am10am"] && Schedule["8am10am"].length}</div>
											</div>
										</>
									);
								case "10am-12am":
									return (
										<>
											<div className={styles.TimeSummaryItem}>
												<div className={styles.TimeSummaryDate}>10am - 12am</div>
												<div className={`${styles.TimeSummaryTotal} ${Schedule["10am12pm"] && Schedule["10am12pm"].length >= 4 ? styles.False : styles.True}`}>{Schedule["10am12pm"] && Schedule["10am12pm"].length}</div>
											</div>
										</>
									);
								case "1pm-3pm":
									return (
										<>
											<div className={styles.TimeSummaryItem}>
												<div className={styles.TimeSummaryDate}>1pm - 3pm</div>
												<div className={`${styles.TimeSummaryTotal} ${Schedule["1pm3pm"] && Schedule["1pm3pm"].length >= 4 ? styles.False : styles.True}`}>{Schedule["1pm3pm"] && Schedule["1pm3pm"].length}</div>
											</div>
										</>
									);
								case "3pm-5pm":
									return (
										<>
											<div className={styles.TimeSummaryItem}>
												<div className={styles.TimeSummaryDate}>3pm - 5pm</div>
												<div className={`${styles.TimeSummaryTotal} ${Schedule["3pm5pm"] && Schedule["3pm5pm"].length >= 4 ? styles.False : styles.True}`}>{Schedule["3pm5pm"] && Schedule["3pm5pm"].length}</div>
											</div>
										</>
									);
								case "not-available":
									return (
										<>
										</>
									);
								default:
									const currentDate = new Date(SelectedDay);
									const dayOfWeek = currentDate.getDay(); 
									const isSaturday = dayOfWeek === 6;
									if (isSaturday) {
										return (
											<>
												<div className={styles.TimeSummaryItem}>
													<div className={styles.TimeSummaryDate}>8am - 10am</div>
													<div className={`${styles.TimeSummaryTotal} ${styles.True}`}>0</div>
												</div>
												<div className={styles.TimeSummaryItem}>
													<div className={styles.TimeSummaryDate}>10am - 12am</div>
													<div className={`${styles.TimeSummaryTotal} ${styles.True}`}>0</div>
												</div>
											</>
										);
									} else {
										return (
											<>
												<div className={styles.TimeSummaryItem}>
													<div className={styles.TimeSummaryDate}>8am - 10am</div>
													<div className={`${styles.TimeSummaryTotal} ${styles.True}`}>0</div>
												</div>
												<div className={styles.TimeSummaryItem}>
													<div className={styles.TimeSummaryDate}>10am - 12am</div>
													<div className={`${styles.TimeSummaryTotal} ${styles.True}`}>0</div>
												</div>
												<div className={styles.TimeSummaryItem}>
													<div className={styles.TimeSummaryDate}>1pm - 3pm</div>
													<div className={`${styles.TimeSummaryTotal} ${styles.True}`}>0</div>
												</div>
												<div className={styles.TimeSummaryItem}>
													<div className={styles.TimeSummaryDate}>3pm - 5pm</div>
													<div className={`${styles.TimeSummaryTotal} ${styles.True}`}>0</div>
												</div>
											</>
										);
									}
								}
						})()}
					</>
				) : null}
			</div>

			<div className={styles.TimeSelectionContainer}>
				{console.log(SelectedDay)}
				<p>{formatDate(SelectedDay) === "Jan 1, 1970" ? "" : formatDate(SelectedDay)}</p>
				{SelectedDay ? (
					<>
						{(() => {
							if (HasAlreadySetSchedule) {
								return (
									<>
										Already have schedule
									</>
								);
							}
							switch (Schedule?.Time??"") {
								case "wholeday":
									return (
										<>
											<label className={`${styles.radioForm} ${Schedule["8am10am"] && Schedule["8am10am"].length >= 4 ? styles.False : styles.True}`} htmlFor="schedulingtime1"><input className={styles.Radio} type="radio" name="test" id="schedulingtime1" value="8am-10am" disabled={Schedule["8am10am"] && Schedule["8am10am"].length >= 4 ? true : false} onChange={(e)=>{setSelectedTime("8am-10am")}}/>8am-10am</label>
											<label className={`${styles.radioForm} ${Schedule["10am12pm"] && Schedule["10am12pm"].length >= 4 ? styles.False : styles.True}`} htmlFor="schedulingtime2"><input className={styles.Radio} type="radio" name="test" id="schedulingtime2" value="10am-12pm" disabled={Schedule["10am12pm"] && Schedule["10am12pm"].length >= 4 ? true : false} onChange={(e)=>{setSelectedTime("10am-12pm")}}/>10am-12pm</label>
											<label className={`${styles.radioForm} ${Schedule["1pm3pm"] && Schedule["1pm3pm"].length >= 4 ? styles.False : styles.True}`} htmlFor="schedulingtime3"><input className={styles.Radio} type="radio" name="test" id="schedulingtime3" value="1pm-3pm" disabled={Schedule["1pm3pm"] && Schedule["1pm3pm"].length >= 4 ? true : false} onChange={(e)=>{setSelectedTime("1pm-3pm")}}/>1pm-3pm</label>
											<label className={`${styles.radioForm} ${Schedule["3pm5pm"] && Schedule["3pm5pm"].length >= 4 ? styles.False : styles.True}`} htmlFor="schedulingtime4"><input className={styles.Radio} type="radio" name="test" id="schedulingtime4" value="3pm-5pm" disabled={Schedule["3pm5pm"] && Schedule["3pm5pm"].length >= 4 ? true : false} onChange={(e)=>{setSelectedTime("3pm-5pm")}}/>3pm-5pm</label>
										</>
									);
								case "morning":
									return (
										<>
											<label className={`${styles.radioForm} ${Schedule["8am10am"] && Schedule["8am10am"].length >= 4 ? styles.False : styles.True}`} htmlFor="schedulingtime1"><input className={styles.Radio} type="radio" name="test" id="schedulingtime1" value="8am-10am" disabled={Schedule["8am10am"] && Schedule["8am10am"].length >= 4 ? true : false} onChange={(e)=>{setSelectedTime("8am-10am")}}/>8am-10am</label>
											<label className={`${styles.radioForm} ${Schedule["10am12pm"] && Schedule["10am12pm"].length >= 4 ? styles.False : styles.True}`} htmlFor="schedulingtime2"><input className={styles.Radio} type="radio" name="test" id="schedulingtime2" value="10am-12pm" disabled={Schedule["10am12pm"] && Schedule["10am12pm"].length >= 4 ? true : false} onChange={(e)=>{setSelectedTime("10am-12pm")}}/>10am-12pm</label>
										</>
									);
								case "afternoon":
									return (
										<>
											<label className={`${styles.radioForm} ${Schedule["1pm3pm"] && Schedule["1pm3pm"].length >= 4 ? styles.False : styles.True}`} htmlFor="schedulingtime3"><input className={styles.Radio} type="radio" name="test" id="schedulingtime3" value="1pm-3pm" disabled={Schedule["1pm3pm"] && Schedule["1pm3pm"].length >= 4 ? true : false} onChange={(e)=>{setSelectedTime("1pm-3pm")}}/>1pm-3pm</label>
											<label className={`${styles.radioForm} ${Schedule["3pm5pm"] && Schedule["3pm5pm"].length >= 4 ? styles.False : styles.True}`} htmlFor="schedulingtime4"><input className={styles.Radio} type="radio" name="test" id="schedulingtime4" value="3pm-5pm" disabled={Schedule["3pm5pm"] && Schedule["3pm5pm"].length >= 4 ? true : false} onChange={(e)=>{setSelectedTime("3pm-5pm")}}/>3pm-5pm</label>
										</>
									);
								case "8am-10am":
									return (
										<>
											<label className={`${styles.radioForm} ${Schedule["8am10am"] && Schedule["8am10am"].length >= 4 ? styles.False : styles.True}`} htmlFor="schedulingtime1"><input className={styles.Radio} type="radio" name="test" id="schedulingtime1" value="8am-10am" disabled={Schedule["8am10am"] && Schedule["8am10am"].length >= 4 ? true : false} onChange={(e)=>{setSelectedTime("8am-10am")}}/>8am-10am</label>
										</>
									);
								case "10am-12am":
									return (
										<>
											<label className={`${styles.radioForm} ${Schedule["10am12pm"] && Schedule["10am12pm"].length >= 4 ? styles.False : styles.True}`} htmlFor="schedulingtime2"><input className={styles.Radio} type="radio" name="test" id="schedulingtime2" value="10am-12pm" disabled={Schedule["10am12pm"] && Schedule["10am12pm"].length >= 4 ? true : false} onChange={(e)=>{setSelectedTime("10am-12pm")}}/>10am-12pm</label>
										</>
									);
								case "1pm-3pm":
									return (
										<>
											<label className={`${styles.radioForm} ${Schedule["1pm3pm"] && Schedule["1pm3pm"].length >= 4 ? styles.False : styles.True}`} htmlFor="schedulingtime3"><input className={styles.Radio} type="radio" name="test" id="schedulingtime3" value="1pm-3pm" disabled={Schedule["1pm3pm"] && Schedule["1pm3pm"].length >= 4 ? true : false} onChange={(e)=>{setSelectedTime("1pm-3pm")}}/>1pm-3pm</label>
										</>
									);
								case "3pm-5pm":
									return (
										<>
											<label className={`${styles.radioForm} ${Schedule["3pm5pm"] && Schedule["3pm5pm"].length >= 4 ? styles.False : styles.True}`} htmlFor="schedulingtime4"><input className={styles.Radio} type="radio" name="test" id="schedulingtime4" value="3pm-5pm" disabled={Schedule["3pm5pm"] && Schedule["3pm5pm"].length >= 4 ? true : false} onChange={(e)=>{setSelectedTime("3pm-5pm")}}/>3pm-5pm</label>
										</>
									);
								case "not-available":
									return (
										<>
											Not Available
										</>
									);
								default:
									const currentDate = new Date(SelectedDay);
									const dayOfWeek = currentDate.getDay(); 
									const isSaturday = dayOfWeek === 6;
									if (isSaturday) {
										return (
											<>
												<label className={`${styles.radioForm} ${styles.True}`} htmlFor="schedulingtime1"><input className={styles.Radio} type="radio" name="test" id="schedulingtime1" value="8am-10am" onChange={(e)=>{setSelectedTime("8am-10am")}}/>8am-10am</label>
												<label className={`${styles.radioForm} ${styles.True}`} htmlFor="schedulingtime2"><input className={styles.Radio} type="radio" name="test" id="schedulingtime2" value="10am-12pm" onChange={(e)=>{setSelectedTime("10am-12pm")}}/>10am-12pm</label>
											</>
										);
									} else {
										return (
											<>
												<label className={`${styles.radioForm} ${styles.True}`} htmlFor="schedulingtime1"><input className={styles.Radio} type="radio" name="test" id="schedulingtime1" value="8am-10am" onChange={(e)=>{setSelectedTime("8am-10am")}}/>8am-10am</label>
												<label className={`${styles.radioForm} ${styles.True}`} htmlFor="schedulingtime2"><input className={styles.Radio} type="radio" name="test" id="schedulingtime2" value="10am-12pm" onChange={(e)=>{setSelectedTime("10am-12pm")}}/>10am-12pm</label>
												<label className={`${styles.radioForm} ${styles.True}`} htmlFor="schedulingtime3"><input className={styles.Radio} type="radio" name="test" id="schedulingtime3" value="1pm-3pm" onChange={(e)=>{setSelectedTime("1pm-3pm")}}/>1pm-3pm</label>
												<label className={`${styles.radioForm} ${styles.True}`} htmlFor="schedulingtime4"><input className={styles.Radio} type="radio" name="test" id="schedulingtime4" value="3pm-5pm" onChange={(e)=>{setSelectedTime("3pm-5pm")}}/>3pm-5pm</label>
											</>
										);
									}
								}
						})()}
					</>
				) : <p className={styles.notes}>No open schedule</p>}
					
			</div>

			<form className={styles.ConcernContainer} onSubmit={OnSubmit}>
				<select className={styles.InputArea} name="ServiceOffered" required>
					<option value="">Select services...</option>
					{Data.Services[Department].map((option, index) => (
						<option key={index} value={option}>{option}</option>
					))}
				</select>
				<textarea disabled={IsUploading} className={`${styles.ConcernTextArea} ${styles.InputArea}`} name="Concern" id="" rows={5} required placeholder="Concern..."></textarea>
				<input disabled={IsUploading} type="text" className={styles.InputArea} name="" readOnly value={formatDate(SelectedDay) === "Jan 1, 1970" ? "" : formatDate(SelectedDay)} required placeholder="Selected Date..."/>
				<input disabled={IsUploading} type="text" className={styles.InputArea} name="" readOnly value={SelectedTime} required placeholder="Selected Time..."/>
				<input type="text" hidden name="Date" value={SelectedDay} required/>
				<input type="text" hidden name="Time" value={SelectedTime} required/>
				<button disabled={IsUploading} className={styles.AppointmentSubmitBtn}>{IsUploading ? "Uploading..." : "SEND APPOINTMENT"}</button>
			</form>

			<div className={styles.HistoryContainer}>
				<p>Hisotry</p>
				<div className={styles.StatusContainer}>
					<button className={`${styles.StatusBtn} ${Status === "All" ? styles.Active : null}`} onClick={()=>setStatus("All")}>All</button>
					<button className={`${styles.StatusBtn} ${Status === "Pending" ? styles.Active : null}`} onClick={()=>setStatus("Pending")}>Pending</button>
					<button className={`${styles.StatusBtn} ${Status === "Approved" ? styles.Active : null}`} onClick={()=>setStatus("Approved")}>Approved</button>
					<button className={`${styles.StatusBtn} ${Status === "Canceled" ? styles.Active : null}`} onClick={()=>setStatus("Canceled")}>Canceled</button>
					<button className={`${styles.StatusBtn} ${Status === "Rescheduled" ? styles.Active : null}`} onClick={()=>setStatus("Rescheduled")}>Rescheduled</button>
				</div>
				<div className={styles.HistoryList}>
					{HistoryIsLoading ? (
						<p className={styles.notes}>Loading...</p>
					) : filteredData ? (
						filteredData.length === 0 ? (
							<p className={styles.notes}>No records</p>
						) : (
							filteredData.map((history, index) => (
								<>
									<div key={index} className={`${styles.HistoryData} ${history.ReScheduled ? styles.Rescheduled : styles[history.Status]}`}>
										{history.ReScheduled || history.Status === "Pending" ? <div data-recordid={history._id} className={styles.CancelBtn} title="Cancel?" onClick={ConfirmChangeStatus}>x</div> : <div className={styles.CheckBtn}>✓</div>}
										{formatDate(history.AppointmentDate)} | {history.AppointmentTime}
									</div>
								</>
							))
						)
					) : (
						<p className={styles.notes}>No records</p>
					)}
				</div>
			</div>

			<div className={styles.NoteContainer}>
				TAKE NOTE: NOT ALL APPROVED
			</div>
		
		</div>
	)
};

export default Page;


