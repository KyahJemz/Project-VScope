"use client"

import React, { useState } from "react";
import styles from "./SetAppointment.module.css";
import useSWR from "swr";
import { useRouter } from "next/navigation";

import ActionConfirmation from "@/components/ActionConfirmation/ActionConfirmation";

const SetAppointment = ({req}) => {
    const [uploading, setUploading] = useState(false);
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
  
    const fetcher = (...args) => fetch(...args).then((res) => res.json());
        
    const { data, mutate, isLoading } =  useSWR(
        `/api/appointments?GoogleEmail=${encodeURIComponent(req.session.email)}&Department=${encodeURIComponent(req.department)}`,
        fetcher
    );

    // taga bago ng arrangement
    const sortedData = data && !isLoading
  ? [...data].sort((a, b) => {
      const statusOrder = { Approved: 1, Pending: 2, Rejected: 3, Completed: 4, Canceled: 5 };

      if (a.Status !== b.Status) {
        return statusOrder[a.Status] - statusOrder[b.Status];
      }

      if (a.Status === 'Approved') {
        return b.createdAt.localeCompare(a.createdAt);
      }

      if (a.Status === 'Completed') {
        return b.createdAt.localeCompare(a.createdAt);
      }

      return 0;
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
        const Department = req.department;
        const Googleemail = req.session.email;
    
        try {
            setUploading(true);
            const formData = new FormData();
            formData.append("Name", Name);
            formData.append("Id", Id);
            formData.append("Category", Category);
            formData.append("Consern", Consern);
            formData.append("Department", Department);
            formData.append("GoogleEmail", Googleemail);

            const response = await fetch("/api/appointments", {
                method: "POST",
                body: formData,
            });
        
            
            e.target.reset();

            if (response.ok) {
                setUploading(false);
                console.log("Complete");
                mutate(); // mag refresh to
            } else {
                setUploading(false);
                console.log("Failed");
            }
        } catch (err) {
            console.log(err);
        }
    };

    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmationData, setConfirmationData] = useState({
        title: '',
        content: '',
        AppointmentId: '',
      });
  
    const handleConfirmationCancel = () => {
        setShowConfirmation(false);
    };
  
    const handleConfirmationYes = async () => {
        setShowConfirmation(false);
        try {
            const formData = new FormData();
            formData.append("Department", req.department);
            formData.append("AppointmentId", confirmationData.AppointmentId);
            formData.append("Status", 'Canceled');

            const response = await fetch("/api/appointments/POST_UpdateStatus", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                console.log(response);
                mutate(); 
            } else {
                console.log("Failed");
            }
        } catch (err) {
            console.log(err);
        }
    };

    const HandleCancelBtn = async (AppointmentId) => {
        setShowConfirmation(true);
        setConfirmationData({ title: "Cancel Confirmation", content : "Do you want to proceed with this action?", AppointmentId });
    }

    function hasFalseViewedByClient(responses) {
        if (!responses || !Array.isArray(responses)) {
          return false;
        }
    
        return responses.some((response) => response.ViewedByClient === false);
    }

    return (
        <div className={styles.mainContainer}>
            <h1 className={styles.mainTitle}>{req.department}</h1>
            <div className={styles.container}>
                <div className={styles.appointmentList}>
                    <h3 className={styles.title}>Appointments History</h3>

                    {showConfirmation && (
                        <ActionConfirmation
                            title={confirmationData.title}
                            content={confirmationData.content}
                            onYes={handleConfirmationYes}
                            onCancel={handleConfirmationCancel}
                        />
                    )}
                    
                    <div className={styles.status}>
                        <button className={`${styles.cbutton} ${filterStatus === null ? styles.call : ''}`} onClick={() => handleFilter(null)}>All</button>
                        <button className={`${styles.cbutton} ${filterStatus === 'Pending' ? styles.cpending : ''}`} onClick={() => handleFilter('Pending')}>Pending</button>
                        <button className={`${styles.cbutton} ${filterStatus === 'Approved' ? styles.capproved : ''}`} onClick={() => handleFilter('Approved')}>Approved</button>
                        <button className={`${styles.cbutton} ${filterStatus === 'Completed' ? styles.ccompleted : ''}`} onClick={() => handleFilter('Completed')}>Completed</button>
                        <button className={`${styles.cbutton} ${filterStatus === 'Canceled' ? styles.ccanceled : ''}`} onClick={() => handleFilter('Canceled')}>Canceled</button>
                        <button className={`${styles.cbutton} ${filterStatus === 'Rejected' ? styles.crejected : ''}`} onClick={() => handleFilter('Rejected')}>Rejected</button>
                    </div>
                    {isLoading ? "Loading..." : filteredData?.length && filteredData.length === 0 ? "No appointments" : filteredData.map((appointment, index) => (
                        <div key={index} className={`${styles.appointmentListItem} ${styles[appointment.Status]}`}  onClick={() => (appointment.Status === 'Approved' || appointment.Status === 'Completed') ? router.push('/login/services/'+req.department+'/appointments/'+appointment._id) : null}>
                            {appointment.Status === "Approved" && hasFalseViewedByClient(appointment.Responses) ? <div className={styles.dot}></div> : null}
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
                        <option className={styles.option} value="Student">Student</option>
                        <option className={styles.option} value="Lay Collaborator">Lay Collaborator</option>
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
};

export default SetAppointment;