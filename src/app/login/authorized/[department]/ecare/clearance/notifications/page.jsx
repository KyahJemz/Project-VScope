"use client"

import React, { useState } from "react";
import useSWR from "swr";
import { useRouter  } from "next/navigation";
import styles from "./page.module.css";
import ActionConfirmation from "@/components/ActionConfirmation/ActionConfirmation";

const Page = ({ params }) => {
	const Department = params.department;
	const router = useRouter();

	const [Category, setCategory] = useState("All");
	const [Search, setSearch] = useState("");

	const [IsDeleting, setIsDeleting] = useState(false);

	const [showConfirmation,setShowConfirmation] = useState(false);
	const [ConfirmationData, setConfirmationData] = useState({
		title: "",
		content: "",
		onYes: () => {},
		onCancel: () => {},
	});


	const fetcher = (...args) => fetch(...args).then((res) => res.json());
    
	const { data, mutate, error, isLoading } =  useSWR(
		`/api/notifications/GET_Notifications?Department=${encodeURIComponent(Department)}`,
		fetcher
	);

	const sortedNotifications = data && data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
	
	const filteredNotifications = sortedNotifications
    ? sortedNotifications
        .filter(
          (notification) =>
            Category === "All" || notification.Target === Category
        )
        .filter((notification) =>
          notification.Title.toLowerCase().includes(Search.toLowerCase())
        )
    : [];
 
	const Delete = async (e) => {
		setIsDeleting(true);
		try {
            const formData = new FormData(); 
			formData.append("Department", Department);
			formData.append("Id", e.target.dataset.id);

            const response = await fetch("/api/notifications/POST_DeleteNotification", {
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
			setShowConfirmation(false);
			setIsDeleting(false);
			mutate();
		}
	}

	const DeleteConfirmation = (e) => {
		setConfirmationData({
			title: "Delete Confirmation",
			content: `Do you like to delete this [ ${e.target.dataset.name} ]?`,
			onYes: () => Delete(e),
			onCancel: () => setShowConfirmation(false),
		});
		setShowConfirmation(true);
	};

	return (
		<>

			{showConfirmation && (
				<ActionConfirmation
					title={ConfirmationData.title}
					content={ConfirmationData.content}
					onYes={ConfirmationData.onYes}
					onCancel={ConfirmationData.onCancel}
				/>
			)}

			<div className={styles.MainContent}>	

				<div className={styles.Header}>
					<input className={styles.SearchBar} type="search" name="" id="" placeholder="Search..." onChange={(e)=>setSearch(e.target.value)}/>
					<button className={`${styles.CategoryBtn} ${Category === "All" ? styles.Active : null}`} onClick={()=>setCategory("All")}>All</button>
					<button className={`${styles.CategoryBtn} ${Category === "Students" ? styles.Active : null}`} onClick={()=>setCategory("Students")}>Students</button>
					<button className={`${styles.CategoryBtn} ${Category === "Lay Collaborator" ? styles.Active : null}`} onClick={()=>setCategory("Lay Collaborators")}>Lay Collaborator</button>
				</div>
				<div className={styles.Add}>
					<button className={`${styles.CategoryBtn}`} onClick={()=>router.push('/login/authorized/'+Department+'/ecare/clearance/notifications/add')}>+ Add</button>
				</div>
				<div className={styles.List}>
					{isLoading ? "Loading..." : filteredNotifications.length === 0 ? "No results" : filteredNotifications?.map((notification, index) => (
						<>
							<div key={index} className={styles.Notification}>
								<p className={styles.NotificationName}>{notification.Title} <a className={styles.NotificationTarget}>({notification.Target === "All" ? "Everyone" : notification.Target})</a></p>
								<button className={styles.NotificationViewBtn} disabled={IsDeleting} onClick={()=>router.push('/login/authorized/'+Department+'/ecare/clearance/notifications/'+notification._id)}>View</button>
								<button data-id={notification._id} data-name={notification.Title} className={styles.NotificationDeleteBtn} disabled={IsDeleting} onClick={DeleteConfirmation}>Delete</button>
							</div>
						</>
					))}
				</div>
			</div>
		</>
	)
};

export default Page;


