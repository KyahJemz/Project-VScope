"use client"

import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { useRouter  } from "next/navigation";
import styles from "./page.module.css";
import Image from "next/image";
import Calendar from "@/components/Calendar/Calendar";

const Schedule = ({ params }) => {
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
				alert("Schedule has been updated!")
            } else {
                console.log("Failed");
				alert("Connection failed. Try again! :<")
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
				alert("Schedule has been removed!")
            } else {
                console.log("Failed");
				alert("Connection failed. Try again! :<")
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
		  	const hasScheduleOnSelectedDay = data?.some(appointment => appointment.Date === SelectedDay && appointment.Time !== "wholeday");
			setHasSchedule(hasScheduleOnSelectedDay);
			console.log(hasSchedule);
		}
	}, [SelectedDay, data]);

	return (
		<div className={styles.MainContent}>	
		
			<div className={styles.Header}>
				<p>Set Appointment Schedules</p>
			</div>

			<div className={styles.Schedules}>

				<p style={{ fontWeight: 'bold', textAlign: 'center' }}>Schedules</p>

				<div className={styles.ScheduleList}>
					
					{isLoading ? "Loading..." : sortedData.length === 0 ? "No results" : sortedData?.map((schedule, index) => (
						schedule.Time === "wholeday" ? 
							null
						:
						<>
							<div key={index} className={`${styles.Schedule}`}>
								<p className={styles.ScheduleDate}>{formatDate(schedule.Date)} || {schedule.Time}</p>
								<div data-value={schedule._id} className={styles.ScheduleRemove} onClick={OnRemoveSchedule}>X</div>
							</div>
						
						</>
					))}
					</div>

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

						{/* <label className={styles.radioForm} htmlFor="schedulingtime7"><input type="radio" name="test" id="schedulingtime7" value="wholeday" onChange={(e)=>{setSelectedTime("wholeday")}}/>Whole Day</label> */}

						<label className={styles.radioForm} htmlFor="schedulingtime8"><input type="radio" name="test" id="schedulingtime8" value="not-available" onChange={(e)=>{setSelectedTime("not-available")}}/>Not Available</label>

						<button disabled={isUploadingSchedule} onClick={OnAddSchedule}>{isUploadingSchedule ? "Uploading..." : "Add Schedule"}</button>
					</>
				}

			</div>

			<div className={styles.AppoitmentDetails}>
				<Calendar callback={setSelectedDay} Schedules={data}/>
			</div>
		
		</div>
	)
};

export default Schedule;


