"use client"

import React, { useState,useEffect } from "react";
import useSWR from "swr";
import { useRouter  } from "next/navigation";
import styles from "./page.module.css";
import Image from "next/image";
import UserDefault from "/public/UserDefault.png"
import Medical from "public/Medical.jpg";
import SDPC from "public/SDPC.jpg";
import Dental from "public/Dental.jpg";

const Page = ({params}) => {
	const Department = params.department;
	const router = useRouter();

    const [AccountsFilter, setAccountsFilter] = useState("");
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

	const { data: AccountsData, mutate: AccountsMutate, error: AccountsError, isLoading: AccountsIsLoading } =  useSWR(
		`/api/accounts/read`,
		fetcher
	);

	const filteredAccountsData = AccountsData.filter((account) => {
        if (AccountsFilter !== "" && !account.Title.toLowerCase().includes(AccountsFilter.toLowerCase())) {
            return false;
        }
        return true;
    });


    const AccountList = () => {
        return (
			<>
				{AccountsIsLoading && !filteredAccountsData ? (
					"Loading..."
				) : (
					filteredAccountsData.length > 0 ? (
						filteredAccountsData.map((account, index) => (
							<ListItem key={index} data={account} name={notification.Title} side={CheckIfCleared(notification) ? "Cleared" : "In Progress"} id={notification._id}  image={Department === "Medical" ? Medical : Department === "Dental" ? Dental : Department === "SDPC" ? SDPC : UserDefault} callback={(e)=>router.push(`/login/services/records/healthservices/${Department}/notification/${notification._id}`)}/>
						))
					) : (
						"No clearances yet"
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
			<div className={`${styles.Header}`}>
				<p>{Department} - Clearances</p>
			</div>
			<div className={styles.Body}>
				<input className={styles.SearchBar} placeholder="Search..." type="search" onChange={(e)=>setAccountsFilter(e.target.value)}/>
				<AccountList />
			</div>
		</div>
	)
};

export default Page;


