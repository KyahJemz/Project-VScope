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
	const Status = "Pending";
	const router = useRouter();

	const [SelectedDay, setSelectedDay] = useState(null);
	const [SelectedTime, setSelectedTime] = useState(null);

	const [hasSchedule, setHasSchedule] = useState(null);

	const [isUploadingSchedule, setIsUploadingSchedule] = useState(false);

	const formatDate = (timestamp) => {
		const options = { month: 'short', day: 'numeric', year: 'numeric' };
		const formattedDate = new Date(timestamp).toLocaleDateString(undefined, options);
	  
		return `${formattedDate}`;
	};
	  
  	const fetcher = (...args) => fetch(...args).then((res) => res.json());
    
	const { data, mutate, error, isLoading } =  useSWR(
		`/api/calendar/GET_Schedules?Department=${encodeURIComponent(Department)}`,
		fetcher
	);

	const sortedData = data && !isLoading
	? [...data]
		.sort((a, b) => a.Date.localeCompare(b.Date))
	: [];

	const OnAddSchedule = async () => {
		try {
			setIsUploadingSchedule(true);

			if(!SelectedTime){
				return
			}

			if(!SelectedDay){
				return
			}
            
            const formData = new FormData(); 
            formData.append("Department", Department);
			formData.append("Date", SelectedDay);
			formData.append("Time", SelectedTime);

            const response = await fetch("/api/calendar/POST_SetSchedule", {
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
			setIsUploadingSchedule(false)
            mutate(); 
			setSelectedTime(null);
		}
	}

	const OnRemoveSchedule = async (e) => {
		e.target.innerHTML = "..."
		try {
			setIsUploadingSchedule(true);
            
            const formData = new FormData(); 
            formData.append("Department", Department);
			formData.append("Id", e.target.dataset.value);

            const response = await fetch("/api/calendar/POST_RemoveSchedule", {
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
			setIsUploadingSchedule(false)
            mutate(); 
			e.target.innerHTML = "X"
		}
	}

	useEffect(() => {
		if (SelectedDay) {
		  const hasScheduleOnSelectedDay = data.some(appointment => appointment.Date === SelectedDay);
		  setHasSchedule(hasScheduleOnSelectedDay);
		  console.log(hasSchedule);
		}
	}, [SelectedDay, data]);

	console.log(SelectedDay, SelectedTime);

	return (
		<div className={styles.MainContent}>	

			<div className={styles.CalendarConatiner}>
				<Calendar callback={setSelectedDay} />
			</div>

			<div className={styles.TimeSummaryContainer}>
				{SelectedDay ? 
					<>
						<div className={styles.TimeSummaryItem}>
							<div className={styles.TimeSummaryDate}>8am - 10am</div>
							<div className={`${styles.TimeSummaryTotal} ${styles.False}`}>0</div>
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
					: null
				}
				
			</div>

			<div className={styles.TimeSelectionContainer}>
				<p>{SelectedDay}</p>

				{SelectedDay ? 
					<>
						<label className={`${styles.radioForm} ${styles.True}`} htmlFor="schedulingtime1"><input className={styles.Radio} type="radio" name="test" id="schedulingtime1" value="8am-10am" onChange={(e)=>{setSelectedTime("8am-10am")}}/>8am-10am</label>
						<label className={`${styles.radioForm} ${styles.True}`} htmlFor="schedulingtime2"><input className={styles.Radio} type="radio" name="test" id="schedulingtime2" value="10am-12pm" onChange={(e)=>{setSelectedTime("10am-12pm")}}/>10am-12pm</label>
						<label className={`${styles.radioForm} ${styles.False}`} htmlFor="schedulingtime3"><input className={styles.Radio} type="radio" name="test" id="schedulingtime3" value="1pm-3pm" onChange={(e)=>{setSelectedTime("1pm-3pm")}}/>1pm-3pm</label>
						<label className={`${styles.radioForm} ${styles.True}`} htmlFor="schedulingtime4"><input className={styles.Radio} type="radio" name="test" id="schedulingtime4" value="3pm-5pm" onChange={(e)=>{setSelectedTime("3pm-5pm")}}/>3pm-5pm</label>
					</>
					: null
				}
					
			</div>

			<form className={styles.ConcernContainer}>
				<select className={styles.InputArea} name="Services" id="" required>
					<option value="">Select services...</option>
					{Services[Department].map((option, index) => (
						<option key={index} value={option}>{option}</option>
					))}
				</select>
				<textarea className={`${styles.ConcernTextArea} ${styles.InputArea}`} name="Concern" id="" rows={5} required placeholder="Concern..."></textarea>
				<input type="text" className={styles.InputArea} name="" readOnly value={SelectedDay} required placeholder="Selected Date..."/>
				<input type="text" className={styles.InputArea} name="" readOnly value={SelectedTime} required placeholder="Selected Time..."/>
				<input type="text" hidden name="Date" value={SelectedDay} required/>
				<input type="text" hidden name="Time" value={SelectedTime} required/>
				<button className={styles.AppointmentSubmitBtn}>SEND APPOINTMENT</button>
			</form>

			<div className={styles.HistoryContainer}>
				
			</div>

			<div className={styles.UnavailableContainer}>
				
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


