"use client"

import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { useRouter  } from "next/navigation";
import styles from "./page.module.css";
import Image from "next/image";
import Calendar from "@/components/Calendar/Calendar";
import { Services } from "@/models/Services.js"
import { useSession } from "next-auth/react";

const Page = ({ params }) => {
	const Department = params.department;
	const { data: session, status } = useSession();
	const [GoogleEmail, setGoogleEmail] = useState("");
	const [GoogleImage, setGoogleImage] = useState("");
	const [Role, setRole] = useState("");
	const router = useRouter();

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

	const { data: HistoryData, mutate: HistoryMutate, error: HistoryError, isLoading: HistoryIsLoading } =  useSWR(
		`/api/records/GET_Records?GoogleEmail=${encodeURIComponent(GoogleEmail)}&Department=${encodeURIComponent(Department)}&Status=&Type=${encodeURIComponent("Appointment")}`,
		fetcher
	);

	useEffect(() => {
		if (SelectedDay) {
		  const hasScheduleOnSelectedDay = DeptData.some(appointment => appointment.Date === SelectedDay);
		  const scheduleOnSelectedDay = DeptData.find(appointment => appointment.Date === SelectedDay);
		  setSchedule(scheduleOnSelectedDay);
		  setHasSchedule(hasScheduleOnSelectedDay);
		  setSelectedTime("");
		  console.log(hasScheduleOnSelectedDay, scheduleOnSelectedDay);
		}
	  }, [SelectedDay, DeptData]);

	console.log(SelectedDay, SelectedTime);

	const OnSubmit = async (e) => {
		e.preventDefault();
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
				e.target.reset();
            } else {
                console.log("Failed");
            }
		} catch (error) {
			console.log(error)
		} finally {
			HistoryMutate(); 
			DeptMutate();
		}
	}

	return (
		<div className={styles.MainContent}>	

			<div className={styles.CalendarConatiner}>
				<Calendar callback={setSelectedDay} />
			</div>

			<div className={styles.TimeSummaryContainer}>
				{SelectedDay && hasSchedule ? (
					<>
						{(() => {
							switch (Schedule.Time) {
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
								default:
									return null;
								}
						})()}
					</>
				) : null}
			</div>

			<div className={styles.TimeSelectionContainer}>
				<p>{formatDate(SelectedDay)}</p>
				{SelectedDay && hasSchedule ? (
					<>
						{(() => {
							switch (Schedule?.Time) {
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
								default:
									return null;
								}
						})()}
					</>
				) : <p className={styles.notes}>No open schedule</p>}
					
			</div>

			<form className={styles.ConcernContainer} onSubmit={OnSubmit}>
				<select className={styles.InputArea} name="Services" id="" required>
					<option value="">Select services...</option>
					{Services[Department].map((option, index) => (
						<option key={index} value={option}>{option}</option>
					))}
				</select>
				<textarea className={`${styles.ConcernTextArea} ${styles.InputArea}`} name="Concern" id="" rows={5} required placeholder="Concern..."></textarea>
				<input type="text" className={styles.InputArea} name="" readOnly value={formatDate(SelectedDay)} required placeholder="Selected Date..."/>
				<input type="text" className={styles.InputArea} name="" readOnly value={SelectedTime} required placeholder="Selected Time..."/>
				<input type="text" hidden name="Date" value={SelectedDay} required/>
				<input type="text" hidden name="Time" value={SelectedTime} required/>
				<button className={styles.AppointmentSubmitBtn}>SEND APPOINTMENT</button>
			</form>

			<div className={styles.HistoryContainer}>
				<p>Hisotry</p>
				<div className={styles.StatusContainer}>
					<button className={`${styles.StatusBtn}`}>All</button>
					<button className={`${styles.StatusBtn}`}>Pending</button>
					<button className={`${styles.StatusBtn}`}>Approved</button>
					<button className={`${styles.StatusBtn}`}>Completed</button>
					<button className={`${styles.StatusBtn}`}>Rejected</button>
					<button className={`${styles.StatusBtn}`}>Canceled</button>
					<button className={`${styles.StatusBtn}`}>Advising</button>
					<button className={`${styles.StatusBtn}`}>Rescheduled</button>
				</div>
				<div className={styles.HistoryList}>
					{HistoryIsLoading ? (
						<p className={styles.notes}>Loading...</p>
					) : HistoryData ? (
						HistoryData.length === 0 ? (
							<p className={styles.notes}>No records</p>
						) : (
							HistoryData.map((history, index) => (
								<div key={index} className={styles.HistoryData}>
									{history.Details.Concern}
								</div>
							))
						)
					) : (
						<p className={styles.notes}>No records</p>
					)}
				</div>
			</div>

			<div className={styles.UnavailableContainer}>
				<p>Unavailable</p>
				<div className={styles.UnavailableList}>

				</div>
			</div>

			<div className={styles.NoteContainer}>
				TAKE NOTE: NOT ALL APPROVED
			</div>
		






{/* 		
			<div className={styles.Schedules}>



				<p style={{ fontWeight: 'bold', textAlign: 'center' }}>Schedules</p>
				
				{isLoading ? "Loading..." : sortedData.length === 0 ? "No results" : sortedData?.map((schedule, index) => (
					<div key={index} className={`${styles.Schedule}`}>
						<p className={styles.ScheduleDate}>{formatDate(schedule.Date)} || {schedule.Time}</p>
						<div data-value={schedule._id} className={styles.ScheduleRemove} onClick={OnRemoveSchedule}>X</div>
					</div>
				))}

			</div>

			<div className={styles.TimeSelection}>
				<p style={{ fontWeight: 'bold', textAlign: 'center' }}>Availability</p>

				{hasSchedule ? "Has Schedule already" :
					<>
						<label className={styles.radioForm} htmlFor="schedulingtime1"><input type="radio" name="test" id="schedulingtime1" value="8am-10am" onChange={(e)=>{setSelectedTime("8am-10am")}}/>8am-10am</label>

						<label className={styles.radioForm} htmlFor="schedulingtime2"><input type="radio" name="test" id="schedulingtime2" value="10am-12pm" onChange={(e)=>{setSelectedTime("10am-12pm")}}/>10am-12pm</label>

						<label className={styles.radioForm} htmlFor="schedulingtime3"><input type="radio" name="test" id="schedulingtime3" value="1pm-3pm" onChange={(e)=>{setSelectedTime("1pm-3pm")}}/>1pm-3pm</label>

						<label className={styles.radioForm} htmlFor="schedulingtime4"><input type="radio" name="test" id="schedulingtime4" value="3pm-5pm" onChange={(e)=>{setSelectedTime("3pm-5pm")}}/>3pm-5pm</label>

						<label className={styles.radioForm} htmlFor="schedulingtime5"><input type="radio" name="test" id="schedulingtime5" value="morning" onChange={(e)=>{setSelectedTime("morning")}}/>Morning</label>

						<label className={styles.radioForm} htmlFor="schedulingtime6"><input type="radio" name="test" id="schedulingtime6" value="afternoon" onChange={(e)=>{setSelectedTime("afternoon")}}/>Afternoon</label>

						<label className={styles.radioForm} htmlFor="schedulingtime7"><input type="radio" name="test" id="schedulingtime7" value="wholeday" onChange={(e)=>{setSelectedTime("wholeday")}}/>Whole Day</label>

						<button disabled={isUploadingSchedule} onClick={OnAddSchedule}>{isUploadingSchedule ? "Uploading..." : "Add Schedule"}</button>
					</>
				}

			</div> */}

			
		
		</div>
	)
};

export default Page;


