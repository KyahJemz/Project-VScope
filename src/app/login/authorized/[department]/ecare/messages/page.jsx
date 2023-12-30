"use client"

import React, { useState } from "react";
import useSWR from "swr";
import { useRouter  } from "next/navigation";
import styles from "./page.module.css";
import Image from "next/image";
import UserDefault from "/public/UserDefault.png"

const Messages = ({ params }) => {
	const Department = params.department;
	const router = useRouter();
	
	const [SelectedPanel, setSelectedPanel] = useState("Messages List");

	const [MessagesFilter, setMessagesFilter] = useState("");
	const [DirectMessagesFilter, setDirectMessagesFilter] = useState("");

	const formatDate = (timestamp) => {
		const options = { month: 'short', day: 'numeric', year: 'numeric' };
		const formattedDate = new Date(timestamp).toLocaleDateString(undefined, options);
	  
		const hours = new Date(timestamp).getHours();
		const minutes = new Date(timestamp).getMinutes();
		const amOrPm = hours >= 12 ? 'pm' : 'am';
		const formattedTime = `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')}${amOrPm}`;
	  
		return `${formattedDate} ${formattedTime}`;
	};

  	const fetcher = (...args) => fetch(...args).then((res) => res.json());
    
// MESSAGES
	const { data: RecordsData, mutate: RecordsMutate, error: RecordsError, isLoading: RecordsIsLoading } =  useSWR(
		`/api/messages/GET_Messages?GoogleEmail=&Department=${encodeURIComponent(Department)}&Type=${encodeURIComponent("Message")}`,
		fetcher
	);

	const sortedRecordsData = RecordsData && !RecordsIsLoading
    ? [...RecordsData]
		.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
		.map(item => ({
			...item,
			createdAt: formatDate(item.createdAt)
		}))
    : [];

	const filteredRecordsData = sortedRecordsData.filter((record) => {
		const FullName = `${record?.Details?.LastName??"?"}, ${record?.Details?.FirstName??"?"} ${record?.Details?.MiddleName??""}`;
		if (MessagesFilter !== "" && !FullName.toLowerCase().includes(MessagesFilter.toLowerCase())) return false;
		return true;
	});

// DIRECT
	const { data: DirectData, mutate: DirectMutate, error: DirectError, isLoading: DirectIsLoading } =  useSWR(
		`/api/messages/GET_Messages?GoogleEmail=&Department=${encodeURIComponent(Department)}&Type=${encodeURIComponent("Direct Message")}`,
		fetcher
	);

	const sortedDirectData = DirectData && !DirectIsLoading
    ? [...DirectData]
		.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
		.map(item => ({
			...item,
			createdAt: formatDate(item.createdAt)
		}))
    : [];

	const filteredDirectData = sortedDirectData.filter((record) => {
		const FullName = record?.Name??"?";
		if (DirectMessagesFilter !== "" && !FullName.toLowerCase().includes(DirectMessagesFilter.toLowerCase())) return false;
		return true;
	});

	const DirectMessagesList = () => {
		return (
			<>
				{DirectIsLoading && !filteredDirectData ? (
					"Loading..."
				) : (
					filteredDirectData.map((record, index) => (
						<ListItem key={index} name={`${record?.Name??"?"}`} image={UserDefault} isNew={IsNew(record)} id={record._id} />
					))
				)}
			</>
		);
	};
	  
	const MessagesList = () => {
		return (
			<>
				{RecordsIsLoading && !filteredRecordsData ? (
					"Loading..."
				) : (
					filteredRecordsData.map((record, index) => (
						<ListItem key={index} name={`${record?.Details?.LastName??"?"}, ${record?.Details?.FirstName??"?"} ${record?.Details?.MiddleName??""}`} image={record?.GoogleImage??UserDefault} isNew={IsNew(record)} id={record._id} />
					))
				)}
			</>
		);
	};

	const IsNew = (record) => {
		if (record?.Responses) {
			for (const response of record.Responses) {
				if (response.ViewedByDepartment === false) {
					return true; 
				}
			}
		}
		return false; 
	};
	
	const ListItem = ({key, name, image, isNew, id}) => {
		return (
			<div className={styles.ListItem} key={key} onClick={(e)=>router.push(`/login/authorized/${Department}/ecare/messages/${id}`)}>
				<Image
					className={styles.ListItemImage}
					src={image??UserDefault}
					alt="Image"
					width={50}
					height={50}
				/>
				<p className={styles.ListItemName}>{name}</p>
				<p className={styles.ListItemMark}>{isNew ? "New" : ""}</p>
			</div>
		)
	}

	return (
		<div className={styles.MainContent}>
			<div className={styles.Header}>
				<p>{SelectedPanel}</p>
				{SelectedPanel === "Messages List" ? (
					<button className={styles.PanelButton} onClick={() => {setSelectedPanel("Direct Messages List"); DirectMutate();}}>Direct Messages</button>
				) : (
					<button className={styles.PanelButton} onClick={() => {setSelectedPanel("Messages List"); RecordsMutate();}}>Messages</button>
				)}
			</div>
			<div className={styles.Body}>
				{SelectedPanel === "Messages List" ? (
					<>
						<input className={styles.SearchBar} placeholder="Search..." type="search" onChange={(e)=>setMessagesFilter(e.target.value)}/>
						<MessagesList />
					</>
				) : (
					<>
						<input className={styles.SearchBar} placeholder="Search..." type="search" onChange={(e)=>setDirectMessagesFilter(e.target.value)}/>
						<DirectMessagesList />
					</>
				)}
			</div>
		</div>
	)
};

export default Messages;


