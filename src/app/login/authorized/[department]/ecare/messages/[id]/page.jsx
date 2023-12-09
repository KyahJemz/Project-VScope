"use client"

import React, { useState } from "react";
import styles from "./page.module.css";
import useSWR from "swr";
import Image from "next/image";

import { Reports } from "@/models/Reports";

import { useRouter } from "next/navigation";

import Dental from "public/Dental.jpg";
import Medical from "public/Medical.jpg";
import SDPC from "public/SDPC.jpg";

import Defaults from "@/models/Defaults";



const Form = ({params}) => {
    const Department = params.department;
    const RecordId = params.id;
    var GoogleImage = "";
    var GoogleEmail = {Department === "Medical" ? Defaults.MedicalEmail : Department === "Dental" ? Defaults.DentalEmail : Department === "SDPC" ? Defaults.SDPCEmail  : ""};
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

    const ResponseForm = ({record}) => {
        return (
            <form className={styles.MessageFormContainer} onSubmit={HandleResponseSubmit}>
                <input name="GoogleEmail" value={GoogleEmail} type="text" hidden readOnly/>
                <input name="ReceiverGoogleEmail" value={record.GoogleEmail} type="text" hidden readOnly/>
                <input name="Name" value={Department} type="text" hidden readOnly/>
                <textarea className={styles.responseFormTextbox} name="Response" rows="2" />
                <button className={styles.submitBtn} disabled={ResponseUploading}>{ResponseUploading ? "Uploading..." : "Send"}</button>
            </form>
        )    
    }




    const Response = ({data,response}) => {
        let ResponseDate = "";
        let MessageDate = new Date(response.Timestamp).toLocaleDateString('en-US', {
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

            <div className={
                response.Name === "Dental" ? styles.MessageRowReverse : 
                response.Name === "Medical" ? styles.MessageRowReverse :
                response.Name === "SDPC" ? styles.MessageRowReverse :
                styles.MessageRow}>

                <Image 
                    title={
                        new Date(data.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                        })
                    }
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
                
                <div
                    title={
                        new Date(data.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                        })
                    }
                className={styles.response}>{response.Response}</div>
                </div> 
            </>
        )
    }


    const MainContent = ({data}) => {

        return <div className={styles.MainContent}>
            <div className={styles.MessagesContainer}>

            {isLoading ? (
                "Loading..."
            ) : data && data?.Details ? (  
                <div className={styles.row}>    
                    <div className={styles.content}>
                        {Department === "Medical" ? (
                            <MedicalForm data={data.Details} />
                        ) : Department === "Dental" ? (
                            <DentalForm data={data.Details} />
                        ) : null}
                    </div>
                </div>

                ) : (
                null
            )}


            {isLoading ? (
                        ""
                ) : data && data.Responses ? (
                        data.Responses.map((response, index) => (
                            <Response key={index} data={data} response={response} />
                        ))
                    ) : (
                    <p></p>
                )} 

            </div>

            {isLoading ? ("") : data && (data.Status != 'Completed' && data.Status != 'Canceled'  ) ? (
                <ResponseForm data={data}/>
            ) : (
                <div className={styles.MessageFormContainer}>
                    <div className={styles.responseStatus}>Marked as {data.Status}</div>
                </div>
            )}
        </div>
    }

    const fetcher = (...args) => fetch(...args).then((res) => res.json());

    const { data, mutate, error, isLoading } = useSWR(
        `/api/messages/GET_Message?department=${encodeURIComponent(Department)}&id=${encodeURIComponent(RecordId)}`,
        fetcher
    );

    const sortedRecentData = data?.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA; // Descending order, change to dateA - dateB for ascending
    });

    if(!recentIsLoading) {
        console.log(recentData);
    }
    
    const handleBeforeUnload = () => {
        const formData = new FormData();
        formData.append('Department', Department);
        formData.append('AppointmentId', AppointmentId);
        formData.append('Name', Department);
    
        fetch('/api/messages/POST_UpdateViewed', {
          method: 'POST',
          body: formData,
        })
        .then(response => response.json())
        .then(data => console.log('API call successful', data))
        .catch(error => console.error('Error making API call', error));
    };

    const HandleResponseSubmit = async (e) => {
        e.preventDefault();
        try {
            
            setResponseUploading(true);

            const formData = new FormData(e.target);
            formData.append("Department", Department);
            formData.append("AppointmentId", AppointmentId);

            const response = await fetch("/api/messages/GET_Message", {
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

    handleBeforeUnload();

    return (
        <div className={styles.mainContainer}>

            {isLoading ? (
                "Loading..."
            ) : (
                <>
                    <MainContent data={data}/>    
                </>
            )}
        </div>
    );
};

export default Form;



