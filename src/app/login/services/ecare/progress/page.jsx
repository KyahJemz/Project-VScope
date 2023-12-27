
import React from "react";
import styles from "./page.module.css";
import Link from "next/link";
import Dental from "public/Dental.jpg";
import Medical from "public/Medical.jpg";
import SDPC from "public/SDPC.jpg";
import Image from "next/image";

const Page = () => {

	return (
		<div className={styles.MainContainer}>
			<h3 className={styles.selectTitle}>Progress - Select department down below:</h3>
			<div className={styles.items}>

				<Link href="/login/services/ecare/progress/Medical"  className={styles.itemcontainer}>
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
	
				<Link href="/login/services/ecare/progress/Dental" className={styles.itemcontainer}>
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
	
				<Link href="/login/services/ecare/progress/SDPC" className={styles.itemcontainer}>
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
			
			</div>
		</div>
	);
};

export default Page;
