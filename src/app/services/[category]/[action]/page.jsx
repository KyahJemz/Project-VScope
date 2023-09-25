"use client"

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import { notFound } from "next/navigation";
import useSWR from "swr";
import { useSession } from "next-auth/react";

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



const Action = (params) => {
  const { data: session, status } = useSession();
  const [uploading, setUploading] = useState(false);
  const category = params.params.category;
  const target = params.searchParams.target;
  let Email = '';

  if (status === 'authenticated' && session?.user?.email) {
    Email = session.user.email;
    console.log(Email);
  }

    // taga fetch
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
    
  const { data, mutate, error, isLoading } =  useSWR(
      `/api/appointments?GoogleEmail=${encodeURIComponent(Email)}&category=${encodeURIComponent(category)}`,
      fetcher
  );

// taga bago ng arrangement
  const sortedData = data && !isLoading
  ? [...data].sort((a, b) => {
      if (a.aStatus === 'approved' && b.aStatus !== 'approved') return -1;
      if (b.aStatus === 'approved' && a.aStatus !== 'approved') return 1;
      if (a.aStatus === 'completed' && b.aStatus !== 'completed') return 1; 
      if (b.aStatus === 'completed' && a.aStatus !== 'completed') return -1; 

      return b.createdAt.localeCompare(a.createdAt);
  }).map(item => ({
    ...item,
    createdAt: formatDate(item.createdAt)
  }))
  : [];




// parar sa submit appointment
  const handleSubmit = async (e) => {
    e.preventDefault();
    const aName = e.target[0].value;
    const aId = e.target[1].value;
    const aCategory = e.target[2].value;
    const aConsern = e.target[3].value;
    const aDepartment = category;
    const GoogleEmail = Email;
    console.log('PAGE', Email);
  
    try {
        setUploading(true);
        const formData = new FormData();
        formData.append("aName", aName);
        formData.append("aId", aId);
        formData.append("aCategory", aCategory);
        formData.append("aConsern", aConsern);
        formData.append("aDepartment", aDepartment);
        formData.append("GoogleEmail", GoogleEmail);

        console.log("Uploading");
        const response = await fetch("/api/appointments", {
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


  const AppointmentList = () => {
    return (
      <div className={styles.appointmentList}>
        <h3 className={styles.title}>Appointments History</h3>

        {isLoading ? "Loading..." : sortedData?.map((appointment, index) => (
          <div key={index} className={`${styles.appointmentListItem} ${styles[appointment.aStatus]}`}>
            <h4 className={styles.aTitle}>Appointment #: <a className={styles.id}>{appointment._id}</a></h4>
            <p className={styles.aDate}>{appointment.createdAt}</p>
            <h5 className={styles.aStatus}>Status: {appointment.aStatus}</h5>
            <p className={styles.aConsern}>{appointment.aConsern}</p>
          </div>
        ))}

      </div>
    );
  };

  const AppointmentForm = () => {
    return (
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <h3 className={styles.title}>Appointment Form</h3>
        <input 
          type="text" 
          placeholder="Lastname, Firstname MI."
          className={styles.input}
          required
        />
        <input 
          type="text" 
          placeholder="Student no."
          className={styles.input}
          required
        />
        <select className={styles.input} required>
        <option className={styles.option} value="">Select category...</option>
          <option className={styles.option} value="student">Student</option>
          <option className={styles.option} value="client">Client</option>
        </select>
        <textarea 
          type="text" 
          className={styles.input}
          required
          placeholder="Concern"
          cols="30"
          rows="10"
        />
        <button className={styles.button} disabled={uploading}>{uploading ? "Uploading..." : "Upload Request"}</button>
      </form>
    );
  };

  const validation = (category,target) => {
    if (category === 'Dental' || category === 'Medical' || category === 'SDPC') {
      if (target === 'Dental' || target === 'Medical' || target === 'SDPC') {
          return [AppointmentList(), AppointmentForm()];
      } else {
        return notFound();
      }
    } else {
      return notFound();
    }
  }

  const returned = validation(category,target);

  return (
    <div className={styles.mainContainer}>
      <h1>{category}</h1>
      <div className={styles.container}>
        {returned[0]}
        {returned[1]}
      </div>
    </div>
  );
};

export default Action;