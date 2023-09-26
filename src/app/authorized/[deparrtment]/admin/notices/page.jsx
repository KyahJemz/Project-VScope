"use client"

import React, { useState } from "react";
import styles from "./page.module.css";
import { notFound } from "next/navigation";
import useSWR from "swr";

// functn para sa Date Formatig
const formatDate = (timestamp) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = new Date(timestamp).toLocaleDateString(undefined, options);
  const hours = new Date(timestamp).getHours();
  const minutes = new Date(timestamp).getMinutes();
  const amOrPm = hours >= 12 ? 'pm' : 'am';
  const formattedTime = `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')}${amOrPm}`;
  return `${formattedDate} ${formattedTime}`;
};

const Notices = (params) => {
  const [uploading, setUploading] = useState(false);
  const department = params.searchParams.department;


  // taga fetch
  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const { data, mutate, error, isLoading } = useSWR(
      `/api/notices?department=${encodeURIComponent(department)}`,
      fetcher
  );

  const sortedData = data && !isLoading
    ? [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map(item => ({
                  ...item,
                  createdAt: formatDate(item.createdAt)
                }))
    : [];


  // parar sa submit appointment
  const handleSubmit = async (e) => {
    e.preventDefault();
    const nTitle = e.target[0].value;
    const nImage = e.target[1].files[0];
    const nDepartment = department;
    const nContent = e.target[2].value;
  
    try {
        setUploading(true);
        const formData = new FormData();
        formData.append("nTitle", nTitle);
        formData.append("nImage", nImage);
        formData.append("nDepartment", nDepartment);
        formData.append("nContent", nContent);

        console.log("Uploading");
        const response = await fetch("/api/notices", {
            method: "POST",
            body: formData,
        });
      
        setUploading(false);
        e.target.reset();

        if (response.ok) {
          console.log("Complete");
          mutate(); // mag refresh to
        } else {
          console.log("Failed");
        }
    } catch (err) {
        console.log(err);
    }
  };

  const NoticesList = () => {
    return (
      <div className={styles.appointmentList}>
        <h3 className={styles.title}>Notices History</h3>

        {isLoading ? "Loading..." : sortedData?.map((appointment, index) => (
          <div key={index} className={`${styles.appointmentListItem}`}>
            <h4 className={styles.aTitle}>Appointment #: <a className={styles.id}>{appointment.nTitle}</a></h4>
            <p className={styles.aDate}>{appointment.createdAt}</p>
            <h5 className={styles.aStatus}>Department: {appointment.nDepartment}</h5>
            <p className={styles.aConsern}>{appointment.nContent}</p>
          </div>
        ))}

      </div>
    );
  };

  const NoticesForm = () => {
    return (
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <h3 className={styles.title}>Post Notice Form</h3>
        <input 
          type="text" 
          placeholder="Title..."
          className={styles.input}
          required
        />
        <input 
          type="file" 
          className={styles.input}
        />
        <textarea 
          type="text" 
          className={styles.input}
          required
          placeholder="Content..."
          cols="30"
          rows="10"
        />
        <button className={styles.button} disabled={uploading}>{uploading ? "Uploading..." : "Post Notice"}</button>
      </form>
    );
  };

  const validation = (department) => {
    if (department === 'Dental' || department === 'Medical' || department === 'SDPC') {
        return data;
    } else {
      return notFound();
    }
  }

  const returned = validation(department);

  return (
    <div className={styles.mainContainer}>
      <h1>{department}</h1>
      <div className={styles.container}>
        {NoticesList()}
        {NoticesForm()}
      </div>
    </div>
  );
};

export default Notices;