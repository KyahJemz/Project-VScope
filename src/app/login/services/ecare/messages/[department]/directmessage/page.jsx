"use client"

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import useSWR from "swr";
import Image from "next/image";
import UserDefault from "/public/UserDefault.png";
import { useRouter } from "next/navigation";
import Dental from "public/Dental.jpg";
import Medical from "public/Medical.jpg";
import { Data } from "@/models/Data";
import SDPC from "public/SDPC.jpg";
import { useSession } from "next-auth/react";

import Defaults from "@/models/Defaults";


const Form = ({params}) => {
    const Department = params.department;
    const { data: session, status } = useSession();
	const [GoogleEmail, setGoogleEmail] = useState("");
    const [GoogleImage, setGoogleImage] = useState("");
    const [GoogleName, setGoogleName] = useState("");

    useEffect(() => {
        if (status === "authenticated" && session?.user?.email) {
          setGoogleEmail(session.user.email);
          setGoogleImage(session.user.image);
          setGoogleName(session.user.name);
          const formData = new FormData();
            formData.append("Department", Department);
            formData.append("GoogleEmail", GoogleEmail);
            formData.append("Name", "");
    
            fetch("/api/messages/POST_UpdateViewed", {
                method: "POST",
                body: formData,
            })
            .then((response) => response.json())
            .catch((error) => console.error("Error making API call", error));
        }
    }, [status, session]);

    var SenderGoogleImage = "";
    var SenderGoogleEmail = "";
    var ReceiverGoogleImage = "";
    var ReceiverGoogleEmail = "";
    var CurrentMessageDate = "";
    
    const [file, setFile] = useState(null);

    console.log(file)

    const [ResponseUploading, setResponseUploading] = useState(false);

    const fetcher = (...args) => fetch(...args).then((res) => res.json());

    const { data, mutate, error, isLoading } = useSWR(
        `/api/messages/GET_Message?department=${encodeURIComponent(Department)}&GoogleEmail=${encodeURIComponent(GoogleEmail)}`,
        fetcher
    );

    if(!isLoading) {
        // SenderGoogleImage = Department === "Medical" ? Medical : Department === "Dental" ? Dental : Department === "SDPC" ? SDPC  : "";
        // SenderGoogleEmail = Department === "Medical" ? Defaults.MedicalEmail : Department === "Dental" ? Defaults.DentalEmail : Department === "SDPC" ? Defaults.SDPCEmail  : "";
        // ReceiverGoogleImage = data?.GoogleImage??UserDefault;
        // ReceiverGoogleEmail = data?.GoogleEmail??"?";

        ReceiverGoogleImage = Department === "Medical" ? Medical : Department === "Dental" ? Dental : Department === "SDPC" ? SDPC  : "";
        ReceiverGoogleEmail = Department === "Medical" ? Defaults.MedicalEmail : Department === "Dental" ? Defaults.DentalEmail : Department === "SDPC" ? Defaults.SDPCEmail  : "";
        SenderGoogleImage = GoogleImage??UserDefault;
        SenderGoogleEmail = GoogleEmail??"?";
        console.log(data);
    }

    const sortedResponses = data?.Responses?.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA; 
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
                <textarea className={styles.responseFormTextbox} name="Response" rows="2" />
                <button className={styles.submitBtn} disabled={ResponseUploading}>{ResponseUploading ? "Uploading..." : "Send"}</button>
            </form>
        )    
    }

    const Response = ({ image, response, timestamp, isRight, attachmentName}) => {
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
            <div className={isRight ? styles.MessageRight : styles.MessageLeft}>
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
        );
      };

    useEffect(() => {
        const handleBeforeUnload = () => {
            const formData = new FormData();
            formData.append("Department", Department);
            formData.append("GoogleEmail", GoogleEmail);
            formData.append("Name", "");
    
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
    }, [Department, GoogleEmail]);

    const HandleResponseSubmit = async (e) => {
        e.preventDefault();
        try {
            setResponseUploading(true);
    
            const formData = new FormData(e.target);
            formData.append("Department", Department);
            formData.append("RecordId", 0);
            formData.set("Attachment", file);
            formData.append("GoogleImage", GoogleImage);
            formData.append("Type", "DirectMessage");
    
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


    const formatShortDate = (timestamp) => {
		const options = { month: 'short', day: 'numeric', year: 'numeric' };
		const formattedDate = new Date(timestamp).toLocaleDateString(undefined, options);
	  
		return `${formattedDate}`;
	};

    const MainContent = () => {
        return (
            <div className={styles.MessagesContainer}>

                {isLoading ? (
                    null
                ) : data && sortedResponses ? (
                    sortedResponses?.map((response, index) => (
                        <Response 
                            key={index}
                            image={response.Name === "Dental" || response.Name === "Medical" || response.Name === "SDPC" ? ReceiverGoogleImage : SenderGoogleImage}
                            response={response.Response}
                            timestamp={response.Timestamp}
                            isRight={response.Name === "Dental" || response.Name === "Medical" || response.Name === "SDPC" ? false : true}
                            attachmentName = {response.Attachment}
                        />
                    ))
                ) : (
                    <p></p>
                )} 

                {isLoading ? ("") : (
                    <ResponseForm 
                        name={GoogleName} 
                        receiverGmail={ReceiverGoogleEmail} 
                        senderGmail={SenderGoogleEmail}
                    />
                )}
            </div>
        ) 
    }

    const Header = () => {
        return (
            <div className={styles.Header}>
                <p>Direct Massage - {`${Department === "Dental" ? "Dental Health Services" : Department === "Medical" ? "Medical Health Services" : Department === "SDPC" ? "SDPC Department" : "?"}`}</p>
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



