"use client"

import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { useRouter  } from "next/navigation";
import styles from "./page.module.css";
import Image from "next/image";
import Calendar from "@/components/Calendar/Calendar";
import { Services } from "@/models/Services.js"

const Page = ({ params }) => {
	const Department = params.department;
	const router = useRouter();

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
		``,
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

	const OnSubmit = (e) => {
		e.preventDefault();
		try {
			const formData = new FormData(e.target);


		} catch (error) {
			console.log(error)
		} finally {

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
												<div className={`${styles.TimeSummaryTotal} ${styles.False}`}>{}</div>
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
								case "morning":
									return (
										<>
											<div className={styles.TimeSummaryItem}>
											<div className={styles.TimeSummaryDate}>8am - 10am</div>
											<div className={`${styles.TimeSummaryTotal} ${styles.False}`}>0</div>
											</div>
											<div className={styles.TimeSummaryItem}>
											<div className={styles.TimeSummaryDate}>10am - 12am</div>
											<div className={`${styles.TimeSummaryTotal} ${styles.True}`}>0</div>
											</div>
										</>
									);
								case "afternoon":
									return (
										<>
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
								case "8am-10am":
									return (
										<>
											<div className={styles.TimeSummaryItem}>
												<div className={styles.TimeSummaryDate}>8am - 10am</div>
												<div className={`${styles.TimeSummaryTotal} ${styles.False}`}>0</div>
											</div>
										</>
									);
								case "10am-12am":
									return (
										<>
											<div className={styles.TimeSummaryItem}>
												<div className={styles.TimeSummaryDate}>10am - 12am</div>
												<div className={`${styles.TimeSummaryTotal} ${styles.True}`}>0</div>
											</div>
										</>
									);
								case "1pm-3pm":
									return (
										<>
											<div className={styles.TimeSummaryItem}>
												<div className={styles.TimeSummaryDate}>1pm - 3pm</div>
												<div className={`${styles.TimeSummaryTotal} ${styles.True}`}>0</div>
											</div>
										</>
									);
								case "3pm-5pm":
									return (
										<>
											<div className={styles.TimeSummaryItem}>
												<div className={styles.TimeSummaryDate}>3pm - 5pm</div>
												<div className={`${styles.TimeSummaryTotal} ${styles.True}`}>0</div>
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
							switch (Schedule.Time) {
								case "wholeday":
									return (
										<>
											<label className={`${styles.radioForm} ${styles.True}`} htmlFor="schedulingtime1"><input className={styles.Radio} type="radio" name="test" id="schedulingtime1" value="8am-10am" onChange={(e)=>{setSelectedTime("8am-10am")}}/>8am-10am</label>
											<label className={`${styles.radioForm} ${styles.True}`} htmlFor="schedulingtime2"><input className={styles.Radio} type="radio" name="test" id="schedulingtime2" value="10am-12pm" onChange={(e)=>{setSelectedTime("10am-12pm")}}/>10am-12pm</label>
											<label className={`${styles.radioForm} ${styles.False}`} htmlFor="schedulingtime3"><input className={styles.Radio} type="radio" name="test" id="schedulingtime3" value="1pm-3pm" onChange={(e)=>{setSelectedTime("1pm-3pm")}}/>1pm-3pm</label>
											<label className={`${styles.radioForm} ${styles.True}`} htmlFor="schedulingtime4"><input className={styles.Radio} type="radio" name="test" id="schedulingtime4" value="3pm-5pm" onChange={(e)=>{setSelectedTime("3pm-5pm")}}/>3pm-5pm</label>
										</>
									);
								case "morning":
									return (
										<>
											<label className={`${styles.radioForm} ${styles.True}`} htmlFor="schedulingtime1"><input className={styles.Radio} type="radio" name="test" id="schedulingtime1" value="8am-10am" onChange={(e)=>{setSelectedTime("8am-10am")}}/>8am-10am</label>
											<label className={`${styles.radioForm} ${styles.True}`} htmlFor="schedulingtime2"><input className={styles.Radio} type="radio" name="test" id="schedulingtime2" value="10am-12pm" onChange={(e)=>{setSelectedTime("10am-12pm")}}/>10am-12pm</label>
										</>
									);
								case "afternoon":
									return (
										<>
											<label className={`${styles.radioForm} ${styles.False}`} htmlFor="schedulingtime3"><input className={styles.Radio} type="radio" name="test" id="schedulingtime3" value="1pm-3pm" onChange={(e)=>{setSelectedTime("1pm-3pm")}}/>1pm-3pm</label>
											<label className={`${styles.radioForm} ${styles.True}`} htmlFor="schedulingtime4"><input className={styles.Radio} type="radio" name="test" id="schedulingtime4" value="3pm-5pm" onChange={(e)=>{setSelectedTime("3pm-5pm")}}/>3pm-5pm</label>
										</>
									);
								case "8am-10am":
									return (
										<>
											<label className={`${styles.radioForm} ${styles.True}`} htmlFor="schedulingtime1"><input className={styles.Radio} type="radio" name="test" id="schedulingtime1" value="8am-10am" onChange={(e)=>{setSelectedTime("8am-10am")}}/>8am-10am</label>
										</>
									);
								case "10am-12am":
									return (
										<>
											<label className={`${styles.radioForm} ${styles.True}`} htmlFor="schedulingtime2"><input className={styles.Radio} type="radio" name="test" id="schedulingtime2" value="10am-12pm" onChange={(e)=>{setSelectedTime("10am-12pm")}}/>10am-12pm</label>
										</>
									);
								case "1pm-3pm":
									return (
										<>
											<label className={`${styles.radioForm} ${styles.False}`} htmlFor="schedulingtime3"><input className={styles.Radio} type="radio" name="test" id="schedulingtime3" value="1pm-3pm" onChange={(e)=>{setSelectedTime("1pm-3pm")}}/>1pm-3pm</label>
										</>
									);
								case "3pm-5pm":
									return (
										<>
											<label className={`${styles.radioForm} ${styles.True}`} htmlFor="schedulingtime4"><input className={styles.Radio} type="radio" name="test" id="schedulingtime4" value="3pm-5pm" onChange={(e)=>{setSelectedTime("3pm-5pm")}}/>3pm-5pm</label>
										</>
									);
								default:
									return null;
								}
						})()}
					</>
				) : null}
					
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
						"Loading..."
					) : HistoryData ? (
						HistoryData.length === 0 ? (
							"No records"
						) : (
							HistoryData.map((history, index) => (
								<div key={index} className={styles.HistoryData}>
									{history.createdAt}
								</div>
							))
						)
					) : (
						"No records"
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


