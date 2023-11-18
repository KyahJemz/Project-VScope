"use client"

import React, { useState } from "react";
import styles from "./page.module.css";
import useSWR from "swr";
import { useRouter  } from "next/navigation";

const formatDate = (timestamp) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = new Date(timestamp).toLocaleDateString(undefined, options);

  const hours = new Date(timestamp).getHours();
  const minutes = new Date(timestamp).getMinutes();
  const amOrPm = hours >= 12 ? 'pm' : 'am';
  const formattedTime = `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')}${amOrPm}`;

  return `${formattedDate} ${formattedTime}`;
};

const Consultation = ({ params }) => {
    const Department = params.department;
    const router = useRouter();


  const fetcher = (...args) => fetch(...args).then((res) => res.json());
    
  const { data, mutate, error, isLoading } =  useSWR(
      `/api/appointments?GoogleEmail=&Department=${encodeURIComponent(Department)}`,
      fetcher
  );

// taga bago ng arrangement
const sortedData = data && !isLoading
  ? [...data]
    .filter(item => item.Status !== 'Pending')
    .sort((a, b) => {
    
      const statusOrder = {
        Rejected: 3,
        Canceled: 2,
        Completed: 2,
        Approved: 1,
        Pending: 0,
      };

      if (statusOrder[a.Status] < statusOrder[b.Status]) return -1;
      if (statusOrder[a.Status] > statusOrder[b.Status]) return 1;

      // If statuses are the same, sort by createdAt in the specified order
      if (a.Status === 'Pending') {
        return a.createdAt.localeCompare(b.createdAt);
      } else if (a.Status === 'Approved') {
        return b.createdAt.localeCompare(a.createdAt);
      } else {
        // For Completed, Canceled, and Rejected, present first then to older
        return b.createdAt.localeCompare(a.createdAt);
      }
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

  function hasFalseViewedByClient(responses) {
    if (!responses || !Array.isArray(responses)) {
      return false;
    }

    return responses.some((response) => response.ViewedByDepartment === false);
  }

  return (
    <div className={styles.mainContainer}>
      <h3 className={styles.mainTitle}>Consultation</h3>

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
          <div className={styles.AppointmentsContainer}>
            {isLoading ? "Loading..." : filteredData.length === 0 ? "No results" : filteredData?.map((appointment, index) => (
              <div key={index} className={`${styles.appointmentListItem} ${styles[appointment.Status]}`}  onClick={() => (appointment.Status === 'Approved' || appointment.Status === 'Completed') ? router.push('/login/authorized/'+Department+'/consultation/'+appointment._id) : null}>
                {appointment.Status === "Approved" && hasFalseViewedByClient(appointment.Responses) ? <div className={styles.dot}></div> : null}
                <h4 className={styles.aTitle}>Name: <a className={styles.id}>{appointment.Name}</a></h4>
                <p className={styles.aDate}>{appointment.createdAt}</p>
                <h5 className={styles.aStatus}>Status: {appointment.Status}</h5>
                <p className={styles.aConsern}>{appointment.Consern}</p>
              </div>
            ))}
          </div>
        </div>
     
    </div>
  );
};

export default Consultation;
