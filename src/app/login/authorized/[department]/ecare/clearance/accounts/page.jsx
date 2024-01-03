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

  	const fetcher = (...args) => fetch(...args).then((res) => res.json());

	const { data: AccountsData, mutate: AccountsMutate, error: AccountsError, isLoading: AccountsIsLoading } =  useSWR(
		`/api/accounts/readDect`,
		fetcher
	);

	const filteredAccountsData = AccountsData?.filter((account) => {
		if (account.Role !== "Student" && account.Role !== "Lay Collaborator") {
            return false;
        }
        if (AccountsFilter !== "" && !account.GoogleName.toLowerCase().includes(AccountsFilter.toLowerCase())) {
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
							<ListItem key={index} data={account} name={account.GoogleName} id={account._id} image={account?.GoogleImage ?? UserDefault} callback={(e)=>router.push(`/login/authorized/${Department}/ecare/clearance/accounts/${account.Role}/${account.GoogleEmail}`)}/>
						))
					) : (
						"No results..."
					)
				)}
			</>
		);
    }

    const ListItem = ({key, name, image, id,callback}) => {
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


