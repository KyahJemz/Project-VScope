"use client"

import React, { useState, useEffect } from "react";
import useSWR from "swr";
import styles from "./page.module.css";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Image from "next/image";
import UserDefault from "public/UserDefault.png"

const Page = () => {
	
	const [UploadingForm,setUploadingForm] = useState(false);
  
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
  
	const { data, mutate, error, isLoading } = useSWR(
	  `/api/accounts/details?GoogleEmail=${encodeURIComponent(GoogleEmail)}`,
	  fetcher
	);
  
	if (status === "loading") {
	  return (
		<div className={styles.MainContainer}>
			Session Loading...
		</div>
	  )
	}

	const UploadWalkIn = async (e) => {
		e.preventDefault();
		setUploadingForm(true)

		try {

			const formData = new FormData(e.target);

			const response = await fetch("/api/accounts/addDetails", {
				method: "POST",
				body: formData,
			});

			mutate(); 
           
            if (response.ok) {
                console.log("Complete");
            } else {
                console.log("Failed");
            }
        } catch (err) {
            console.log(err);
        } finally {
			setUploadingForm(false);
			e.target.reset();
		}
	};
  
	const DetailsForm = () => {
		return (
			<div className={styles.DetailsFormContainer}>

				<div className={styles.ProfileContainer}>
					<Image
						className={styles.ProfileImage}
						src={session.user?.image??UserDefault}
						alt="profile picture" 
						width={150}
						height={150}
					/>
					<p className={styles.ProfileName}>{session.user.name}</p>
					<p className={styles.ProfileEmail}>{session.user.email}</p>
				</div>

				<form className={styles.DetailsForm} onSubmit={UploadWalkIn}>
					<div className={styles.DetailsRow}>
						<p className={styles.DetailsFormTitle}>Please update your details.</p>
					</div>
					<div className={styles.DetailsRow}>
						<input className={styles.DetailsFields} type="text" name="LastName" data-key="LastName"  placeholder="LastName" required/>
						<input className={styles.DetailsFields} type="text" name="FirstName" data-key="FirstName"  placeholder="FirstName" required/>
						<input className={styles.DetailsFields} type="text" name="MiddleName" data-key="MiddleName" placeholder="MiddleName"/>
					</div>
					<div className={styles.DetailsRow}>
						<input className={styles.DetailsFields} type="text" name="Address" data-key="Address" placeholder="Address" required/>
					</div>
					<div className={styles.DetailsRow}>
						<input className={styles.DetailsFields} type="date" name="Birthday" data-key="Birthday" placeholder="Birthday" required/>
						<input className={styles.DetailsFields} type="text" name="Age" data-key="Age" placeholder="Age" required/>
						<select className={styles.DetailsFields} type="text" name="Sex" placeholder="Sex" required> 
							<option value="">Sex...</option>
							<option value="Male">Male</option>
							<option value="Female">Female</option>
						</select>
						<select className={styles.DetailsFields} ype="text" name="Category" readOnly value={session.user.role} placeholder="Category" required> 
							<option value="">Category...</option>
							<option value="Student">Student</option>
							<option value="Lay Collaborator">Lay Collaborator</option>
						</select>
					</div>
					<div className={styles.DetailsRow}>
						<input className={styles.DetailsFields} type="text" name="CourseStrand" data-key="CourseStrand"  placeholder="Course / Strand"/>
						<input className={styles.DetailsFields} type="text" name="YearLevel" data-key="YearLevel"  placeholder="Year Level"/>
						<input className={styles.DetailsFields} type="text" name="GoogleEmail" readOnly value={GoogleEmail} data-key="GoogleEmail" placeholder="School Email" required />
						<input className={styles.DetailsFields} type="text" name="StudentNumber" data-key="StudentNumber" placeholder="Student Number"/>
					</div>	
					<div className={styles.DetailsRow}>
						<input className={styles.DetailsFields} type="text" name="ContactNumber" data-key="ContactNumber"  placeholder="Contact Number" required />
						<input className={styles.DetailsFields} type="text" name="InCaseOfEmergencyPerson" data-key="InCaseOfEmergencyPerson"  placeholder="In case of emergency person" required />
						<input className={styles.DetailsFields} type="text" name="InCaseOfEmergencyNumber" data-key="InCaseOfEmergencyNumber" placeholder="In case of emergency number" required />
					</div>	
					<div className={styles.DetailsRow}>
						<p>Proceed to next page if your information is completed:</p>
						{UploadingForm ? (
							<button type="submit" disabled className={styles.DetailsButton}>Uploading...</button>
						) : (
							<button type="submit" className={styles.DetailsButton}>Add record</button>
						)} 
						
					</div>
				</form>	
			</div>
		)
	}

	const DepartmentSelection = () => {
		return (
			<>
				<h3 className={styles.selectTitle}>Click down below:</h3>
				<div className={styles.items}>
	
					<div className={styles.itemcontainer}>
						<Link href="/login/services/appointments/Medical" className={styles.Medical}>
						<span className={styles.title}>Medical</span>
						</Link>
					</div>
		
					<div className={styles.itemcontainer}>
						<Link href="/login/services/appointments/Dental" className={styles.Dental}>
						<span className={styles.title}>Dental</span>
						</Link>
					</div>
					{Role === "Student" ?
						<div className={styles.itemcontainer}>
							<Link href="/login/services/appointments/SDPC" className={styles.SDPC}>
								<span className={styles.title}>SDPC</span>
							</Link>
						</div>
					:
						null
					}
				</div>
			</>
		);
	}

	return (
		<div className={styles.MainContainer}>
			{isLoading && status !== "authenticated" ? "Loading..." : data?.Details?.SchoolEmail ? <DepartmentSelection /> : <DetailsForm />}
		</div>
	);
};

export default Page;
