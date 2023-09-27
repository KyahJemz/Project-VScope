import React from "react";
import styles from "./page.module.css";
import Link from "next/link";

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
  // Accept
  // Reject

  // admin view Rejects 
  // admin view Accepted


  return (
    <div className={styles.mainContainer}>
        <h1>{Department}</h1>
        <div className={styles.appointmentList}>
          <h3 className={styles.title}>Appointments</h3>
          <div className={styles.AppointmetsContainer}>

              <div className={styles.AppointmentsItem}>

              <div className={styles.details}>
                      <p className={styles.stats}>Status</p>
                      <p className={styles.date}>createdAt</p>
                  </div>
                  
                  <p className={styles.name}>Name</p>
                  <p className={styles.id}>Id</p>
                  <p className={styles.email}>Email</p>
                  <p className={styles.category}>Category</p>
                  <p className={styles.consern}>Consern</p>

                  
                  <div className={styles.actions}>
                      <input 
                        className={styles.input}
                        type="text" 
                        placeholder="Response"
                      />
                      <button className={styles.abutton}>Approve</button>{/*responce also*/}
                      <button className={styles.rbutton}>Reject</button>
                  </div>
              </div>

              <div className={styles.AppointmentsItem}>
                  <p className={styles.name}>Name</p>
                  <p className={styles.id}>Id</p>
                  <p className={styles.email}>Email</p>
                  <p className={styles.category}>Category</p>
                  <p className={styles.consern}>Consern</p>

                  <div className={styles.details}>
                      <p className={styles.stats}>Status</p>
                      <p className={styles.date}>createdAt</p>
                  </div>
                  <div className={styles.actions}>
                      <input 
                        className={styles.input}
                        type="text" 
                        placeholder="Response"
                      />
                      <button className={styles.abutton}>Approve</button>{/*responce also*/}
                      <button className={styles.rbutton}>Reject</button>
                  </div>
              </div>

              <div className={styles.AppointmentsItem}>
                  <p className={styles.name}>Name</p>
                  <p className={styles.id}>Id</p>
                  <p className={styles.email}>Email</p>
                  <p className={styles.category}>Category</p>
                  <p className={styles.consern}>Consern</p>

                  <div className={styles.details}>
                      <p className={styles.stats}>Status</p>
                      <p className={styles.date}>createdAt</p>
                  </div>
                  <div className={styles.actions}>
                      <input 
                        className={styles.input}
                        type="text" 
                        placeholder="Response"
                      />
                      <button className={styles.abutton}>Approve</button>{/*responce also*/}
                      <button className={styles.rbutton}>Reject</button>
                  </div>
              </div>

          </div>
        </div>
    </div>
  )
};

export default Appointments;
