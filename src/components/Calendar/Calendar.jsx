"use client";

import React, { useState, useEffect } from "react";
import styles from "./Calendar.module.css";

const Calendar = ({callback}) => {
	const currentDate = new Date();
	const [Year, setYear] = useState(currentDate.getFullYear());
	const [Month, setMonth] = useState(currentDate.getMonth() + 1);
	const [Day, setDay] = useState(currentDate.getDate());
	const [DaysInMonth, setDaysInMonth] = useState([]);

	useEffect(() => {
		updateDaysInMonth();
	}, [Year, Month]);

	const updateDaysInMonth = () => {
		const firstDayOfMonth = new Date(Year, Month - 1, 1);
		const startingDayOfWeek = firstDayOfMonth.getDay();
		const daysInMonth = new Date(Year, Month, 0).getDate();

		const daysArray = Array.from({ length: startingDayOfWeek }, () => null).concat(
			Array.from({ length: daysInMonth }, (_, index) => index + 1)
		);

		setDaysInMonth(daysArray);
	};

	const handleMonthChange = (event) => {
		setMonth(parseInt(event.target.value, 10));
	};

	const handleYearChange = (event) => {
		setYear(parseInt(event.target.value, 10));
	};

	const handleDayClick = (event) => {
		const clickedDate = event.currentTarget.getAttribute("data-timestamp");
	  
		// Remove the selectedDate class from all elements with that class
		document.querySelectorAll(`.${styles.selectedDate}`).forEach((element) => {
		  element.classList.remove(styles.selectedDate);
		});
	  
		// Add the selectedDate class to the parent div
		event.currentTarget.classList.add(styles.selectedDate);
	  
		// Set the selected day in your state
		callback(clickedDate); //YYYY-MM-DD
	  };

	const MonthSelection = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];

 	const yearSelection = Array.from({ length: 8 }, (_, index) => (currentDate.getFullYear() + index).toString());

	return (
		<div className={styles.container}>
		<div className={styles.CalendarTop}>
			<select value={Month} className={styles.Months} onChange={handleMonthChange}>
				{MonthSelection.map((value, index) => (
					<option key={index} value={index + 1} className={styles.Month}>
						{value}
					</option>
				))}
			</select>
			<select value={Year} className={styles.Years} onChange={handleYearChange}>
				{yearSelection.map((value, index) => (
					<option key={index} value={value} className={styles.Year}>
						{value}
					</option>
				))}
			</select>
		</div>
		<div className={styles.Weeks}>
			<span className={styles.Week}>Sun</span>
			<span className={styles.Week}>Mon</span>
			<span className={styles.Week}>Tue</span>
			<span className={styles.Week}>Wed</span>
			<span className={styles.Week}>Thu</span>
			<span className={styles.Week}>Fri</span>
			<span className={styles.Week}>Sat</span>
		</div>
		<div className={styles.Days}>
			{DaysInMonth.map((value, index) => {
				const currentDate = new Date(Year, Month - 1, value+1);
				const formattedDate = currentDate.toISOString().split('T')[0]; // Format to YYYY-MM-DD
				const isSunday = index % 7 === 0;
				return (
					<div key={index} className={`${styles.Day} ${isSunday ? styles.sunday : ''}`} value={value} data-timestamp={formattedDate} onClick={isSunday ? null : handleDayClick}>
						{value !== null ? 
							<>
								<p className={styles.date}>{value}</p>  
								{/* <p className={`${styles.time} ${styles.notavailable}`}>-</p>
								<p className={`${styles.time} ${styles.available	}`}>-</p>
								<p className={`${styles.time} ${styles.notavailable}`}>-</p>
								<p className={`${styles.time} ${styles.notavailable}`}>-</p> */}
							</>
						: <p className={styles.sunday}>{}</p>  }
					</div>
				);
			})}
		</div>
		</div>
	);
};

export default Calendar;
