"use client"

import React, { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
import useSWR from "swr";
import Image from "next/image";
import UserDefault from "/public/UserDefault.png";
import { useRouter } from "next/navigation";
import Dental from "public/Dental.jpg";
import Medical from "public/Medical.jpg";
import SDPC from "public/SDPC.jpg";
import { useSession } from "next-auth/react";
import { Data as Datasets } from "@/models/Data";

import Defaults from "@/models/Defaults";
import Google from "next-auth/providers/google";


const Form = ({params}) => {
    const router = useRouter();
    const Department = params.department;
    const { data: session, status } = useSession();
	const [GoogleEmail, setGoogleEmail] = useState("");
    const [GoogleImage, setGoogleImage] = useState("");
    const [GoogleName, setGoogleName] = useState("");
    const [SicknessWindow, setSicknessWindow] = useState("");
    
    const [Diagnosis, setDiagnosis] = useState([]);
    const [Prescription, setPrescription] = useState([]);
    const [Symptoms, setSymptoms] = useState([]);
    const [PrescriptionConcern, setPrescriptionConcern] = useState("");

    const [StatusSicknessList, setStatusSicknessList] = useState([]);
    const [StatusMedicineList, setStatusMedicineList] = useState([]);

    const [ViewStatusPanel, setViewStatusPanel] = useState("Sickness"); // Sickness or Medicine

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
    const [HasActiveSicknessReport, setHasActiveSicknessReport] = useState(false);

    const fetcher = (...args) => fetch(...args).then((res) => res.json());

    const { data, mutate, error, isLoading } = useSWR(
        `/api/messages/GET_Message?department=${encodeURIComponent(Department)}&GoogleEmail=${encodeURIComponent(GoogleEmail)}`,
        fetcher
    );

    const { data: accountData, mutate: accountMutate, error: accountError, isLoading: accountIsLoading } = useSWR(
        `/api/accounts/details?&GoogleEmail=${encodeURIComponent(GoogleEmail)}`,
        fetcher
    );

    // const { data: medicineData, mutate: medicineMutate, error: medicineError, isLoading: medicineIsLoading } = useSWR(
    //     `/api/inventory/GET_ItemsHistory?Department=${encodeURIComponent(Department)}&GoogleEmail=${encodeURIComponent(GoogleEmail)}`,
    //     fetcher
    // );

    // if (!medicineIsLoading){
    //     console.log("medicineData", medicineData)
    // }

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
        const options = { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
        const formattedDate = new Date(timestamp).toLocaleDateString(undefined, options);
    
        return formattedDate;
    };

    const Messages = useRef(null);

    useEffect(() => {
        const element = Messages.current;
        if (element) {
          element.scrollTop = element.scrollHeight;
        }
    }, [Messages, data, file, ResponseUploading]);

    const Header = () => {
        return (
        <>
            <div className={styles.Header}>
                <p>Direct Massage - {`${Department === "Dental" ? "Dental Health Services" : Department === "Medical" ? "Medical Health Services" : Department === "SDPC" ? "SDPC Department" : "?"}`}</p>
            </div>
            <div className={styles.HeaderSickness}>
                <p>Sickness Report</p>
            </div>
        </>
        )
    }



   

    useEffect(() => {
        const getSicknessStatus = async () => {
            if (accountData && accountData?.SicknessReport?.[Department]) {
                const sortedSicknessList = accountData?.SicknessReport[Department].sort((a, b) => {
                    return new Date(b.updatedAt) - new Date(a.updatedAt);
                });
        
                setStatusSicknessList(sortedSicknessList);
            }
        };

        const getMedicineStatus = async () => {
            const formData = new FormData();
            formData.append("Department", Department);
            formData.append("GoogleEmail", GoogleEmail);
            try {
                let response = await fetch(`/api/sickness/medicine/GET_requestMedicine?Department=${encodeURIComponent(Department)}&GoogleEmail=${encodeURIComponent(GoogleEmail)}`, {
                    method: "GET",
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch medicine status');
                }
                const data = await response.json();
                const dataSorted = data.sort((a, b) => {
                    return new Date(b.updatedAt) - new Date(a.updatedAt);
                });
                setStatusMedicineList(dataSorted)
            } catch (error) {
                console.error("Error making API call", error);
            }
        };

        getSicknessStatus();
        getMedicineStatus();




    }, [ViewStatusPanel]);


    useEffect(()=>{
        const hasActiveSicknessReport = (e) => {
            if (accountData && accountData?.SicknessReport?.[Department]){
             accountData?.SicknessReport[Department].map((item)=>{
                 if(item.Status === "In Progress" || item.Status === "Approved"){
                    setHasActiveSicknessReport(true);
                    return true;
                 } else {
                    setHasActiveSicknessReport(false);
                 }
             })
            }else {
                setHasActiveSicknessReport(false);
            }
        }
        const getSymptomsToday = async () => {
            if (accountData && accountData?.SicknessReport?.[Department]) {
                accountData?.SicknessReport[Department].map((item)=>{
                    if(item.Status === "In Progress" || item.Status === "Approved"){
                        const sortedSicknessUpdateList = item?.Updates??[].sort((a, b) => {
                            return new Date(b.Date) - new Date(a.Date);
                        });
                        setSymptoms(sortedSicknessUpdateList??[]);
                    }
                })
                console.log("Symptoms",Symptoms)
            }
        };
        getSymptomsToday();
        hasActiveSicknessReport();
    }, [accountData])

    const [DiagnosisUploading, setDiagnosisUploading] = useState(false);
    // Diagnostics
    const sendDiagnostics = async (e) => {
        e.preventDefault();
        if(!Diagnosis.length > 0) {
            alert("Cannot add empty diagnosis")
            return
        }
        if(DiagnosisUploading){
            return
        }
        try {
            setDiagnosisUploading(true)
            const formData = new FormData();
            formData.append("Diagnosis", await JSON.stringify(Diagnosis));
            formData.append("Department", Department);
            formData.append("GoogleEmail", GoogleEmail);
            formData.append("GoogleImage", GoogleImage);
            formData.append("Name", GoogleName);
            const response = await fetch("/api/sickness/sickness/POST_addSickness", {
                method: "POST",
                body: formData,
            });
            if (response.ok) {
                console.log("Complete");
                setDiagnosis([]);
                setSicknessWindow('');
                alert("Uploaded successfully")
            } else {
                console.log("Failed");
                alert("Failed, Try again!")
            }
        } catch (err) {
            console.log(err);
        } finally {
            setDiagnosisUploading(false)
        }
    }
    const addDiagnosis = async (e) => {
        e.preventDefault();
        if (e.target.value.value === "") return 
        const initialDiagnosis = Array.isArray(Diagnosis) ? Diagnosis : [];
        const newDiagnosis = [...initialDiagnosis, e.target.value.value];
        setDiagnosis(newDiagnosis);
        e.target.reset();
    }
    const removeDiagnosis = async (e) => {
        const removeValueFromArray = (array, valueToRemove) => {
            return array.filter(item => item !== valueToRemove);
        };
        const initialDiagnosis = Array.isArray(Diagnosis) ? Diagnosis : [];
        const newDiagnosis = removeValueFromArray(initialDiagnosis, e.target.dataset.text);
        setDiagnosis(newDiagnosis);
    }



    // Prescription
    const sendPrescription = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("Medicine", JSON.stringify(Prescription));
            formData.append("Concern", PrescriptionConcern);
            formData.append("Name", session.user.name);
            formData.append("GoogleImage", session.user.image);
            formData.append("Department", Department);
            formData.append("GoogleEmail", GoogleEmail);
            formData.append("Status", "In Progress");
            const response = await fetch("/api/sickness/medicine/POST_requestMedicine", {
                method: "POST",
                body: formData,
            });
            if (response.ok) {
                console.log("Complete");
                setPrescription([]);
                setSicknessWindow('');
                alert("Request posted, waiting for approval!");
            } else {
                console.log("Failed");
                alert("Failed Try again!");
            }
        } catch (err) {
            console.log(err);
        } finally {
        }
    }
    const addPrescription= async (e) => {
        e.preventDefault();
        if (e.target.value.value == "") return 
        const initialPrescription = Array.isArray(Prescription) ? Prescription : [];
        const newPrescription = [...initialPrescription, e.target.value.value];
        setPrescription(newPrescription);
        e.target.reset();
    }
    const removePrescription = async (e) => {
        const removeValueFromArray = (array, valueToRemove) => {
            return array.filter(item => item !== valueToRemove);
        };
        const initialPrescription = Array.isArray(Prescription) ? Prescription : [];
        const newPrescription = removeValueFromArray(initialPrescription, e.target.dataset.text);
        setPrescription(newPrescription);
    }


    // Health Report
    const addHealthReport = async (e) => {
        e.preventDefault();

        if (e.target.values.value === "") return 
        if (e.target.dates.value === "") return 

        const HealthReportValue = e.target.values.value;
        const HealthReportDate = e.target.dates.value;

        try {
            const formData = new FormData();
            formData.append("HealthReportValue", HealthReportValue);
            formData.append("HealthReportDate", HealthReportDate);
            formData.append("Department", Department);
            formData.append("GoogleEmail", GoogleEmail);
            const response = await fetch("/api/sickness/sickness/POST_addSicknessUpdate", {
                method: "POST",
                body: formData,
            });
            if (response.ok) {
                console.log("Complete");
                alert("Successfully Added")
            } else {
                console.log("Failed");
                alert("Failed, Try Again!")
            }
        } catch (err) {
            console.log(err);
        } finally {
            e.target.reset();
        }
    }
    const removeHealthReport= async (e) => {
        try {
            const formData = new FormData();
            formData.append("Department", Department);
            formData.append("GoogleEmail", GoogleEmail);
            formData.append("Id", e.target.dataset.symptomid);
            const response = await fetch("/api/sickness/sickness/POST_removeUpdate", {
                method: "POST",
                body: formData,
            });
            if (response.ok) {
                console.log("Complete");
                alert("Successfully Removed")
            } else {
                console.log("Failed");
                alert("Failed, Try Again!")
            }
        } catch (err) {
            console.log(err);
        } finally {
        }
    }
    const UpdateHealthReport = async (e) => {
        const values = e.target.closest('.parentClass').querySelector('.values').value;
        const dates = e.target.closest('.parentClass').querySelector('.dates').value;
        if(!values || !dates){
            alert("No empty fields!")
            return 
        }
        try {
            const formData = new FormData();
            formData.append("HealthReportValue", values);
            formData.append("HealthReportDate", dates);
            formData.append("Department", Department);
            formData.append("GoogleEmail", GoogleEmail);
            formData.append("Id", e.target.dataset.symptomid);
            const response = await fetch("/api/sickness/sickness/POST_updateUpdate", {
                method: "POST",
                body: formData,
            });
            if (response.ok) {
                console.log("Complete");
                alert("Successfully Updated")
            } else {
                console.log("Failed");
                alert("Failed, Try Again!")
            }
        } catch (err) {
            console.log(err);
        } finally {
        }
    }






    return (
        <div className={styles.MainContent}>
            <Header/>
            {isLoading ? (
                "Loading..."
            ) : ( 
                <>
                    <div className={styles.MessagesContainer}>
                        <div className={styles.Messages} ref={Messages}>
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
                        </div>

                        {isLoading ? ("") : (
                            <ResponseForm 
                                name={GoogleName} 
                                receiverGmail={ReceiverGoogleEmail} 
                                senderGmail={SenderGoogleEmail}
                            />
                        )}
                    </div>
                    <div className={styles.SicknessContainer}>
                            {SicknessWindow === "AddConcern" ?
                                <div className={styles.SicknessContent2}>
                                    <div className={styles.sicknessTop}>
                                        <div className={styles.headerSickness2}>Diagnosis</div>
                                        <div className={styles.listDiagnosis}>
                                            {Diagnosis?.map((diagnosis, index) => {
                                                return (
                                                    <div key={index} className={styles.ListDiagnosisItem}>
                                                        <p className={styles.ListDiagnosisItemText}>{diagnosis}</p>
                                                        <button className={styles.ListDiagnosisItemBtn} data-text={diagnosis} onClick={removeDiagnosis}>x</button>
                                                    </div>
                                                )
                                            })}
                                            <form className={styles.ListDiagnosisItem} onSubmit={addDiagnosis} >
                                                <input name="value" className={styles.ListDiagnosisItemText} list="DiagnosisList" placeholder="Diagnosis" />
                                                <datalist id="DiagnosisList">
                                                    {Datasets?.Diagnosis[Department]?.map((element, index) => (
                                                        <option key={index} value={element}/>
                                                    ))}
                                                </datalist>
                                                <button className={styles.ListDiagnosisItemAddBtn}>+</button>
                                            </form>
                                        </div>
                                        
                                    </div>
                                   <div className={styles.sicknessBtns}>
                                        <button className={styles.sicknessBtn} onClick={()=>setSicknessWindow("")}>Back</button>
                                        <button className={styles.sicknessBtn} onClick={sendDiagnostics}>Send</button>
                                    </div>
                                </div>
                            : SicknessWindow === "ViewStatus" ?
                                <div className={styles.SicknessContent2}>
                                    <div className={styles.sicknessTop}>
                                        <div className={styles.headerSickness2}>View Status</div>
                                        <div className={styles.viewStatusPanelButtons}>
                                            <button className={`${styles.viewStatusBtn} ${ViewStatusPanel === "Sickness"? styles.viewStatusActive : null}`} onClick={()=>setViewStatusPanel("Sickness")}>Sickness</button>
                                            <button className={`${styles.viewStatusBtn} ${ViewStatusPanel === "Medicine"? styles.viewStatusActive : null}`} onClick={()=>setViewStatusPanel("Medicine")}>Medicine</button>
                                        </div>
                                        {ViewStatusPanel === "Sickness" ? 
                                            <div className={styles.viewStatusPanels}>
                                                {StatusSicknessList && StatusSicknessList.map((item, index)=>{
                                                    return (
                                                        <div key={index} className={styles.viewStatusItem}>{`Your sickness report is [${item.Status}]`}<div className={styles.viewStatusItemDate}>{formatShortDate(item.updatedAt)}</div></div>
                                                    )
                                                })}
                                            </div>
                                        : ViewStatusPanel === "Medicine" ?
                                            <div className={styles.viewStatusPanels}>
                                                {StatusMedicineList && StatusMedicineList.map((item, index)=>{
                                                    return (
                                                        <div key={index} className={styles.viewStatusItem}>{`Your request is [${item.Status}]`}<div className={styles.viewStatusItemDate}>{formatShortDate(item.updatedAt)}</div></div>
                                                    )
                                                })}
                                            </div>
                                        : null
                                        }
                                    </div>
                                    <div className={styles.sicknessBtns}>
                                        <button className={styles.sicknessBtn} onClick={()=>setSicknessWindow("")}>Back</button>
                                    </div>
                                </div>
                            : SicknessWindow === "HealthReport" ?
                                <div className={styles.SicknessContent2}>
                                    <div className={styles.sicknessTop}>
                                        <div className={styles.headerSickness2}>Health Report</div>
                                        <div className={styles.listSymptoms}>
                                            <div className={styles.HealthReportItemHeader}>Symptoms Today</div>
                                            {Symptoms && Symptoms.length > 0 && Symptoms?.map((symptom, index) => {
                                                console.log("symptom 1",symptom)
                                                return (
                                                    <div key={index} className={`${styles.ListSymptomsItem} parentClass`} >
                                                        <input name="value" className={`${styles.ListDiagnosisItemText} values`} list="SymptomsList"  defaultValue={symptom?.Symptoms??""} placeholder="Symptoms" required/>
                                                        <input name="date" className={`${styles.UpdateDateSymptom} dates`} type="datetime-local" defaultValue={symptom?.Date??""} required/>
                                                        <datalist id="SymptomsList">
                                                            {Datasets?.Diagnosis[Department]?.map((element, index) => (
                                                                <option key={index} value={element}/>
                                                            ))}
                                                        </datalist>
                                                        <div className={`${styles.symptomsBtns}`}>
                                                            <button data-symptomid={symptom?._id??""} onClick={removeHealthReport} className={styles.ListDiagnosisItemAddBtn}>Remove</button>
                                                            <button data-symptomid={symptom?._id??""} onClick={UpdateHealthReport} className={styles.ListDiagnosisItemAddBtn}>Update</button>
                                                        </div>
                                                    </div> 
                                                )
                                            })}
                                            <form className={styles.ListSymptomsItem} onSubmit={addHealthReport} >
                                                <input name="values" className={styles.ListDiagnosisItemText} list="Diagnosis2List" placeholder="Symptoms" required/>
                                                <input name="dates" className={styles.UpdateDateSymptom} type="datetime-local" required/>
                                                <datalist id="Diagnosis2List">
                                                    {Datasets?.Diagnosis[Department]?.map((element, index) => (
                                                        <option key={index} value={element}/>
                                                    ))}
                                                </datalist>
                                                <div className={styles.symptomsBtns}>
                                                    <button className={styles.ListDiagnosisItemAddBtn}>Add</button>
                                                </div>
                                            </form> 
                                        </div>
                                    </div>
                                    <div className={styles.sicknessBtns}>
                                        <button className={styles.sicknessBtn} onClick={()=>setSicknessWindow("")}>Back</button>
                                        <button className={styles.sicknessBtn} onClick={()=>setSicknessWindow("")}>Cleared</button>
                                    </div>
                                </div>
                            : SicknessWindow === "RequestMedicine" ?
                                <div className={styles.SicknessContent2}>
                                    <div className={styles.sicknessTop}>
                                        <div className={styles.headerSickness2}>Request Medicine</div>
                                        <div className={styles.listMedicine}>
                                            {Prescription && Prescription?.map((prescription, index) => {
                                                return (
                                                    <div key={index} className={styles.ListMedicineItem}>
                                                        <p className={styles.ListMedicineItemText}>{prescription}</p>
                                                        <button className={styles.ListMedicineItemBtn} data-text={prescription} onClick={removePrescription}>x</button>
                                                    </div>
                                                )
                                            })}
                                            <form className={styles.ListMedicineItem} onSubmit={addPrescription} >
                                                <input name="value" className={styles.ListMedicineItemText} list="PrescriptionsList" placeholder="Prescriptions" />
                                                <datalist id="PrescriptionsList">
                                                    {Datasets?.Prescriptions[Department]?.map((element, index) => (
                                                        <option key={index} value={element}/>
                                                    ))}
                                                </datalist>
                                                <button className={styles.ListMedicineItemAddBtn}>+</button>
                                            </form>
                                        </div>
                                        <div className={styles.ConcernContainer}>
                                            <div className={styles.ConcernHeader}></div>
                                            <textarea className={styles.ConcernContent} placeholder="Concern..." name="concern" id="" rows="3" onBlur={(e)=>setPrescriptionConcern(e.target.value)}></textarea>
                                        </div>
                                    </div>
                                    <div className={styles.sicknessBtns}>
                                        <button className={styles.sicknessBtn} onClick={()=>setSicknessWindow("")}>Back</button>
                                        <button className={styles.sicknessBtn} onClick={sendPrescription}>Send</button>
                                    </div>
                                </div>
                            : 
                            <div className={styles.SicknessContent1}>
                                {console.log("HasActiveSicknessReport", HasActiveSicknessReport)}
                                {HasActiveSicknessReport ? null : <button className={styles.sicknessBtn} onClick={()=>setSicknessWindow("AddConcern")}>Add Concern</button>}
                                <button className={styles.sicknessBtn} onClick={()=>setSicknessWindow("ViewStatus")}>View Status</button>
                                <button className={styles.sicknessBtn} onClick={()=>setSicknessWindow("RequestMedicine")}>Request Medicine</button>
                                <button className={styles.sicknessBtn} onClick={()=>router.push('/login/services/appointments/'+Department)}>Set Appointment</button>
                                {HasActiveSicknessReport ? <button className={styles.sicknessBtn} onClick={()=>setSicknessWindow("HealthReport")}>Health Report</button> : null}
                            </div>
                            }
                    </div>
                </>
            )}
        </div>
    );
};

export default Form;



