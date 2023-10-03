"use client"

import React, { useState } from "react";
import styles from "./page.module.css";
import useSWR from "swr";

const formatDate = (timestamp) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = new Date(timestamp).toLocaleDateString(undefined, options);

  const hours = new Date(timestamp).getHours();
  const minutes = new Date(timestamp).getMinutes();
  const amOrPm = hours >= 12 ? 'pm' : 'am';
  const formattedTime = `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')}${amOrPm}`;

  return `${formattedDate} ${formattedTime}`;
};

const Appointments = ({ params }) => {
  const Department = params.department;

  const [Status, setStatus] = useState();
  const [Uploading, setUploading] = useState(false);

  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const { data: Appointments, mutate: Appointmentsmutate, error: Appointmentsserror, isLoading: AppointmentsisLoading } = useSWR(
    `/api/appointments/GET_PendingByDepartment?Department=${encodeURIComponent(Department)}`,
    fetcher
  );
  
  var Email = "Test Email"; /// SESSION EMAIL

  const handleSubmit = async (e) => {
    e.preventDefault();

    setUploading(true);

    console.log('ADCTION', Status);

    try {
        const formData = new FormData();
        formData.append("Name", Department);
        formData.append("Email", Email);
        formData.append("Response", e.target[0].value);
        formData.append("AppointmentId", e.target[1].value);
        formData.append("Department", Department);
        formData.append("Status", Status);
        console.log(Status);

        const response = await fetch("/api/appointments/POST_AddResponse", { method: "POST", body: formData });
        setUploading(false);
        if (response.ok) {
            console.log("Complete");
            Appointmentsmutate();
        } else {
            console.log("Failed");
        }
    } catch (err) {
        console.log(err);
    }
  };

  return (
    <div className={styles.mainContainer}>
        <h1>{Department}</h1>
        <div className={styles.appointmentList}>
          <h3 className={styles.title}>Appointments</h3>
          <div className={styles.AppointmetsContainer}>
              {AppointmentsisLoading ? "Loading..." : Appointments?.lenght && Appointments.lenght === 0 ? "No pending cooncerns at the mmement" : Appointments.map((data, index) => (
                  <div key={index} className={styles.AppointmentsItem}>
                      <div className={styles.details}>
                          <p className={styles.stats}>{data.Status}</p>
                          <p className={styles.date}>{formatDate(data.createdAt)}</p>
                      </div>
                      
                      <p className={styles.name}>{data.Name}</p>
                      <p className={styles.id}>{data.Id}</p>
                      <p className={styles.email}>{Appointments.GoogleEmail}</p>
                      <p className={styles.category}>{data.Category}</p>
                      <p className={styles.consern}>{data.Consern}</p>
          
                      <form className={styles.actions} onSubmit={handleSubmit} >
                          <input 
                            className={styles.input}
                            type="text" 
                            placeholder="Response"
                          />
                          <input 
                            className={styles.hide}
                            type="text" 
                            value={data._id}
                            hidden
                          />
                          <button type="submit" disabled={Uploading} onClick={() => setStatus('Approved')} className={styles.abutton}>{Uploading ? "Uploading" : "Approve"}</button>
                          <button type="submit" disabled={Uploading} onClick={() => setStatus('Rejected')} className={styles.rbutton}>{Uploading ? "Uploading" : "Reject"}</button>
                      </form>
                  </div>
              ))}

          </div>
        </div>
    </div>
  )
};

export default Appointments;
