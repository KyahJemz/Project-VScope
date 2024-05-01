"use client"

import React, { useState } from "react";
import useSWR from "swr";
import { useRouter  } from "next/navigation";
import styles from "./page.module.css";
import Image from "next/image";
import UserDefault from "/public/UserDefault.png"

const Page = ({params}) => {
	const Department = params.department;
	const router = useRouter();

    const [AccountsFilter, setAccountsFilter] = useState("");
	const [Selected, setSelected] = useState(null);
	const [StatusFilter, setStatusFilter] = useState("");

	const [StatusChanged, setStatusChanged] = useState("");

  	const fetcher = (...args) => fetch(...args).then((res) => res.json());

	const { data: AccountsData, mutate: AccountsMutate, error: AccountsError, isLoading: AccountsIsLoading } =  useSWR(
		`/api/sickness/sickness/GET_currentSickness?Department=${Department}`,
		fetcher
	);

	const filteredAccountsData = AccountsData ? AccountsData.filter((account) => {
		if (AccountsFilter !== "" && 
			!account.Name.toLowerCase().includes(AccountsFilter.toLowerCase()) &&
			!account.GoogleEmail.toLowerCase().includes(AccountsFilter.toLowerCase())) {
				return false;
		}
		if (StatusFilter !== "" && !account.Status.toLowerCase().includes(StatusFilter.toLowerCase())) {
			return false;
		}
		return true;
	}) : [];


    const AccountList = () => {
        return (
			<>
				{AccountsIsLoading && !filteredAccountsData ? (
					"Loading..."
				) : (
					filteredAccountsData.length > 0 ? (
						filteredAccountsData.map((account, index) => (
							<ListItem key={index} data={account} date={account.updatedAt} email={account.GoogleEmail} name={account.Name} id={account._id} image={account?.GoogleImage ?? UserDefault} callback={(e)=>setSelected(account)}/>
						))
					) : (
						"No results..."
					)
				)}
			</>
		);
    }

	const formatShortDate = (timestamp) => {
        const options = { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' };
        const formattedDate = new Date(timestamp).toLocaleDateString(undefined, options);
    
        return `${formattedDate}`;
    };


    const ListItem = ({key, name, image, email, date, id, callback}) => {
		return (
			<div className={styles.ListItem} key={key} onClick={callback}>
				<Image
					className={styles.ListItemImage}
					src={image??UserDefault}
					alt="Image"
					width={50}
					height={50}
				/>
				<div>
					<p className={styles.ListItemName}>{name}</p>
					<p className={styles.ListItemEmail}>{email}</p>
				</div>
				<div>
					<p className={styles.ListItemLast}>Last Update:</p>
					<p className={styles.ListItemDate}>{formatShortDate(date)}</p>
				</div>
			</div>
		)
	}

	const regroupUpdates = (Updates) => {
		const groupedUpdates = {};
	
		Updates.sort((a, b) => {
			return new Date(b.Date) - new Date(a.Date);
		});
	
		Updates.forEach((item) => {
			const itsDate = new Date(item.Date).toDateString();
	
			if (groupedUpdates[itsDate]) {
				groupedUpdates[itsDate].push(item);
			} else {
				groupedUpdates[itsDate] = [item]; 
			}
		});
	
		return groupedUpdates;
	};

	const updateStatus = async (status, id, department, googleEmail) => {
        try {
            const formData = new FormData();
            formData.append("Department", department);
            formData.append("GoogleEmail", googleEmail);
			formData.append("Id", id);
            formData.append("Status", status);

            const response = await fetch("/api/sickness/sickness/POST_updateSicknessStatus", {
                method: "POST",
                body: formData,
            });
    
            if (response.ok) {
                console.log("Complete");
                alert("Update Complete!");
				AccountsMutate();
            } else {
                console.log("Failed");
                alert("Update Failed, Try Again!");
            }
        } catch (err) {
            console.log(err);
        } finally {
        }
    }

	return (
		<div className={styles.MainContent}>
			<div className={`${styles.Header}`}>
				<p>{Department} - Sickness Reports</p>
			</div>
			<div className={styles.Body}>
				<input className={styles.SearchBar} placeholder="Search..." type="search" onChange={(e)=>setAccountsFilter(e.target.value)}/>
				<div>
					<button className={`${styles.StatusFilterBtn} ${StatusFilter === "In Progress" ? styles.FilterActive : null}`} onClick={() => (StatusFilter === "In Progress" ? setStatusFilter("") : setStatusFilter("In Progress"))}>In Progress</button>
					<button className={`${styles.StatusFilterBtn} ${StatusFilter === "Approved" ? styles.FilterActive : null}`} onClick={() => (StatusFilter === "Approved" ? setStatusFilter("") : setStatusFilter("Approved"))}>Approved</button>
					<button className={`${styles.StatusFilterBtn} ${StatusFilter === "Rejected" ? styles.FilterActive : null}`} onClick={() => (StatusFilter === "Rejected" ? setStatusFilter("") : setStatusFilter("Rejected"))}>Rejected</button>
					<button className={`${styles.StatusFilterBtn} ${StatusFilter === "Cleared" ? styles.FilterActive : null}`} onClick={() => (StatusFilter === "Cleared" ? setStatusFilter("") : setStatusFilter("Cleared"))}>Cleared</button>
				</div>
				<div className={styles.AccountList}>
					<AccountList />
				</div>
			</div>
			<div className={styles.Sickness}>
				<div className={styles.SicknessMain}>Status</div>
				<div className={styles.SicknessHeader}>
					<Image
						className={styles.ListItemImage}
						src={Selected?.GoogleImage??UserDefault}
						alt="Image"
						width={50}
						height={50}
					/>
					<div>
						<p className={styles.ListItemName}>{Selected?.Name??"Select sickness report"}</p>
						<p className={styles.ListItemEmail}>{Selected?.GoogleEmail??""}</p>
					</div>
				</div>
				<div className={styles.SicknessStatus}>
					{Selected?.Status ? (
						<>
							<span>Health Monitoring: </span>
							{/* <span className={styles[Selected.Status.replace(/\s/g, '')]}>{Selected.Status}</span> */}
							<select className={styles[Selected.Status.replace(/\s/g, '')]} value={Selected.Status} onChange={(e)=>{updateStatus(e.target.value, Selected._id, Selected.Department, Selected.GoogleEmail)}}>
								<option value="Approved">Approved</option>
								<option value="Rejected">Rejected</option>
								<option value="Cleared">Cleared</option>
								<option value="Advising">Advising</option>
							</select>
						</>)
					: ""}
				</div>
				<div className={styles.SicknessBody}>
					<hr />
					{/* {Selected?.Diagnosis ? Selected.Diagnosis.map((item)=>{
						return <p className={styles.DiagnosisItem}>{item}</p>
					}): null} */}
					<hr />
					{Selected?.Updates ? Object.entries(regroupUpdates(Selected.Updates)).map(([date, updates]) => {
						return (
							<div className={styles.days} key={date}>
								<p className={styles.Date}>{date}</p>
								<div className={styles.symptoms}>
								{updates.map((update) => (
									<>
										<p className={styles.DiagnosisItem}>{update.Symptoms}</p>
										<p className={styles.DiagnosisDate}>{formatShortDate(update.Date)}</p>
									</>
								))}
								</div>
							</div>
						);
					}) : null}
					<hr />
				</div>
			</div>
		</div>
	)
};

export default Page;


