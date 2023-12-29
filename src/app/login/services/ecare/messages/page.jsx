"use client"

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import Dental from "public/Dental.jpg";
import Medical from "public/Medical.jpg";
import SDPC from "public/SDPC.jpg";
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
					<div></div>
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
					<div></div>
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
						<div></div>
					</Link>
				: 
					null
				}
			
			</div>
		</div>
	);
};

export default Page;
