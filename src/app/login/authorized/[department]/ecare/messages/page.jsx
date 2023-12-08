"use client"

import React, { useState } from "react";
import useSWR from "swr";
import { useRouter  } from "next/navigation";
import styles from "./page.module.css";
import Image from "next/image";
import ActionConfirmation from "@/components/ActionConfirmation/ActionConfirmation";


const Messages = ({ params }) => {
	const Department = params.department;
	const router = useRouter();

  	// const fetcher = (...args) => fetch(...args).then((res) => res.json());
    
	// const { data, mutate, error, isLoading } =  useSWR(
	// 	`/api/appointments/GET_Appointments?GoogleEmail=&Department=${encodeURIComponent(Department)}&Status=${encodeURIComponent(Status)}`,
	// 	fetcher
	// );

	// if(!isLoading) {
	// 	console.log(data)
	// }

	// const sortedData = data && !isLoading
    // ? [...data]
	// 	.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
	// 	.map(item => ({
	// 		...item,
	// 		createdAt: formatDate(item.createdAt)
	// 	}))
    // : [];

	// const filteredData = sortedData.filter((appointment) => {
	// 	if (filter !== "" && !appointment.Name.toLowerCase().includes(filter.toLowerCase())) return false;
	// 	return true;
	// });




	const LeftItem = ({name,image,content,date,attachment}) => {
		<>
		</>
	}

	const RightItem = ({name,image,content,date,attachment}) => {
		<>
		</>
	}

	const DirectMessagesList = () =>{
		<>
		</>
	}

	const DirectMessage = () =>{
		<>
		</>
	}

	const MessagesList = () =>{
		<>
		</>
	}

	const Message = () =>{
		<>
		</>
	}

	return (
		<div className={styles.MainContent}>	
		
		</div>
	)
};

export default Messages;


