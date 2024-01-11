"use client"

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import Dental from "public/Dental.jpg";
import Medical from "public/Medical.jpg";
import SDPC from "public/SDPC.jpg";
import useSWR from "swr";
import Image from "next/image";
import { useSession } from "next-auth/react";

const Page = () => {
	const { data: session, status } = useSession();
	const [GoogleEmail, setGoogleEmail] = useState("");
	const [Role, setRole] = useState("");
	
	useEffect(() => {
		if (status === "authenticated" && session?.user?.email) {
		  setGoogleEmail(session.user.email);
		  setRole(session.user.role);
		}
	  }, [status, session]);



	const fetcher = (...args) => fetch(...args).then((res) => res.json());

	const { data: RecordsData, mutate: RecordsMutate, error: RecordsError, isLoading: RecordsIsLoading } =  useSWR(
		  `/api/messages/GET_Messages?GoogleEmail=${encodeURIComponent(GoogleEmail)}`,
		  fetcher
	);
  
	const IsNew = (record, department) => {
		let unviewedCount = 0;
  
	  if (record) {
		for (const item of record) {
		  if (item?.Responses) {
			for (const response of item.Responses) {
			  if (response.ViewedByClient === false && item.Department === department) {
				unviewedCount++;
			  }
			}
		  }
		}
	  }
  
		  return unviewedCount;
	  };


	const { data, mutate, error, isLoading } = useSWR(
        `/api/messages/GET_Message?GoogleEmail=${encodeURIComponent(GoogleEmail)}`,
        fetcher
    );
	
	const HasDirectMessages = (record, department) => {
		let unviewedCount = 0;

		if (record) {
			for (const item of record) {
			  if (item?.Responses) {
				for (const response of item.Responses) {
				  if (response.ViewedByClient === false && item.Department === department) {
					unviewedCount++;
				  }
				}
			  }
			}
		  }

		return unviewedCount;
	};

	return (
		<div className={styles.MainContainer}>
			<h3 className={styles.selectTitle}>Messages - Select department down below:</h3>
			<div className={styles.items}>

				<Link href="/login/services/ecare/messages/Medical"  className={styles.itemcontainer}>
					<Image 
						className={styles.Image}
						src={Medical}
						alt="Medical"
						height={50}
						width={50}
					/>
					<span className={styles.title}>Medical Health Services</span>
					{(Number(IsNew(RecordsData,"Medical")) + Number(HasDirectMessages(data, "Medical"))) > 0 ? <><div className="dot"></div><div></div></> : <div></div>}
				</Link>
	
				<Link href="/login/services/ecare/messages/Dental" className={styles.itemcontainer}>
					<Image 
						className={styles.Image}
						src={Dental}
						alt="Dental"
						height={50}
						width={50}
					/>
					<span className={styles.title}>Dental Health Services</span>
					{(Number(IsNew(RecordsData,"Dental")) + Number(HasDirectMessages(data, "Dental"))) > 0 ? <><div className="dot"></div><div></div></> : <div></div>}
				</Link>
				{Role === "Student" ?
					<Link href="/login/services/ecare/messages/SDPC" className={styles.itemcontainer}>
						<Image 
							className={styles.Image}
							src={SDPC}
							alt="SDPC"
							height={50}
							width={50}
						/>
						<span className={styles.title}>SDPC Department</span>
						{(Number(IsNew(RecordsData,"SDPC")) + Number(HasDirectMessages(data, "SDPC"))) > 0 ? <><div className="dot"></div><div></div></> : <div></div>}
					</Link>
				: 
					null
				}
			
			</div>
		</div>
	);
};

export default Page;
