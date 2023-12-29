"use client"

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import useSWR from "swr";
import { useRouter } from "next/navigation";

const Page = ({ params }) => {
	const Department = params.department;
	const [uploading, setUploading] = useState(false);

	const [id, setId] = useState("");

	const [editValue, setEditValue] = useState(null);

	const [isUpdating, setUpdating] = useState(false);

	const [Panel, setPanel] = useState("Add");

	const [SelectedRole, setSElectedRole] = useState("");

	const [isUploadingUpdate, setUploadingUpdate] = useState(false);

	const router = useRouter();

	const Descriptions = {
		Admin: "Admin-side limited access refers to user accounts that have restricted privileges within the Vscope system. Individuals with management-side access typically possess specific roles and responsibilities tailored to their organizational function. This limited access ensures that users can perform essential tasks related to their roles without compromising the integrity of critical system settings.",
		Student: "Student-side limited access refers to user accounts that have restricted privileges within the Vscope system. Individuals with management-side access typically possess specific roles and responsibilities tailored to their organizational function. This limited access ensures that users can perform essential tasks related to their roles without compromising the integrity of critical system settings.",
		"Lay Collaborator": "Lay Collaborator-side limited access refers to user accounts that have restricted privileges within the Vscope system. Individuals with management-side access typically possess specific roles and responsibilities tailored to their organizational function. This limited access ensures that users can perform essential tasks related to their roles without compromising the integrity of critical system settings.",
		Management: "Management-side limited access refers to user accounts that have restricted privileges within the Vscope system. Individuals with management-side access typically possess specific roles and responsibilities tailored to their organizational function. This limited access ensures that users can perform essential tasks related to their roles without compromising the integrity of critical system settings.",
		"": "Select Role..."
	}

	const handleEdit = async (accountId) => {
		setPanel("Edit");
		setEditValue(null);
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
			formData.append("Department", Department === "Accounts" ? "" : Department);

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
			formData.append("Department", Department === "Accounts" ? "" : Department);

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

	useEffect(() => {
		if (editValue?.Role) {
		  setSElectedRole(editValue.Role);
		} else {
		  setSElectedRole("");
		}
	}, [editValue]);


	const filteredData = data?.filter((account) => {
		if (Department === "Accounts") {
			return account.Role === "Student" || account.Role === "Lay Collaborator";
		} else {
			return account.Department === Department;
		}
	});
	  
  	const DepartmentsPanel = () => {
    	return (
			<>
          		<div className={styles.AdministratorBody}>
					<div className={styles.AccountList}>
						{isLoading ? "Loading..." : filteredData?.length === 0 ? "No Accounts" : filteredData?.map((account, index) => (
							<div key={index} className={`${styles.accountItem}`}>
								<div className={styles.accountItemLeft}>
									<p className={styles.accountGmail}>{account.GoogleEmail}</p>
									<p className={styles.accountRole}>Role: {account.Role}</p>
								</div>
								<div className={styles.accountItemRight}>
									<button className={styles.accountOptions} onClick={() => handleDelete(account._id)}>Delete</button>
									<button className={styles.accountOptions} onClick={() => handleEdit(account._id)}>Edit</button>
								</div>
							</div>
						))}

						<div className={`${styles.addAccountItem}`} onClick={()=>setPanel("Add")}>
							<p className={styles.addAccountBtn}>Add Account</p>
						</div>
					</div>

					<div className={styles.forms}>

						{Panel === "Add" ? 
							<form className={styles.formContainer} onSubmit={handleSubmit}>
								<h3 className={styles.title}>Add Account Form</h3>
								<input type="text" placeholder="Gmail Account" className={styles.input} required/>
								<select className={styles.input} defaultValue={SelectedRole} required onChange={(e)=>setSElectedRole(e.target.value)}>
									<option className={styles.option} value="">Select role...</option>
									{Department === "Accounts" ? 
										<>
											<option className={styles.option} value="Student">Student Role</option>
											<option className={styles.option} value="Lay Collaborator">Lay Collaborator Role</option>
										</>
									: 
										<>
											<option className={styles.option} value="Management">Management Role</option>
											<option className={styles.option} value="Admin">Admin Role</option>
										</>
									}
								</select>
								<select hidden className={styles.input} value={Department === "Accounts" ? "" : Department}>
									<option className={styles.option} value={Department === "Accounts" ? "" : Department}>{Department === "Accounts" ? "" : Department}</option>
								</select>
								<div className={styles.Description}>
									<p className={styles.DescriptionTitle}>{SelectedRole} Role</p>
									{Descriptions[SelectedRole]}
								</div>
								<button className={styles.button} disabled={uploading}>{uploading ? "Uploading..." : "Add Account"}</button>
							</form>
						:
							<form className={styles.formContainer} onSubmit={handleUpdate}>
								<h3 className={styles.title}>Update Account Form</h3>
								<input type="text" placeholder="Gmail Account" id="Gmail" className={styles.input} defaultValue={isLoading ? "Loading..." : editValue?.GoogleEmail ?? "Loading..."} required/>
								<select className={styles.input} id="Role" defaultValue={SelectedRole}  required onChange={(e)=>setSElectedRole(e.target.value)}>
									<option className={styles.option} value=""> Select role...</option>
									{Department === "Accounts" ? 
										<>
											<option className={styles.option} value="Student">Student Role</option>
											<option className={styles.option} value="Lay Collaborator">Lay Collaborator Role</option>
										</>
									: 
										<>
											<option className={styles.option} value="Management">Management Role</option>
											<option className={styles.option} value="Admin">Admin Role</option>
										</>
									}
								</select>
								<select hidden className={styles.input} value={Department === "Accounts" ? "" : Department}>
									<option className={styles.option} value={Department === "Accounts" ? "" : Department}>{Department === "Accounts" ? "" : Department}</option>
								</select>
								<div className={styles.Description}>
									<p className={styles.DescriptionTitle}>{SelectedRole} Role</p>
									{Descriptions[SelectedRole]}
								</div>
								<button className={styles.button} disabled={isUploadingUpdate} type="submit">{isUploadingUpdate ? "Uploading..." : "Update Account"}</button>
							</form>
						}
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

export default Page;
