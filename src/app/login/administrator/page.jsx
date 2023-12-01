"use client"

import React, { useState } from "react";
import styles from "./page.module.css";
import useSWR from "swr";
import { useRouter } from "next/navigation";

const Administrator = () => {

  const [uploadingD, setUploadingD] = useState(false);
  const [uploadingP, setUploadingP] = useState(false);

  const [idD, setIdD] = useState("");
  const [idP, setIdP] = useState("");

  const [editValueP, setEditValueP] = useState(null);
  const [editValueD, setEditValueD] = useState(null);

  const [isUpdatingP, setUpdatingP] = useState(false);
  const [isUpdatingD, setUpdatingD] = useState(false);

  const [isUploadingUpdateP, setUploadingUpdateP] = useState(false);
  const [isUploadingUpdateD, setUploadingUpdateD] = useState(false);

  const router = useRouter();

  const formatDate = (timestamp) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(timestamp).toLocaleDateString(undefined, options);
  
    const hours = new Date(timestamp).getHours();
    const minutes = new Date(timestamp).getMinutes();
    const amOrPm = hours >= 12 ? 'pm' : 'am';
    const formattedTime = `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')}${amOrPm}`;
  
    return `${formattedDate} ${formattedTime}`;
  };


  // DEPARTMENT

  const handleEditD = async (accountId) => {
    setUpdatingD(false);
    setIdD(accountId);
    try {
      const formData = new FormData();
      formData.append("id", accountId);
  
      const response = await fetch("/api/accounts/find", {
        method: "POST",
        body: formData,
      });
  
      if (response.ok) {
        const data = await response.json();
        setEditValueD(data);
        setUpdatingD(true);
        console.log("Account find successful");
      } else {
        console.log("Failed to find account");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteD = async (accountId) => {
    try {
      const formData = new FormData();
      formData.append("id", accountId);
  
      const response = await fetch("/api/accounts/delete", {
        method: "POST",
        body: formData,
      });
  
      if (response.ok) {
        console.log("Account deleted successfully");
        mutate();
      } else {
        console.log("Failed to delete account");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmitD = async (e) => {
    e.preventDefault();
    const Gmail = e.target[0].value;
    const Role = e.target[1].value;
    const Department = e.target[2].value;

    try {
        setUploadingD(true);
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
            setUploadingD(false);
            console.log("Complete");
            mutate(); 
        } else {
            setUploadingD(false);
            console.log("Failed");
        }
    } catch (err) {
        console.log(err);
    }
  };

  const handleUpdateD = async (e) => {
    e.preventDefault();
    const Gmail = e.target[0].value;
    const Role = e.target[1].value;
    const Department = e.target[2].value;

    try {
      setUploadingUpdateD(true);
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
          setUploadingUpdateD(false);
            console.log("Complete");
            mutate(); // mag refresh to
        } else {
          setUploadingUpdateD(false);
            console.log("Failed");
        }
    } catch (err) {
        console.log(err);
    }
  };



 // PATIENT
  
  const handleEditP = async (accountId) => {
    setUpdatingP(false);
    setIdP(accountId);
    try {
      const formData = new FormData();
      formData.append("id", accountId);
  
      const response = await fetch("/api/accounts/find", {
        method: "POST",
        body: formData,
      });
  
      if (response.ok) {
        const data = await response.json();
        setEditValueP(data);
        setUpdatingP(true);
        console.log("Account find successful");
      } else {
        console.log("Failed to find account");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteP = async (accountId) => {
    try {
      const formData = new FormData();
      formData.append("id", accountId);
  
      const response = await fetch("/api/accounts/delete", {
        method: "POST",
        body: formData,
      });
  
      if (response.ok) {
        console.log("Account deleted successfully");
        mutate();
      } else {
        console.log("Failed to delete account");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmitP = async (e) => {
    e.preventDefault();
    const Gmail = e.target[0].value;
    const Role = e.target[1].value;
    const Department = e.target[2].value;

    try {
        setUploadingP(true);
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
            setUploadingP(false);
            console.log("Complete");
            mutate(); 
        } else {
            setUploadingD(false);
            console.log("Failed");
        }
    } catch (err) {
        console.log(err);
    }
  };

  const handleUpdateP = async (e) => {
    e.preventDefault();
    const Gmail = e.target[0].value;
    const Role = e.target[1].value;
    const Department = e.target[2].value;

    try {
      setUploadingUpdateP(true);
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
          setUploadingUpdateP(false);
            console.log("Complete");
            mutate(); // mag refresh to
        } else {
          setUploadingUpdateP(false);
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

  if (!isLoading) {
    console.log(data);
  }

  const filteredData = data?.filter((account) => {
    if (filterDepartment === null) return true;
    return account.Department === filterDepartment;
  });


  const DepartmentsPanel = () => {
    return (<>
        <h3 className={styles.mainTitle}>Administrator</h3>
        <h3 className={styles.selectTitle}>Manage accounts below: Departments</h3>

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
                    <button className={styles.accountOptions} onClick={() => handleDeleteD(account._id)}>Delete</button>
                    <button className={styles.accountOptions} onClick={() => handleEditD(account._id)}>Edit</button>
                  </div>
                  
                </div>
              ))}

            </div>

            <div className={styles.forms}>

              <form className={styles.formContainer} onSubmit={handleSubmitD}>
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
                <button className={styles.button} disabled={uploadingD}>{uploadingD ? "Uploading..." : "Add Account"}</button>
              </form>

              {isUpdatingD && editValueD ? (
                <form className={styles.formContainer} onSubmit={handleUpdateD}>
                  <h3 className={styles.title}>Update Account Form</h3>
                  <input type="text" placeholder="Gmail Account" id="Gmail" className={styles.input} defaultValue={editValueD.GoogleEmail} required/>
                  <select className={styles.input} id="Role" defaultValue={editValueD.Role} required>
                    <option className={styles.option} value=""> Select role...</option>
                    <option className={styles.option} value="Management">Management Role</option>
                    <option className={styles.option} value="Admin">Admin Role </option>
                  </select>
                  <select className={styles.input} id="Department" defaultValue={editValueD.Department} required>
                    <option className={styles.option} value="">Select department...</option>
                    <option className={styles.option} value="Dental">Dental Department</option>
                    <option className={styles.option} value="Medical">Medical Department</option>
                    <option className={styles.option} value="SDPC">SDPC Department</option>
                  </select>
                  <button className={styles.button} disabled={isUploadingUpdateD} type="submit">{isUploadingUpdateD ? "Uploading..." : "Update Account"}</button>
                </form>
              ) : null}


            </div>
        </div>
      </>)
  };

  const PatientsPanel = () => {
    return (
    <>
      <h3 className={styles.mainTitle}>Administrator</h3>
      <h3 className={styles.selectTitle}>Manage accounts below: Students / Lay Collaborators</h3>

        <div className={styles.mainContainer}>

          <div className={styles.AccountList}>
            
            <div className={styles.departments}>
              <button className={`${styles.cbutton} ${filterDepartment === null ? styles.call : ''}`} onClick={() => handleFilter(null)}>All</button>
              <button className={`${styles.cbutton} ${filterDepartment === 'Students' ? styles.cstudents : ''}`} onClick={() => handleFilter('Students')}>Students</button>
              <button className={`${styles.cbutton} ${filterDepartment === 'Lay Collaborators' ? styles.clay : ''}`} onClick={() => handleFilter('Lay Collaborators')}>Lay Collaborators</button>
            </div>

            {isLoading ? "Loading..." : filteredData?.length === 0 ? "No Accounts" : filteredData?.map((account, index) => (
              <div key={index} className={`${styles.accountItem}`}>
                <div className={styles.accountItemLeft}>
                  <p className={styles.accountDepartment}>Full Name: {account.Department}</p>
                  <p className={styles.accountGmail}>Account: {account.GoogleEmail}</p>
                  <p className={styles.accountRole}>Role: {account.Role}</p>
                </div>
                <div className={styles.accountItemRight}>
                  <button className={styles.accountOptions} onClick={() => handleDeleteP(account._id)}>Delete</button>
                  <button className={styles.accountOptions} onClick={() => handleEditP(account._id)}>Edit</button>
                </div>
              </div>
            ))}

          </div>

          <div className={styles.forms}>

            <form className={styles.formContainer} onSubmit={handleSubmitP}>
              <h3 className={styles.title}>Account Form</h3>
              <input type="text" placeholder="Gmail Account" className={styles.input} required/>
              <select className={styles.input} required>
                <option className={styles.option} value="">Select role...</option>
                <option className={styles.option} value="Students">Student Role</option>
                <option className={styles.option} value="Lay Collaborators">Lay Collaborators Role</option>
              </select>
              <button className={styles.button} disabled={uploadingP}>{uploadingP ? "Uploading..." : "Add Account"}</button>
            </form>

            {isUpdatingP && editValueP ? (
              <form className={styles.formContainer} onSubmit={handleUpdateP}>
                <h3 className={styles.title}>Update Account Form</h3>
                <input type="text" placeholder="Gmail Account" id="Gmail" className={styles.input} defaultValue={editValueP.GoogleEmail} required/>
                <select className={styles.input} id="Role" defaultValue={editValueP.Role} required>
                  <option className={styles.option} value=""> Select role...</option>
                  <option className={styles.option} value="Management">Management Role</option>
                  <option className={styles.option} value="Admin">Admin Role </option>
                </select>
                <select className={styles.input} id="Department" defaultValue={editValueP.Department} required>
                  <option className={styles.option} value="">Select department...</option>
                  <option className={styles.option} value="Dental">Dental Department</option>
                  <option className={styles.option} value="Medical">Medical Department</option>
                  <option className={styles.option} value="SDPC">SDPC Department</option>
                </select>
                <button className={styles.button} disabled={isUploadingUpdateP} type="submit">{isUploadingUpdateP ? "Uploading..." : "Update Account"}</button>
              </form>
            ) : null}


            </div>
        </div>
      </>)
    };


    return (
      <div className={styles.container}>
        <DepartmentsPanel />
      </div>
    );
};

export default Administrator;
