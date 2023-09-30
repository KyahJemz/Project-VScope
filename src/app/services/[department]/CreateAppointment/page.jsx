"use client"

import React, { useState } from "react";
import styles from "./page.module.css";
import { notFound } from "next/navigation";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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

const Action = ({ params }) => {
  const { data: session, status } = useSession();
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const department = params.department;
  var GoogleEmail = "";

  if (status === 'authenticated' && session?.UserData){
    GoogleEmail = session.UserData.GoogleEmail;
  } 

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
    
  const { data, mutate, error, isLoading } =  useSWR(
      `/api/appointments?GoogleEmail=${encodeURIComponent(GoogleEmail)}&Department=${encodeURIComponent(department)}`,
      fetcher
  );

// taga bago ng arrangement
const sortedData = data && !isLoading
  ? [...data].sort((a, b) => {
      if (a.Status === 'Approved' && b.Status !== 'Approved') return -1;
      if (b.Status === 'Approved' && a.Status !== 'Approved') return 1;

      if (a.Status === 'Completed' && b.Status !== 'Completed') return -1;
      if (b.Status === 'Completed' && a.Status !== 'Completed') return 1;

      if (a.Status === 'Canceled' && b.Status !== 'Canceled') return 1;
      if (b.Status === 'Canceled' && a.Status !== 'Canceled') return -1;

      return b.createdAt.localeCompare(a.createdAt);
  }).map(item => ({
    ...item,
    createdAt: formatDate(item.createdAt)
  }))
  : [];

  const [filterStatus, setFilterStatus] = useState(null);

  const handleFilter = (status) => {
    setFilterStatus(status);
  };

  const filteredData = sortedData.filter((appointment) => {
    if (filterStatus === null) return true;
    return appointment.Status === filterStatus;
  });



// parar sa submit appointment
  const handleSubmit = async (e) => {
    e.preventDefault();
    const Name = e.target[0].value;
    const Id = e.target[1].value;
    const Category = e.target[2].value;
    const Consern = e.target[3].value;
    const Department = department;
    const GoogleEmail = Email;
  
    try {
        setUploading(true);
        const formData = new FormData();
        formData.append("Name", Name);
        formData.append("Id", Id);
        formData.append("Category", Category);
        formData.append("Consern", Consern);
        formData.append("Department", Department);
        formData.append("GoogleEmail", GoogleEmail);

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

  const HandleCancelBtn = async (AppointmentId) => {
    try {
      console.log(AppointmentId);
      const formData = new FormData();
      formData.append("Department", department);
      formData.append("AppointmentId", AppointmentId);
      formData.append("Status", 'Canceled');

      const response = await fetch("/api/appointments/POST_UpdateStatus", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Complete");
        mutate(); 
      } else {
        console.log("Failed");
      }
    } catch (err) {
      console.log(err);
    }
  }

  const validation = (department) => {
    if (department === 'Dental' || department === 'Medical' || department === 'SDPC') {
        return true;
    } else {
      return false;
    }
  }

  const returned = validation(department);

  if (returned) {

    return (
      <div className={styles.mainContainer}>
        <h1>{department}</h1>
        <div className={styles.container}>
        <div className={styles.appointmentList}>
          <h3 className={styles.title}>Appointments History</h3>
          <div className={styles.status}>
            <button className={`${styles.cbutton} ${filterStatus === null ? styles.call : ''}`} onClick={() => handleFilter(null)}>All</button>
            <button className={`${styles.cbutton} ${filterStatus === 'Pending' ? styles.cpending : ''}`} onClick={() => handleFilter('Pending')}>Pending</button>
            <button className={`${styles.cbutton} ${filterStatus === 'Approved' ? styles.capproved : ''}`} onClick={() => handleFilter('Approved')}>Approved</button>
            <button className={`${styles.cbutton} ${filterStatus === 'Completed' ? styles.ccompleted : ''}`} onClick={() => handleFilter('Completed')}>Completed</button>
            <button className={`${styles.cbutton} ${filterStatus === 'Canceled' ? styles.ccanceled : ''}`} onClick={() => handleFilter('Canceled')}>Canceled</button>
            <button className={`${styles.cbutton} ${filterStatus === 'Rejected' ? styles.crejected : ''}`} onClick={() => handleFilter('Rejected')}>Rejected</button>
          </div>
          {isLoading ? "Loading..." : filteredData.length === 0 ? "No appointments" : filteredData.map((appointment, index) => (
            <div key={index} className={`${styles.appointmentListItem} ${styles[appointment.Status]}`}  onClick={() => (appointment.Status === 'Approved' || appointment.Status === 'Completed') ? router.push('/services/'+department+'/CreateAppointment/'+appointment._id) : null}>
              <h4 className={styles.aTitle}>Appointment #: <a className={styles.id}>{appointment._id}</a> {appointment.Status === 'Pending' ? <button className={styles.cancelBtn} onClick={()=> HandleCancelBtn(appointment._id)}>Cancel</button> : null}</h4>
              <p className={styles.aDate}>{appointment.createdAt}</p>
              <h5 className={styles.aStatus}>Status: {appointment.Status}</h5>
              <p className={styles.aConsern}>{appointment.Consern}</p>
            </div>
          ))
          }
        </div>

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
        </div>
      </div>
    );
  } else {
    return notFound();
  }
};

export default Action;