"use client"

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import { notFound } from "next/navigation";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import Image from "next/image";
import Dental from "public/Dental.jpg";
import Medical from "public/Medical.jpg";
import SDPC from "public/SDPC.jpg";

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

const Form = ({params}) => {
    const { data: session, status } = useSession();
    const Department = params.department;
    const AppointmentId = params.id;
    var GoogleImage = "";

    if (status === 'authenticated'){
        GoogleImage = session.user.image;
    } 
    
    const fetcher = (...args) => fetch(...args).then((res) => res.json());

    const [DetailsUploading, setDetailsUploading] = useState(false);
    const [ResponseUploading, setResponseUploading] = useState(false);

    const DentalRegistrationForm = () => {
        return (
            <form className={styles.form} onSubmit={HandleDetailsSubmit}>
                <div className={styles.formRow}>
                    <p className={styles.formTitle}>Dental Form</p>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.inputContainerMax}>
                        <p className={styles.label}>Name:</p>
                        <input name="firstname" className={`${styles.input} ${styles.fullInput}`} placeholder="First name" type="text" required/>
                        <input name="middlename" className={`${styles.input} ${styles.fullInput}`} placeholder="Middle name" type="text" required/>
                        <input name="lastname" className={`${styles.input} ${styles.fullInput}`} placeholder="Last name" type="text" required/>
                    </div>
                    <div className={styles.inputContainer}>
                        <p className={styles.label}>Civil Status:</p>
                        <input name="civilstatus" className={`${styles.input} ${styles.smallInput}`} type="text" required/>
                    </div>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.inputContainerMax}>
                        <p className={styles.label}>Address:</p>
                        <input name="address" className={`${styles.input} ${styles.fullInput}`} type="text" required/>
                    </div>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.inputContainerMax}>
                        <p className={styles.label}>Course:</p>
                        <input name="course" className={`${styles.input} ${styles.fullInput}`} type="text" required/>
                    </div>
                    <div className={styles.inputContainerMax}>
                        <p className={styles.label}>Year:</p>
                        <input name="year" className={`${styles.input} ${styles.fullInput}`} type="text" required/>
                    </div>
                    <div className={styles.inputContainerMax}>
                        <p className={styles.label}>Section:</p>
                        <input name="section" className={`${styles.input} ${styles.fullInput}`} type="text" required/>
                    </div>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.inputContainer}>
                        <p className={styles.label}>Age:</p>
                        <input name="age" className={`${styles.input} ${styles.smallInput}`} type="text" required/>
                    </div>
                    <div className={styles.inputContainerMax}>
                        <p className={styles.label}>Date of Birth:</p>
                        <input name="dateofbirth" className={`${styles.input} ${styles.fullInput}`} type="date" required/>
                    </div>
                    <div className={styles.inputContainerMax}>
                        <p className={styles.label}>Religion:</p>
                        <input name="religion" className={`${styles.input} ${styles.fullInput}`} type="text" required/>
                    </div>
                    <div className={styles.inputContainerMax}>
                        <p className={styles.label}>Contact No:</p>
                        <input name="contactno" className={`${styles.input} ${styles.fullInput}`} type="text" required/>
                    </div>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.inputContainerMax}>
                        <p className={styles.label}>Spouse Name:</p>
                        <input name="spousename" className={`${styles.input} ${styles.fullInput}`} type="text"/>
                    </div>
                    <div className={styles.inputContainer}>
                        <p className={styles.label}>Sex:</p>
                        <select name="sex" className={styles.input} type="text" required>
                        <option value=""></option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        </select>
                    </div>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.inputContainerMax}>
                        <p className={styles.label}>Mothers Name:</p>
                        <input name="mothersname" className={`${styles.input} ${styles.fullInput}`} type="text" required/>
                    </div>
                    <div className={styles.inputContainerMax}>
                        <p className={styles.label}>Fathers Name:</p>
                        <input name="fathersname" className={`${styles.input} ${styles.fullInput}`} type="text" required/>
                    </div>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.inputContainerMax}>
                        <p className={styles.label}>Person to notify incase of emergency:</p>
                        <input name="emergency" className={`${styles.input} ${styles.fullInput}`} type="text" required/>
                    </div>
                    <div className={styles.inputContainer}>
                        <p className={styles.label}>Contact No:</p>
                        <input name="emergencynumber" className={styles.input} type="text" required/>
                    </div>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.inputContainer}>
                        <p className={styles.label}>Date:</p>
                        <input className={styles.input} type="date" readOnly disabled/>
                    </div>
                    <div className={styles.inputContainer}>
                        <p className={styles.label}>Tooth:</p>
                        <input className={styles.input} type="text" readOnly disabled/>
                    </div>
                    <div className={styles.inputContainer}>
                        <p className={styles.label}>Service Offered:</p>
                        <input className={styles.input} type="text" readOnly disabled/>
                    </div>
                    <div className={styles.inputContainer}>
                        <p className={styles.label}>Service Offered:</p>
                        <input className={styles.input} type="text" readOnly disabled/>
                    </div>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.textareaContainer}>
                    <p className={styles.label}>Concern:</p>
                        <textarea name="concern" className={`${styles.input} ${styles.textarea}`} type="text" cols='50' rows='5' required/>
                    </div>
                </div>

                <div className={styles.formRow}>
                    {DetailsUploading ? 
                        <button className={styles.submitBtn} disabled>Uploading...</button>
                        :
                        <button className={styles.submitBtn}>Save Details</button>
                    } 
                </div>

            </form>
        )
    }

    const DentalForm = ({data}) => {
        return (
            <form className={styles.form} onSubmit={HandleDetailsSubmit}>
                <div className={styles.formRow}>
                    <p className={styles.formTitle}>Dental Details</p>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.inputContainerMax}>
                        <p className={styles.label}>Name:</p>
                        <input name="firstname" value={data.FirstName} className={`${styles.readinput} ${styles.fullInput}`} type="text" readOnly/>
                        <input name="middlename" value={data.MiddleName} className={`${styles.readinput} ${styles.fullInput}`} type="text" readOnly/>
                        <input name="lastname" value={data.LastName} className={`${styles.readinput} ${styles.fullInput}`} type="text" readOnly/>
                    </div>
                    <div className={styles.inputContainer}>
                        <p className={styles.label}>Civil Status:</p>
                        <input name="civilstatus" value={data.CivilStatus} className={`${styles.readinput} ${styles.smallInput}`} type="text" readOnly/>
                    </div>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.inputContainerMax}>
                        <p className={styles.label}>Address:</p>
                        <input name="address" value={data.Address} className={`${styles.readinput} ${styles.fullInput}`} type="text" readOnly/>
                    </div>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.inputContainerMax}>
                        <p className={styles.label}>Course:</p>
                        <input name="course" value={data.Course} className={`${styles.readinput} ${styles.fullInput}`} type="text" readOnly/>
                    </div>
                    <div className={styles.inputContainerMax}>
                        <p className={styles.label}>Year:</p>
                        <input name="year" value={data.Year} className={`${styles.readinput} ${styles.fullInput}`} type="text" readOnly/>
                    </div>
                    <div className={styles.inputContainerMax}>
                        <p className={styles.label}>Section:</p>
                        <input name="section" value={data.Section} className={`${styles.readinput} ${styles.fullInput}`} type="text" readOnly/>
                    </div>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.inputContainer}>
                        <p className={styles.label}>Age:</p>
                        <input name="age" value={data.Age} className={`${styles.readinput} ${styles.smallInput}`} type="text" readOnly/>
                    </div>
                    <div className={styles.inputContainerMax}>
                        <p className={styles.label}>Date of Birth:</p>
                        <input name="dateofbirth" value={data.DateofBirth} className={`${styles.readinput} ${styles.fullInput}`} type="date" readOnly/>
                    </div>
                    <div className={styles.inputContainerMax}>
                        <p className={styles.label}>Religion:</p>
                        <input name="religion" value={data.Religion} className={`${styles.readinput} ${styles.fullInput}`} type="text" readOnly/>
                    </div>
                    <div className={styles.inputContainerMax}>
                        <p className={styles.label}>Contact No:</p>
                        <input name="contactno" value={data.ContactNo} className={`${styles.readinput} ${styles.fullInput}`} type="text" readOnly/>
                    </div>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.inputContainerMax}>
                        <p className={styles.label}>Spouse Name:</p>
                        <input name="spousename" value={data.SpouseName} className={`${styles.readinput} ${styles.fullInput}`} type="text" readOnly/>
                    </div>
                    <div className={styles.inputContainer}>
                        <p className={styles.label}>Sex:</p>
                        <select name="sex" value={data.Sex} className={styles.readinput} type="text" readOnly>
                        <option value=""></option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        </select>
                    </div>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.inputContainerMax}>
                        <p className={styles.label}>Mothers Name:</p>
                        <input name="mothersname" value={data.MothersName} className={`${styles.readinput} ${styles.fullInput}`} type="text" readOnly/>
                    </div>
                    <div className={styles.inputContainerMax}>
                        <p className={styles.label}>Fathers Name:</p>
                        <input name="fathersname" value={data.FathersName} className={`${styles.readinput} ${styles.fullInput}`} type="text" readOnly/>
                    </div>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.inputContainerMax}>
                        <p className={styles.label}>Person to notify incase of emergency:</p>
                        <input name="emergency" value={data.EmergencyName} className={`${styles.readinput} ${styles.fullInput}`} type="text" readOnly/>
                    </div>
                    <div className={styles.inputContainer}>
                        <p className={styles.label}>Contact No:</p>
                        <input name="emergencynumber" value={data.EmergencyContactNo} className={styles.readinput} type="text" readOnly/>
                    </div>
                </div>

                {data?.dDate ? 
                    <div className={styles.formRow}>
                        <div className={styles.inputContainer}>
                            <p className={styles.label}>Date:</p>
                            <input value={data.dDate} className={styles.readinput} type="date" readOnly/>
                        </div>
                        <div className={styles.inputContainer}>
                            <p className={styles.label}>Tooth:</p>
                            <input value={data.dTooth} className={styles.readinput} type="text" readOnly/>
                        </div>
                        <div className={styles.inputContainer}>
                            <p className={styles.label}>Service Offered:</p>
                            <input value={data.dServiceOffered} className={styles.readinput} type="text" readOnly/>
                        </div>
                        <div className={styles.inputContainer}>
                            <p className={styles.label}>unknown:</p>
                            <input value={data.unknown} className={styles.readinput} type="text" readOnly/>
                        </div>
                    </div>
                : ""}

                <div className={styles.formRow}>
                    <div className={styles.textareaContainer}>
                    <p className={styles.label}>Concern:</p>
                        <textarea name="concern" value={data.Concern} className={`${styles.readinput} ${styles.textarea}`} type="text" cols='50' rows='5' required/>
                    </div>
                </div>

            </form>
        )
    }

    const MedicalRegistrationForm = () => {
        return (
            <form className={styles.form} onSubmit={HandleDetailsSubmit}>
                <div className={styles.formRow}>
                    <p className={styles.formTitle}>Medical Form</p>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.inputContainerMax}>
                        <p className={styles.label}>Full Name:</p>
                        <input name="fullname" className={`${styles.input} ${styles.fullInput}`} type="text" required/>
                    </div>
                    <div className={styles.inputContainer}>
                        <p className={styles.label}>Department/Course/Year:</p>
                        <input name="departmentcourseyear" className={styles.input} type="text" required/>
                    </div>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.inputContainerMax}>
                        <p className={styles.label}>Address:</p>
                        <input name="address" className={`${styles.input} ${styles.fullInput}`} type="text" required/>
                    </div>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.inputContainerMax}>
                        <p className={styles.label}>Contact No.:</p>
                        <input name="contactnumber" className={`${styles.input} ${styles.fullInput}`} type="text" required/>
                    </div>
                    <div className={styles.inputContainerMax}>
                        <p className={styles.label}>Civil Status:</p>
                        <input name="civilstatus" className={`${styles.input} ${styles.fullInput}`} type="text" required/>
                    </div>
                    <div className={styles.inputContainer}>
                        <p className={styles.label}>Age:</p>
                        <input name="age" className={`${styles.input} ${styles.smallInput}`} type="text" required/>
                    </div>
                    <div className={styles.inputContainer}>
                        <p className={styles.label}>Sex:</p>
                        <select name="sex" className={`${styles.input} ${styles.smallInput}`} type="text" required>
                            <option value=""></option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.inputContainerMax}>
                        <p className={styles.label}>Emergency Contact Person:</p>
                        <input name="emergency" className={`${styles.input} ${styles.fullInput}`} type="text" required/>
                    </div>
                    <div className={styles.inputContainer}>
                        <p className={styles.label}>Contact No.:</p>
                        <input name="emergencynumber" className={styles.input} type="text" required/>
                    </div>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.textareaContainer}>
                        <p className={styles.label}>Concern:</p>
                        <textarea name="concern" className={`${styles.input} ${styles.textarea}`} type="text" cols='50' rows='5' required/>
                    </div>
                </div> 

                <div className={styles.formRow}>
                    {DetailsUploading ? 
                        <button className={styles.submitBtn} disabled>Uploading...</button>
                        :
                        <button className={styles.submitBtn}>Save Details</button>
                    } 
                </div> 
            </form>
        )
    }

    const MedicalForm = ({data}) => {
        return (
            <form className={styles.form} onSubmit={HandleDetailsSubmit}>
                <div className={styles.formRow}>
                    <p className={styles.formTitle}>Medical Details</p>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.inputContainerMax}>
                        <p className={styles.label}>Full Name:</p>
                        <input value={data.FullName} name="fullname" className={`${styles.readinput} ${styles.fullInput}`} type="text" readOnly/>
                    </div>
                    <div className={styles.inputContainer}>
                        <p className={styles.label}>Department/Course/Year:</p>
                        <input name="departmentcourseyear" value={data.DepartmentCourseYear} className={styles.readinput} type="text" readOnly/>
                    </div>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.inputContainerMax}>
                        <p className={styles.label}>Address:</p>
                        <input name="address" value={data.Address} className={`${styles.readinput} ${styles.fullInput}`} type="text" readOnly/>
                    </div>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.inputContainerMax}>
                        <p className={styles.label}>Contact No.:</p>
                        <input name="contactnumber" value={data.ContactNo} className={`${styles.readinput} ${styles.fullInput}`} type="text" readOnly/>
                    </div>
                    <div className={styles.inputContainerMax}>
                        <p className={styles.label}>Civil Status:</p>
                        <input name="civilstatus" value={data.CivilStatus} className={`${styles.readinput} ${styles.fullInput}`} type="text" readOnly/>
                    </div>
                    <div className={styles.inputContainer}>
                        <p className={styles.label}>Age:</p>
                        <input name="age" value={data.Age} className={`${styles.readinput} ${styles.smallInput}`} type="text" readOnly/>
                    </div>
                    <div className={styles.inputContainer}>
                        <p className={styles.label}>Sex:</p>
                        <select name="sex" value={data.Sex} className={`${styles.readinput} ${styles.smallInput}`} type="text" readOnly>
                            <option value=""></option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.inputContainerMax}>
                        <p className={styles.label}>Emergency Contact Person:</p>
                        <input name="emergency" value={data.EmergencyName} className={`${styles.readinput} ${styles.fullInput}`} type="text" readOnly/>
                    </div>
                    <div className={styles.inputContainer}>
                        <p className={styles.label}>Contact No.:</p>
                        <input name="emergencynumber" value={data.EmergencyContactNo} className={styles.readinput} type="text" readOnly/>
                    </div>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.textareaContainer}>
                        <p className={styles.label}>Concern:</p>
                        <textarea name="concern" value={data.Concern} className={`${styles.readinput} ${styles.textarea}`} type="text" cols='50' rows='5' readOnly/>
                    </div>
                </div> 

                <div className={styles.formRow}>
                    {DetailsUploading ? 
                        <button className={styles.submitBtn} disabled>Uploading...</button>
                        :
                        <button className={styles.submitBtn}>Save Details</button>
                    } 
                </div> 
            </form>
        )
    }

    const ResponseForm = ({data}) => {
        return (
            <form className={styles.responseFormContainer} onSubmit={HandleResponseSubmit}>
                <p>Your response/concern:</p>
                <input name="GoogleEmail" value={data.GoogleEmail} type="text" hidden readOnly/>
                <input name="Name" value={data.Name} type="text" hidden readOnly/>
                <textarea className={styles.responseFormTextbox} name="Response" rows="3" />
                {ResponseUploading ? 
                    <button className={styles.submitBtn} disabled>Uploading...</button>
                :
                    <button className={styles.submitBtn}>Send</button>
                }
            </form>
        )    
    }

    const Response = ({data,response}) => {
        return (
            <div className={styles.responseContainer}>
                <div className={
                    response.Name === "Dental" ? styles.responseHeader : 
                    response.Name === "Medical" ? styles.responseHeader :
                    response.Name === "SDPC" ? styles.responseHeader :
                    styles.responseHeaderReverse
                }>
                    <Image 
                        className={styles.responseImage}
                        src={
                            response.Name === "Dental" ? Dental : 
                            response.Name === "Medical" ? Medical :
                            response.Name === "SDPC" ? SDPC :
                            GoogleImage
                        }
                        alt=""
                        width={50}
                        height={50}
                    />
                    <div className={
                        response.Name === "Dental" ? styles.responseData : 
                        response.Name === "Medical" ? styles.responseData :
                        response.Name === "SDPC" ? styles.responseData :
                        styles.responseDataReverse
                        }>
                        <p className={styles.responseName}>{response.Name}</p>
                        <p className={styles.responseEmail}>{response.GoogleEmail}</p>
                    </div>
                </div>
                <div className={
                     response.Name === "Dental" ? styles.responseresponse : 
                     response.Name === "Medical" ? styles.responseresponse :
                     response.Name === "SDPC" ? styles.responseresponse :
                    styles.responseresponseReverse}>{response.Response}</div>
            </div>
        )
    }

    const { data, mutate, error, isLoading } = useSWR(
        `/api/appointments/GET_Details?department=${encodeURIComponent(Department)}&id=${encodeURIComponent(AppointmentId)}`,
        fetcher
    );

    const HandleDetailsSubmit = async (e) => {
        e.preventDefault();
        try {
            setDetailsUploading(true);
            
            const formData = new FormData(e.target); 
            formData.append("Department", Department);
            formData.append("AppointmentId", AppointmentId);

            const response = await fetch("/api/appointments/POST_Details", {
                method: "POST",
                body: formData,
            });
        
            setDetailsUploading(false);
           
            if (response.ok) {
                e.target.reset();
                console.log("Complete");
                mutate(); 
            } else {
                console.log("Failed");
            }
        } catch (err) {
            console.log(err);
        }
    }

    const HandleResponseSubmit = async (e) => {
        e.preventDefault();
        try {
            
            setResponseUploading(true);

            const formData = new FormData(e.target);
            formData.append("Department", Department);
            formData.append("AppointmentId", AppointmentId);

            const response = await fetch("/api/appointments/POST_AddResponse", {
                method: "POST",
                body: formData,
            });
        
            setResponseUploading(false);
            

            if (response.ok) {
                console.log("Complete");
                mutate(); // mag refresh to.
                e.target.reset();
            } else {
                console.log("Failed");
            }
        } catch (err) {
            console.log(err);
        }
    }

    const handleBeforeUnload = () => {
        const formData = new FormData();
        formData.append('Department', Department);
        formData.append('AppointmentId', AppointmentId);
        formData.append('Name', data.Name);
    
        fetch('/api/appointments/POST_UpdateViewed', {
          method: 'POST',
          body: formData,
        })
        .then(response => response.json())
        .then(data => console.log('API call successful', data))
        .catch(error => console.error('Error making API call', error));
    };

    if (!isLoading) {
        handleBeforeUnload();
    }
    

    return (
        <div className={styles.mainContainer}>
            <div className={styles.vLine}></div>

            {isLoading ? (
                "Loading..."
            ) : Department != 'SDPC' ? (  
                <div className={styles.row}>
                    <div className={styles.mark}>
                        <div className={styles.datetime}>
                            <div className={styles.date}>
                                {new Date(data.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                            <div className={styles.time}>
                                {new Date(data.createdAt).toLocaleTimeString('en-US', {
                                    hour: 'numeric',
                                    minute: '2-digit'
                                })}
                            </div>
                        </div>
                        <div className={styles.hLine}></div>
                    </div>
                    <div className={styles.content}>
                        {Department === "Medical" ? (
                            data?.Details ? (
                                <MedicalForm data={data.Details} />
                            ) : (
                                <MedicalRegistrationForm />
                            )
                        ) : Department === "Dental" ? (
                                data?.Details ? (
                                <DentalForm data={data.Details} />
                            ) : (
                                <DentalRegistrationForm />
                            )
                        ) : null}
                    </div>
                </div>

                ) : (
                <p></p>
            )}

            {isLoading ? "Loading..." : (
                <div className={styles.row}>
                    <div className={styles.mark}>
                        <div className={styles.datetime}>
                            <div className={styles.date}>
                                {new Date(data.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                            <div className={styles.time}>
                                {new Date(data.createdAt).toLocaleTimeString('en-US', {
                                    hour: 'numeric',
                                    minute: '2-digit'
                                })}
                            </div>
                        </div>
                        <div className={styles.hLine}></div>
                    </div>
                    <div className={styles.content}>
                        <div className={styles.responseContainer}>
                            <div className={styles.responseHeaderReverse}>
                                <Image 
                                    className={styles.responseImage}
                                    src={data.GoogleImage}
                                    alt=""
                                    width={50}
                                    height={50}
                                />
                                <div className={styles.responseDataReverse}>
                                    <p className={styles.responseName}>{data.Name}</p>
                                    <p className={styles.responseEmail}>{data.GoogleEmail}</p>
                                </div>
                            </div>
                            <div className={styles.responseresponseReverse}>{data.Consern}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        
            {isLoading ? (
                ""
            ) : data && data.Responses ? (
                    data.Responses.map((response, index) => (
                        <div key={index} className={styles.row}>
                            <div className={styles.mark}>
                                <div className={styles.datetime}>
                                    <div className={styles.date}>
                                        {new Date(response.Timestamp).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                    <div className={styles.time}>
                                        {new Date(response.Timestamp).toLocaleTimeString('en-US', {
                                            hour: 'numeric',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </div>
                                <div className={styles.hLine}></div>
                            </div>
                            <div className={styles.content}>
                                <Response data={data} response={response} />
                            </div>
                        </div>
                    ))
                ) : (
                <p></p>
            )}

            {isLoading ? ("") : data && (data.Status != 'Completed' && data.Status != 'Canceled'  ) ? (
                <div className={styles.row}> 
                    <div className={styles.mark}>
                        <div className={styles.datetime}>
                            <div className={styles.date}>Create a response</div>
                            <div className={styles.time}>-</div>
                        </div>
                        <div className={styles.hLine}></div>
                    </div>
                    <div className={styles.content}>
                        <ResponseForm data={data} />
                    </div>
                </div>
            ) : (
                <div className={styles.row}> 
                    <div className={styles.mark}>
                        <div className={styles.datetime}>
                            <div className={styles.date}>
                                {new Date(data.updatedAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                            <div className={styles.time}>
                                {new Date(data.updatedAt).toLocaleTimeString('en-US', {
                                    hour: 'numeric',
                                    minute: '2-digit'
                                })}
                            </div>
                        </div>
                        <div className={styles.hLine}></div>
                    </div>
                    <div className={styles.content}>
                        <div className={styles.responseresponse}> Marked as {data.Status}</div>
                    </div>
                </div>
                )
            }

        </div>
    );
};

export default Form;



