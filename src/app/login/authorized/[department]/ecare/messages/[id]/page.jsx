"use client"

import React, { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
import useSWR from "swr";
import Image from "next/image";

import UserDefault from "/public/UserDefault.png";

import { Reports } from "@/models/Reports";

import { useRouter } from "next/navigation";

import Dental from "public/Dental.jpg";
import Medical from "public/Medical.jpg";
import SDPC from "public/SDPC.jpg";

import Defaults from "@/models/Defaults";



const Form = ({params}) => {
    const Department = params.department;
    const RecordId = params.id;

    var SenderGoogleImage = "";
    var SenderGoogleEmail = "";
    var ReceiverGoogleImage = "";
    var ReceiverGoogleEmail = "";

    var CurrentMessageDate = "";

    const [file, setFile] = useState(null);
    const [IsViewUpdate, setIsViewUpdate] = useState(false);
    const [IsViewCreateRecord, setIsViewCreateRecord] = useState(false);

    console.log(file)

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
    
    const [ResponseUploading, setResponseUploading] = useState(false);

    const fetcher = (...args) => fetch(...args).then((res) => res.json());

    const { data, mutate, error, isLoading } = useSWR(
        `/api/messages/GET_Message?department=${encodeURIComponent(Department)}&id=${encodeURIComponent(RecordId)}`,
        fetcher
    );

    if(!isLoading) {
        SenderGoogleImage = Department === "Medical" ? Medical : Department === "Dental" ? Dental : Department === "SDPC" ? SDPC  : "";
        SenderGoogleEmail = Department === "Medical" ? Defaults.MedicalEmail : Department === "Dental" ? Defaults.DentalEmail : Department === "SDPC" ? Defaults.SDPCEmail  : "";
        ReceiverGoogleImage = data?.Type === "WalkIn" ? UserDefault : data?.GoogleImage??UserDefault;
        ReceiverGoogleEmail = data?.GoogleEmail??"?";
        console.log(data)
    }

    const sortedResponses = data?.Responses?.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA; // Descending order, change to dateA - dateB for ascending
    });


    const ResponseForm = ({name, receiverGmail, senderGmail}) => {
        return (
            <form className={styles.MessageFormContainer} onSubmit={HandleResponseSubmit} encType="multipart/form-data">
                <label className={styles.FileUploadBtn}>
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files?.[0])}
                        style={{ display: 'none' }}
                    />
                    {file === null ? "Upload File" : file.name }
                </label>
                <input name="SenderGoogleEmail" value={senderGmail} type="text" hidden readOnly/>
                <input name="ReceiverGoogleEmail" value={receiverGmail} type="text" hidden readOnly/>
                <input name="Name" value={name} type="text" hidden readOnly/>
                <textarea className={styles.responseFormTextbox} name="Response" rows="2" placeholder="Response..."/>
                <button className={styles.submitBtn} disabled={ResponseUploading}>{ResponseUploading ? "Uploading..." : "Send"}</button>
            </form>
        )    
    }

    const Response = ({image, response, timestamp, isRight, attachmentName }) => {
        const formattedDate = new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          });
        
          let shouldDisplayDate = true;
        
          if (formattedDate === CurrentMessageDate) {
            shouldDisplayDate = false;
          } else {
            CurrentMessageDate = formattedDate;
          }

        return (
            <>  
                {shouldDisplayDate && (
                    <div className={styles.responseTime}>{CurrentMessageDate}</div>
                )}
                <div className={isRight ? styles.MessageRight :  styles.MessageLeft}>
                    <Image 
                        title={formattedDate}
                        className={styles.responseImage}
                        src={image}
                        alt="image"
                        width={50}
                        height={50}
                    />
                    {response && (
                        <div title={formattedDate} className={styles.response}>
                            
                                <p>{response}</p>
                            
                        </div>
                    )}
                    {attachmentName && (
                        <a
                            href={`/uploads/messages/${encodeURIComponent(attachmentName)}`}
                            download
                            className={styles.downloadLink}
                            title={"Downloadable File"}
                        >
                            {attachmentName}
                        </a> 
                    )}
                    
                </div> 
            </>
        )
    }

    useEffect(() => {
        const handleBeforeUnload = () => {
            const formData = new FormData();
            formData.append("Department", Department);
            formData.append("RecordId", RecordId);
            formData.append("Name", Department);
    
            fetch("/api/messages/POST_UpdateViewed", {
                method: "POST",
                body: formData,
            })
            .then((response) => response.json())
            .catch((error) => console.error("Error making API call", error));
        };
    
        handleBeforeUnload();
    
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [Department, RecordId]);

    const HandleResponseSubmit = async (e) => {
        e.preventDefault();
        try {
            setResponseUploading(true);
    
            const formData = new FormData(e.target);
            formData.append("Department", Department);
            formData.append("RecordId", RecordId);
            formData.set("Attachment", file);
    
            const response = await fetch("/api/messages/POST_AddMessages", {
                method: "POST",
                body: formData,
            });
    
            if (response.ok) {
                console.log("Complete");
            } else {
                console.log("Failed");
            }
        } catch (err) {
            console.log(err);
        } finally {
            setResponseUploading(false);
            e.target.reset();
            mutate();
            setFile(null);
        }
    };

    const HandleCreateRecordSubmit = async (e) => {
        e.preventDefault();
        try {
            setResponseUploading(true);
    
            const formData = new FormData(e.target);
            formData.append("Department", Department);
            formData.append("Type", "Appointment");
            formData.append("ServiceOffered", "Direct Consultation");
            formData.append("Date", new Date().toISOString().split('T')[0]);
            formData.append("Time", "Direct");

            const response = await fetch("/api/records/POST_AddRecord", {
                method: "POST",
                body: formData,
            });
    
            if (response.ok) {
                console.log("Complete");
                alert("Record Created!");
            } else {
                console.log("Failed");
                alert("Record Failed to Create, Try Again!");
            }
        } catch (err) {
            console.log(err);
        } finally {
            setResponseUploading(false);
            e.target.reset();
            mutate();
            setFile(null);
        }
    };


    const Messages = useRef(null);

    useEffect(() => {
        const element = Messages.current;
        if (element) {
          element.scrollTop = element.scrollHeight;
        }
    }, []);

    useEffect(() => {
        const element = Messages.current;
        if (element) {
          element.scrollTop = element.scrollHeight;
        }
    }, [Messages, data, file, ResponseUploading, IsViewUpdate, IsViewCreateRecord]);

    const MainContent = () => {
        return (
            <div className={styles.MessagesContainer}>
                <div className={styles.Messages} ref={Messages}>

                {isLoading ? (
                    null
                ) : data?.Details?.Concern ? (
                    <Response 
                        image={ReceiverGoogleImage}
                        response={data?.Details?.Concern??""}
                        timestamp={data.createdAt}
                        isRight={false}
                    />
                ) : (
                    null
                )}

                {isLoading ? (
                    null
                ) : data && sortedResponses ? (
                    sortedResponses.map((response, index) => (
                        <Response 
                            key={index}
                            image={response.Name === "Dental" || response.Name === "Medical" || response.Name === "SDPC" ? SenderGoogleImage : ReceiverGoogleImage}
                            response={response.Response}
                            timestamp={response.Timestamp}
                            isRight={response.Name === "Dental" || response.Name === "Medical" || response.Name === "SDPC" ? true : false}
                            attachmentName = {response.Attachment}
                        />
                    ))
                ) : (
                    <p></p>
                )} 
            </div>
                {isLoading ? ("") : data && (data?.Status !== 'Completed' && data?.Status !== 'Canceled'  ) ? (
                    <ResponseForm 
                        name={Department} 
                        receiverGmail={ReceiverGoogleEmail} 
                        senderGmail={SenderGoogleEmail}
                    />
                ) : (
                    <div className={styles.MessageFormContainer}>
                        <div className={styles.responseStatus}>Marked as {data?.Status}</div>
                    </div>
                )}
            </div>
        ) 
    }

    const formatShortDate = (timestamp) => {
		const options = { month: 'short', day: 'numeric', year: 'numeric' };
		const formattedDate = new Date(timestamp).toLocaleDateString(undefined, options);
	  
		return `${formattedDate}`;
	};

    const Header = () => {
        return (
            <div className={styles.Header}>
                <p>Messaging - {`${data?.FullName?? ReceiverGoogleEmail}`}</p>
                {data?.Status ? (
                    <>
                        <button className={styles.Updates} onClick={()=>{IsViewUpdate ? setIsViewUpdate(false) : setIsViewUpdate(true)}}>View Updates</button>
                        <div className={`${styles.UpdateContainer} ${IsViewUpdate ? null  : styles.None}`}>
                            {data?.Sickness?.length > 0 ? (
                                data.Sickness.map((item, index) => (
                                    <div key={index} className={styles.UpdateRow}>
                                        <div className={styles.UpdateName}>{item.Name}</div>
                                        <div className={styles.UpdateDate}>{formatShortDate(item.Date)}</div>
                                    </div>
                                ))
                            ) : (
                                <div className={styles.UpdateRow}>
                                    <div className={styles.UpdateName}>No Updates</div>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <button className={styles.Updates} onClick={()=>{IsViewCreateRecord ? setIsViewCreateRecord(false) : setIsViewCreateRecord(true)}}>Create Record</button>
                        <div className={`${styles.UpdateContainer} ${IsViewCreateRecord ? null  : styles.None}`}>
                            <form onSubmit={HandleCreateRecordSubmit} method="post" className={styles.CreateRecord}>
                                <input name="GoogleEmail" value={ReceiverGoogleEmail} placeholder="Email" type="text" required className={styles.CreateRecordInput}/>
                                <textarea name="Concern" id="" cols="" rows="10" required placeholder="Concern" className={styles.CreateRecordInput}></textarea>
                                <select name="Status" id="" className={styles.CreateRecordInput} required>
                                    <option value="Advising">Mark as Advising</option>
                                    <option value="Approved">Mark as Approved</option>
                                    <option value="Completed">Mark as Completed</option>
                                </select>
                                <select name="Category" id="" className={styles.CreateRecordInput} required>
                                    <option value="Student">Student</option>
                                    <option value="Lay Collaborator">Lay Collaborator</option>
                                </select>
                                <input name="GoogleImage" value={ReceiverGoogleImage} hidden type="text" required className={styles.CreateRecordInput}/>
                                <button type="submit" className={styles.CreateRecordInput}>Create</button>
                            </form>
                        </div>
                    </>
                )}
            </div>
        )
    }

    return (
        <div className={styles.MainContent}>
            <Header/>
            {isLoading ? (
                "Loading..."
            ) : ( 
                <>
                    
                    <MainContent />    
                </>
            )}
        </div>
    );
};

export default Form;



