"use client"

import React, { useState } from "react";
import styles from "./page.module.css";
import useSWR from "swr";
import { useRouter } from "next/navigation";

const Administrator = () => {

	const [uploading, setUploading] = useState(false);

	const [id, setId] = useState("");

	const [editValue, setEditValue] = useState(null);

	const [isUpdating, setUpdating] = useState(false);

	const [isUploadingUpdate, setUploadingUpdate] = useState(false);

	const router = useRouter();

	const handleEdit = async (accountId) => {
		setUpdating(false);
		setId(accountId);
		try {
			const formData = new FormData();
			formData.append("id", accountId);
		
			const response = await fetch("/api/accounts/find", {
				method: "POST",
				body: formData,
			});
		
			if (response.ok) {
				const data = await response.json();
				setEditValue(data);
				setUpdating(true);
				console.log("Success");
			} else {
				console.log("Failed");
			}
		} catch (err) {
			console.log(err);
		}
	};

	const handleDelete = async (accountId) => {
		try {
			const formData = new FormData();
			formData.append("id", accountId);
		
			const response = await fetch("/api/accounts/delete", {
				method: "POST",
				body: formData,
			});
		
			if (response.ok) {
				console.log("Success");
				mutate();
			} else {
				console.log("Failed");
			}
		} catch (err) {
			console.log(err);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const Gmail = e.target[0].value;
		const Role = e.target[1].value;
		const Department = e.target[2].value;

		try {
			setUploading(true);
			const formData = new FormData();
			formData.append("Gmail", Gmail);
			formData.append("Role", Role);
			formData.append("Department", Department);

			const response = await fetch("/api/accounts/add", {
				method: "POST",
				body: formData,
			});
			
			e.target.reset();

			if (response.ok) {
				setUploading(false);
				console.log("Success");
				mutate(); 
			} else {
				setUploading(false);
				console.log("Failed");
			}
		} catch (err) {
			console.log(err);
		}
	};

	const handleUpdate = async (e) => {
		e.preventDefault();
		const Gmail = e.target[0].value;
		const Role = e.target[1].value;
		const Department = e.target[2].value;

		try {
			setUploadingUpdate(true);
			const formData = new FormData();
			formData.append("id", id);
			formData.append("Gmail", Gmail);
			formData.append("Role", Role);
			formData.append("Department", Department);

			const response = await fetch("/api/accounts/edit", {
				method: "PUT",
				body: formData,
			});
		
			e.target.reset();

			if (response.ok) {
				setUploadingUpdate(false);
				console.log("Success");
				mutate(); // mag refresh to
			} else {
				setUploadingUpdate(false);
				console.log("Failed");
			}
		} catch (err) {
			console.log(err);
		}
	};

  	const fetcher = (...args) => fetch(...args).then((res) => res.json());
          
	const { data, mutate, isLoading } =  useSWR(
		`/api/accounts/read`,
		fetcher
	);

  	const [filterDepartment, setFilterDepartment] = useState(null);

	const handleFilter = (department) => {
		setFilterDepartment(department);
	};

	const filteredData = data?.filter((account) => {
		if (account.Department === null || account.Department === "" || account.Department === "Administrator") {
		  	return false;
		}
	  
		if (filterDepartment === null) {
		  return account.Department !== null;
		}
	  
		return account.Department === filterDepartment;
	});
	  
  	const DepartmentsPanel = () => {
    	return (
			<>
				<h3 className={styles.mainTitle}>Administrator</h3>
				<div className={styles.selectTitle}>
					<span>Manage accounts:</span>
					<button className={`${styles.cbutton} ${styles.call}`} onClick={() => router.push('/login/administrator/departments')}>Management</button>
					<button className={styles.cbutton} onClick={() => router.push('/login/administrator/clients')}>Clients</button>
				</div>

          		<div className={styles.mainContainer}>

					<div className={styles.AccountList}>
						<div className={styles.departments}>
							<button className={`${styles.cbutton} ${filterDepartment === null ? styles.call : ''}`} onClick={() => handleFilter(null)}>All</button>
							<button className={`${styles.cbutton} ${filterDepartment === 'Dental' ? styles.cdental : ''}`} onClick={() => handleFilter('Dental')}>Dental</button>
							<button className={`${styles.cbutton} ${filterDepartment === 'Medical' ? styles.cmedical : ''}`} onClick={() => handleFilter('Medical')}>Medical</button>
							<button className={`${styles.cbutton} ${filterDepartment === 'SDPC' ? styles.csdpc : ''}`} onClick={() => handleFilter('SDPC')}>SDPC</button>
						</div>
						{isLoading ? "Loading..." : filteredData?.length === 0 ? "No Accounts" : filteredData?.map((account, index) => (
							<div key={index} className={`${styles.accountItem}`}>
								<div className={styles.accountItemLeft}>
									<p className={styles.accountGmail}>Account: {account.GoogleEmail}</p>
									<p className={styles.accountRole}>Role: {account.Role}</p>
									<p className={styles.accountDepartment}>Department: {account.Department}</p>
								</div>
								<div className={styles.accountItemRight}>
									<button className={styles.accountOptions} onClick={() => handleDelete(account._id)}>Delete</button>
									<button className={styles.accountOptions} onClick={() => handleEdit(account._id)}>Edit</button>
								</div>
							</div>
						))}
					</div>

					<div className={styles.forms}>

						<form className={styles.formContainer} onSubmit={handleSubmit}>
							<h3 className={styles.title}>Account Form</h3>
							<input type="text" placeholder="Gmail Account" className={styles.input} required/>
							<select className={styles.input} required>
								<option className={styles.option} value="">Select role...</option>
								<option className={styles.option} value="Management">Management Role</option>
								<option className={styles.option} value="Admin">Admin Role</option>
							</select>
							<select className={styles.input} required>
								<option className={styles.option} value="">Select department...</option>
								<option className={styles.option} value="Dental">Dental Department</option>
								<option className={styles.option} value="Medical">Medical Department</option>
								<option className={styles.option} value="SDPC">SDPC Department</option>
							</select>
							<button className={styles.button} disabled={uploading}>{uploading ? "Uploading..." : "Add Account"}</button>
						</form>

						{isUpdating && editValue ? (
							<form className={styles.formContainer} onSubmit={handleUpdate}>
							<h3 className={styles.title}>Update Account Form</h3>
							<input type="text" placeholder="Gmail Account" id="Gmail" className={styles.input} defaultValue={editValue.GoogleEmail} required/>
							<select className={styles.input} id="Role" defaultValue={editValue.Role} required>
								<option className={styles.option} value=""> Select role...</option>
								<option className={styles.option} value="Management">Management Role</option>
								<option className={styles.option} value="Admin">Admin Role </option>
							</select>
							<select className={styles.input} id="Department" defaultValue={editValue.Department} required>
								<option className={styles.option} value="">Select department...</option>
								<option className={styles.option} value="Dental">Dental Department</option>
								<option className={styles.option} value="Medical">Medical Department</option>
								<option className={styles.option} value="SDPC">SDPC Department</option>
							</select>
							<button className={styles.button} disabled={isUploadingUpdate} type="submit">{isUploadingUpdate ? "Uploading..." : "Update Account"}</button>
							</form>
						) : null}

            		</div>
        		</div>
    		</>
		)
  	};

    return (
      	<div className={styles.container}>
        	<DepartmentsPanel />
      	</div>
    );
};

export default Administrator;