"use client"

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import Calendar from "@/components/Calendar/Calendar";




const Test = () => {


	
	return (
		<div className={styles.container}>

			<div className={styles.calendar}>
				<Calendar />
			</div>
		

		</div>
	);
};

export default Test;
