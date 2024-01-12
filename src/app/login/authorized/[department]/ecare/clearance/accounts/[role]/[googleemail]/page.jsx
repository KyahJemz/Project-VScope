"use client"

import React, { useState,useEffect } from "react";
import useSWR from "swr";
import { useRouter  } from "next/navigation";
import styles from "./page.module.css";
import Image from "next/image";
import Medical from "public/Medical.jpg";
import SDPC from "public/SDPC.jpg";
import Dental from "public/Dental.jpg";
import UserDefault from "/public/UserDefault.png"

const Page = ({params}) => {
	const Department = params.department;
	const GoogleEmail = params.googleemail;
	const router = useRouter();

    const [NotificationFilter, setNotificationFilter] = useState("");

	const formatShortDate = (timestamp) => {
		const options = { month: 'short', day: 'numeric', year: 'numeric' };
		const formattedDate = new Date(timestamp).toLocaleDateString(undefined, options);
	  
		return `${formattedDate}`;
	};

  	const fetcher = (...args) => fetch(...args).then((res) => res.json());

	const { data: NotificationData, mutate: NotificationMutate, error: NotificationError, isLoading: NotificationIsLoading } =  useSWR(
		`/api/notifications/GET_Notifications?Department=${encodeURIComponent(Department)}`,
		fetcher
	);

	const filteredNotificationData = NotificationData?.filter((notification) => {
        if (NotificationFilter !== "" && !notification.Title.toLowerCase().includes(NotificationFilter.toLowerCase())) {
            return false;
        }
        return true;
    });

	const HandleStatusChange = async (e) => {
		const value = e.target.value;
		let Action = "Add";
		if (value === "Cleared") {
			Action = "Add";
		} else {
			Action = "Remove";
		}

		try {
            const formData = new FormData(); 
            formData.append("Department", Department);
			formData.append("Id", e.target.dataset.notificationid);
            formData.append("GoogleEmail", decodeURIComponent(GoogleEmail));
			formData.append("Action", Action);

            const response = await fetch("/api/notifications/POST_UpdateCleared", {
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
			NotificationMutate();
		}
	} 


    const NotificationList = () => {
        return (
			<>
				{NotificationIsLoading && !filteredNotificationData ? (
					"Loading..."
				) : (
					filteredNotificationData.length > 0 ? (
						filteredNotificationData.map((notification, index) => (
							<ListItem key={index} isCleared={IsCleared(notification)} data={notification} name={notification.Title} id={notification._id} image={Department === "Medical" ? Medical : Department === "Dental" ? Dental : Department === "SDPC" ? SDPC : UserDefault} />
						))
					) : (
						"No results..."
					)
				)}
			</>
		);
    }

    const ListItem = ({key, data, isCleared, name, image, id}) => {
		return (
			<div className={styles.ListItem} key={key}>
				<Image
					className={styles.ListItemImage}
					src={image??UserDefault}
					alt="Image"
					width={50}
					height={50}
				/>
				<p className={styles.ListItemName}>{name}</p>
				<select className={isCleared ? styles.Cleared : styles.InProgress} data-notificationid={id} value={isCleared ? "Cleared" : "In Progress"} onChange={HandleStatusChange}>
					<option value="In Progress">In Progress</option>
					<option value="Cleared">Cleared</option>
				</select>
			</div>
		)
	}

	const IsCleared = (record) => {
		return record.Cleared && record.Cleared.includes(decodeURIComponent(GoogleEmail));
	}

	return (
		<div className={styles.MainContent}>
			<div className={`${styles.Header}`}>
				<p>Account Summary</p>
			</div>
			<div className={styles.Body}>
				<input className={styles.SearchBar} placeholder="Search..." type="search" onChange={(e)=>setNotificationFilter(e.target.value)}/>
				<div className={styles.NotificationList}>
					<NotificationList />
				</div>
			</div>
		</div>
	)
};

export default Page;


