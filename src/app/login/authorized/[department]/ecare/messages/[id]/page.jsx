"use client"

import React, { useState, useEffect } from "react";
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
        ReceiverGoogleImage = data?.GoogleImage??UserDefault;
        ReceiverGoogleEmail = data?.GoogleEmail??"?";
    }

    const sortedResponses = data?.Responses?.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA; // Descending order, change to dateA - dateB for ascending
    });


    const ResponseForm = ({name, receiverGmail, senderGmail}) => {
        return (
            <form className={styles.MessageFormContainer} onSubmit={HandleResponseSubmit}>
                <input name="SenderGoogleEmail" value={senderGmail} type="text" hidden readOnly/>
                <input name="ReceiverGoogleEmail" value={receiverGmail} type="text" hidden readOnly/>
                <input name="Name" value={name} type="text" hidden readOnly/>
                <textarea className={styles.responseFormTextbox} name="Response" rows="2" />
                <button className={styles.submitBtn} disabled={ResponseUploading}>{ResponseUploading ? "Uploading..." : "Send"}</button>
            </form>
        )    
    }

    const Response = ({image, response, timestamp, isRight}) => {
        let ResponseDate = "";
        let MessageDate = new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'});

            if (CurrentMessageDate === MessageDate){
                ResponseDate = "";
            } else {
                ResponseDate = CurrentMessageDate;
                CurrentMessageDate = MessageDate;
            }

        return (
            <>  
                <div className={styles.responseTime}>{ResponseDate}</div>
                <div className={isRight ? styles.MessageRight :  styles.MessageLeft}>
                    <Image 
                        title={CurrentMessageDate}
                        className={styles.responseImage}
                        src={image}
                        alt="image"
                        width={50}
                        height={50}
                    />
                    <div
                        title={CurrentMessageDate}
                        className={styles.response}>{response}
                    </div>
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
        }
    };

    const MainContent = () => {
        return (
            <div className={styles.MessagesContainer}>

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
                        />
                    ))
                ) : (
                    <p></p>
                )} 

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

    const Header = () => {
        return (
            <div className={styles.Header}>
                Messaging - {`${data?.Details?.LastName??""}, ${data?.Details?.FirstName??""} ${data?.Details?.MiddleName??""}`}
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



