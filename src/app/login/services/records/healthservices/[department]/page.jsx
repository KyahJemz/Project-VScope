"use client"

import React, { useState,useEffect } from "react";
import useSWR from "swr";
import { useRouter  } from "next/navigation";
import styles from "./page.module.css";
import Image from "next/image";
import UserDefault from "/public/UserDefault.png"
import { useSession } from "next-auth/react";
import Medical from "public/Medical.jpg";
import SDPC from "public/SDPC.jpg";
import Dental from "public/Dental.jpg";

const Messages = ({params}) => {
	const { data: session, status } = useSession();
	const [GoogleEmail, setGoogleEmail] = useState("");
	const [Role, setRole] = useState("");
	const Department = params.department;
	const router = useRouter();

	useEffect(() => {
		if (status === "authenticated" && session?.user?.email) {
		  setGoogleEmail(session.user.email);
		  setRole(session.user.role)
		}
	}, [status, session]);

	const [RecordFilter, setRecordFilter] = useState("");
    const [NotificationFilter, setNotificationFilter] = useState("");
    const [Panel, setPanel] = useState("Records");

	const formatDate = (timestamp) => {
		const options = { month: 'short', day: 'numeric', year: 'numeric' };
		const formattedDate = new Date(timestamp).toLocaleDateString(undefined, options);
	  
		const hours = new Date(timestamp).getHours();
		const minutes = new Date(timestamp).getMinutes();
		const amOrPm = hours >= 12 ? 'pm' : 'am';
		const formattedTime = `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')}${amOrPm}`;
	  
		return `${formattedDate} ${formattedTime}`;
	};

	const formatShortDate = (timestamp) => {
		const options = { month: 'short', day: 'numeric', year: 'numeric' };
		const formattedDate = new Date(timestamp).toLocaleDateString(undefined, options);
	  
		return `${formattedDate}`;
	};

  	const fetcher = (...args) => fetch(...args).then((res) => res.json());

	const { data: RecordsData, mutate: RecordsMutate, error: RecordsError, isLoading: RecordsIsLoading } =  useSWR(
		`/api/records/GET_Records?GoogleEmail=${encodeURIComponent(GoogleEmail)}&Department=${encodeURIComponent(Department)}`,
		fetcher
	);

	const sortedRecordsData = RecordsData && !RecordsIsLoading
    ? [...RecordsData]
		.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    : [];

    const filteredRecordsData = sortedRecordsData.filter((record) => {
        const recordDate = new Date(record.createdAt);
    
        if (RecordFilter !== "") {
            const filterDate = new Date(RecordFilter);
    
            recordDate.setHours(0, 0, 0, 0);
            filterDate.setHours(0, 0, 0, 0);
    
            if (recordDate.getTime() !== filterDate.getTime()) {
                return false;
            }
        }

        if (record.Status !== "Completed") {
            return false;
        }
    
        return true;
    });
    

    const { data: NotificationData, mutate: NotificationMutate, error: NotificationError, isLoading: NotificationIsLoading } =  useSWR(
		`/api/notifications/GET_Notifications?Department=${encodeURIComponent(Department)}`,
		fetcher
	);

    const sortedNotificationsData = NotificationData && !NotificationIsLoading
    ? [...NotificationData]
		.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    : [];

	const filteredNotificationsData = sortedNotificationsData.filter((notification) => {
        if (NotificationFilter !== "" && !notification.Title.toLowerCase().includes(NotificationFilter.toLowerCase())) {
            return false;
        }
		console.log(Role);
		if (notification.Target !== "All" && notification.Target !== Role+"s"){
			return false;
		}
    
        return true;
    });
    

    const Records = () => {
        return (
			<>
				{RecordsIsLoading && !filteredRecordsData ? (
					"Loading..."
				) : (
					filteredRecordsData.length > 0 ? (
						filteredRecordsData.map((record, index) => (
							<ListItem key={index} name={`${formatShortDate(record.createdAt)} - ${formatShortDate(record.DateCleared)}`} side={"Cleared"} id={record._id} image={Department === "Medical" ? Medical : Department === "Dental" ? Dental : Department === "SDPC" ? SDPC : UserDefault}  callback={(e)=>router.push(`/login/services/records/healthservices/${Department}/record/${record._id}`)}/>
						))
					) : (
						"No records yet"
					)
				)}
			</>
		);
    }

    const Notifications = () => {
        return (
			<>
				{NotificationIsLoading && !filteredNotificationsData ? (
					"Loading..."
				) : (
					filteredNotificationsData.length > 0 ? (
						filteredNotificationsData.map((notification, index) => (
							<ListItem key={index} data={notification} name={notification.Title} side={""} id={notification._id}  image={Department === "Medical" ? Medical : Department === "Dental" ? Dental : Department === "SDPC" ? SDPC : UserDefault} callback={(e)=>router.push(`/login/services/records/healthservices/${Department}/notification/${notification._id}`)}/>
						))
					) : (
						"No notifications yet"
					)
				)}
			</>
		);
    }

    const ListItem = ({key, name, side, image, id,callback}) => {
		return (
			<div className={styles.ListItem} key={key} onClick={callback}>
				<Image
					className={styles.ListItemImage}
					src={image??UserDefault}
					alt="Image"
					width={50}
					height={50}
				/>
				<p className={styles.ListItemName}>{name}</p>
				<p className={`${styles.ListItemMark} ${styles[side.replace(/\s/g, '')]}`}>{side}</p>
			</div>
		)
	}

	return (
		<div className={styles.MainContent}>
            {Panel === "Records" ? 
                <>
                    <div className={`${styles.Header}`}>
                        <p>{Department} - Records</p>
                        <button className={styles.PanelBtn} onClick={Panel === "Records" ? ()=>setPanel("Notifications") : ()=>setPanel("Records")}>View {Panel === "Records" ? "notifications" : "records"}</button>
                    </div>
                    <div className={styles.Body}>
                        <input className={styles.SearchBar} placeholder="Search..." type="date" onChange={(e)=>setRecordFilter(e.target.value)}/>
						<div className={styles.list}>
							<Records />
						</div>
                    </div>
                </>
            :   
                <>
                    <div className={styles.Header}>
                        <p>{Department} - Notifications</p>
                        <button className={styles.PanelBtn} onClick={Panel === "Records" ? ()=>setPanel("Notifications") : ()=>setPanel("Records")}>View {Panel === "Records" ? "notifications" : "records"}</button>
                    </div>
                    <div className={styles.Body}>
                        <input className={styles.SearchBar} placeholder="Search..." type="search" onChange={(e)=>setNotificationFilter(e.target.value)}/>
						<div className={styles.list}>
                        	<Notifications />
						</div>
                    </div>
                </>
            }
			
		</div>
	)
};

export default Messages;


