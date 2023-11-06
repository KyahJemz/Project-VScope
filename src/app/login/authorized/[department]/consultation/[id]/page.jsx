"use client"

import React, { useState } from "react";
import styles from "./page.module.css";
import useSWR from "swr";
import Image from "next/image";

import Dental from "public/Dental.jpg";
import Medical from "public/Medical.jpg";
import SDPC from "public/SDPC.jpg";

import ActionConfirmation from "@/components/ActionConfirmation/ActionConfirmation";


const Form = ({params}) => {
    const Department = params.department;
    const AppointmentId = params.id;
    var GoogleImage = "";
    var GoogleEmail = "";

    const [DetailsUploading, setDetailsUploading] = useState(false);
    const [ResponseUploading, setResponseUploading] = useState(false);
    
    const [StatusUploading, setStatusUploading] = useState(false);

    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmationData, setConfirmationData] = useState({
        title: '',
        content: '',
        status: '',
      });

    const handleButtonAction = (title, content, status) => {
        setShowConfirmation(true);
        setConfirmationData({ title, content, status});
    };

    const handleConfirmationYes = () => {
        HandleStatusUpdate(confirmationData.status);
        setShowConfirmation(false);
    };

    const handleConfirmationCancel = () => {
        setShowConfirmation(false);
    };




    const DentalForm = ({data}) => {
        return (
            <form className={styles.form} onSubmit={HandleUpdateSubmit}>
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

                <div className={styles.formRow}>
                    <div className={styles.inputContainer}>
                        <p className={styles.label}>Date:</p>
                        <input name="dDate" value={data.dDate} className={styles.input} type="date" />
                    </div>
                    <div className={styles.inputContainer}>
                        <p className={styles.label}>Tooth:</p>
                        <input name="dTooth" value={data.dTooth} className={styles.input} type="text" />
                    </div>
                    <div className={styles.inputContainer}>
                        <p className={styles.label}>Service Offered:</p>
                        <input name="dServiceOffered" value={data.dServiceOffered} className={styles.input} type="text" />
                    </div>
                    <div className={styles.inputContainer}>
                        <p className={styles.label}>unknown:</p>
                        <input name="unknown" value={data.unknown} className={styles.input} type="text" />
                    </div>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.textareaContainer}>
                    <p className={styles.label}>Concern:</p>
                        <textarea name="concern" value={data.Concern} className={`${styles.readinput} ${styles.textarea}`} type="text" cols='50' rows='5' readOnly/>
                    </div>
                </div>

                <div className={styles.formRow}>
                    {data.dDate ? null : DetailsUploading ? 
                        <button className={styles.submitBtn} disabled>Uploading...</button>
                        :
                        <button className={styles.submitBtn}>Final Update Details</button>
                    } 
                </div> 

            </form>
        )
    }

    const MedicalForm = ({data}) => {
        return (
            <form className={styles.form} onSubmit={HandleUpdateSubmit}>
                <div className={styles.formRow}>
                    <p className={styles.formTitle}>Medical Details</p>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.inputContainerMax}>
                        <p className={styles.label}>Full Name:</p>
                        <input value={data.FullName} name="fullname" className={`${styles.readinput} ${styles.fullInput}`} type="text" required/>
                    </div>
                    <div className={styles.inputContainer}>
                        <p className={styles.label}>Department/Course/Year:</p>
                        <input name="departmentcourseyear" value={data.DepartmentCourseYear} className={styles.readinput} type="text" required/>
                    </div>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.inputContainerMax}>
                        <p className={styles.label}>Address:</p>
                        <input name="address" value={data.Address} className={`${styles.readinput} ${styles.fullInput}`} type="text" required/>
                    </div>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.inputContainerMax}>
                        <p className={styles.label}>Contact No.:</p>
                        <input name="contactnumber" value={data.ContactNo} className={`${styles.readinput} ${styles.fullInput}`} type="text" required/>
                    </div>
                    <div className={styles.inputContainerMax}>
                        <p className={styles.label}>Civil Status:</p>
                        <input name="civilstatus" value={data.CivilStatus} className={`${styles.readinput} ${styles.fullInput}`} type="text" required/>
                    </div>
                    <div className={styles.inputContainer}>
                        <p className={styles.label}>Age:</p>
                        <input name="age" value={data.Age} className={`${styles.readinput} ${styles.smallInput}`} type="text" required/>
                    </div>
                    <div className={styles.inputContainer}>
                        <p className={styles.label}>Sex:</p>
                        <select name="sex" value={data.Sex} className={`${styles.readinput} ${styles.smallInput}`} type="text" required>
                            <option value=""></option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.inputContainerMax}>
                        <p className={styles.label}>Emergency Contact Person:</p>
                        <input name="emergency" value={data.EmergencyName} className={`${styles.readinput} ${styles.fullInput}`} type="text" required/>
                    </div>
                    <div className={styles.inputContainer}>
                        <p className={styles.label}>Contact No.:</p>
                        <input name="emergencynumber" value={data.EmergencyContactNo} className={styles.readinput} type="text" required/>
                    </div>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.textareaContainer}>
                        <p className={styles.label}>Concern:</p>
                        <textarea name="concern" value={data.Concern} className={`${styles.readinput} ${styles.textarea}`} type="text" cols='50' rows='5' required/>
                    </div>
                </div> 
                {Department === "Dental" ? 
                    <div className={styles.formRow}>
                        {DetailsUploading ? 
                            <button className={styles.submitBtn} disabled>Uploading...</button>
                            :
                            <button className={styles.submitBtn}>Update Details</button>
                        } 
                    </div> 
                : null }
            </form>
        )
    }

    const ResponseForm = ({data}) => {
        return (
            <form className={styles.responseFormContainer} onSubmit={HandleResponseSubmit}>
                <p>Your response/concern:</p>
                <input name="GoogleEmail" value={GoogleEmail} type="text" hidden readOnly/>
                <input name="Name" value={Department} type="text" hidden readOnly/>
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
                    response.Name === "Dental" ? styles.responseHeaderReverse : 
                    response.Name === "Medical" ? styles.responseHeaderReverse :
                    response.Name === "SDPC" ? styles.responseHeaderReverse :
                    styles.responseHeader
                }>
                    <Image 
                        className={styles.responseImage}
                        src={
                            response.Name === "Dental" ? Dental : 
                            response.Name === "Medical" ? Medical :
                            response.Name === "SDPC" ? SDPC :
                            data.GoogleImage
                        }
                        alt=""
                        width={50}
                        height={50}
                    />
                    <div className={
                        response.Name === "Dental" ? styles.responseDataReverse : 
                        response.Name === "Medical" ? styles.responseDataReverse :
                        response.Name === "SDPC" ? styles.responseDataReverse :
                        styles.responseData
                        }>
                        <p className={styles.responseName}>{response.Name}</p>
                        <p className={styles.responseEmail}>{response.GoogleEmail}</p>
                    </div>
                </div>
                <div className={
                     response.Name === "Dental" ? styles.responseresponseReverse : 
                     response.Name === "Medical" ? styles.responseresponseReverse :
                     response.Name === "SDPC" ? styles.responseresponseReverse :
                    styles.responseresponse}>{response.Response}</div>
            </div>
        )
    }

    const fetcher = (...args) => fetch(...args).then((res) => res.json());

    const { data, mutate, error, isLoading } = useSWR(
        `/api/appointments/GET_Details?department=${encodeURIComponent(Department)}&id=${encodeURIComponent(AppointmentId)}`,
        fetcher
    );

    const handleBeforeUnload = () => {
        const formData = new FormData();
        formData.append('Department', Department);
        formData.append('AppointmentId', AppointmentId);
        formData.append('Name', Department);
    
        fetch('/api/appointments/POST_UpdateViewed', {
          method: 'POST',
          body: formData,
        })
        .then(response => response.json())
        .then(data => console.log('API call successful', data))
        .catch(error => console.error('Error making API call', error));
    };

    const HandleUpdateSubmit = async (e) => {
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

    const HandleStatusUpdate = async (Status) => {
        try {
            setStatusUploading(true);
          const formData = new FormData();
          formData.append("Department", Department);
          formData.append("AppointmentId", AppointmentId);
          formData.append("Status", Status);
    
          const response = await fetch("/api/appointments/POST_UpdateStatus", {
            method: "POST",
            body: formData,
          });
    
          setStatusUploading(false);
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

    handleBeforeUnload();

    return (
        <div className={styles.mainContainer}>
            <div className={styles.vLine}></div>

        {showConfirmation && (
            <ActionConfirmation
                title={confirmationData.title}
                content={confirmationData.content}
                onYes={handleConfirmationYes}
                onCancel={handleConfirmationCancel}
            />
        )}

        {isLoading ? null : data.Status === "Completed" || data.Status === "Canceled" ? null : StatusUploading ? (
                <div className={styles.statusUpdate}>
                <button disabled className={`${styles.btnSU} ${styles.maCompleted}`}>
                    Loading..
                </button>
                <button disabled className={`${styles.btnSU} ${styles.maCanceled}`}>
                    Loading..
                </button>
                </div>
            ) : (
                <div className={styles.statusUpdate}>
                <button className={`${styles.btnSU} ${styles.maCompleted}`} onClick={() => handleButtonAction('Mark as Completed?',"Do you want to proceed with this action?","Completed")}>
                    Mark as Completed
                </button>
                <button className={`${styles.btnSU} ${styles.maCanceled}`} onClick={() => handleButtonAction('Mark as Canceled?',"Do you want to proceed with this action?","Canceled")}>
                    Mark as Canceled
                </button>
                </div>
            )
        }
            
            {isLoading ? (
                "Loading..."
            ) : data && data?.Details ? (  
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
                            <MedicalForm data={data.Details} />
                        ) : Department === "Dental" ? (
                            <DentalForm data={data.Details} />
                        ) : null};
                    </div>
                </div>

                ) : (
                null
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



