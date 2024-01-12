"use client"

import React, { useState } from "react";
import styles from "./page.module.css";
import { useRouter } from 'next/navigation';
import useSWR from "swr";
import Image from "next/image";
import UserDefault from "public/UserDefault.png";

const Dashboard = ({ params }) => {
  const Department = params.department;
  const GoogleEmail = params.gmail;
  const router = useRouter();

  const [SearchFilter, setSearchFilter] = useState("");

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
    
	const { data, mutate, error, isLoading } =  useSWR(
		`/api/records/GET_Records?GoogleEmail=${GoogleEmail}&Department=${encodeURIComponent(Department)}&Status=&Type=${encodeURIComponent("All")}`,
		fetcher
	);

  if (!isLoading) {
    console.log(data);
  }

  const ViewRecord = (e) => {
    router.push('/login/authorized/'+Department+'/records/'+GoogleEmail+'/'+e.target.dataset.value);
  }

  return (
    <div className={styles.MainContent}>
      {isLoading ? "Loading..." : 
        <>
          <div className={styles.Profile}>
                <div className={styles.ProfileTop}>
                  <Image 
                    className={styles.ProfileImage}
                    src={data[0].GoogleImage === "" || data[0].GoogleImage === null ? UserDefault : data[0].GoogleImage}
                    alt="x"
                    width={150}
                    height={150}
                  />
                  <p className={styles.ProfileName}>{data[0]?.Details?.FirstName??""} {data[0]?.Details?.MiddleName??""} {data[0]?.Details?.LastName??""}</p>
                  <p className={styles.ProfileId}>{data[0]?.Details?.StudentNumber??"n/a"}</p>
                  <p className={styles.ProfileEmail}>{data[0]?.GoogleEmail??"n/a"}</p>
                  <button className={styles.AssessmentHistoryBtn} onClick={()=>router.push('/login/authorized/'+Department+'/records/'+GoogleEmail+'/'+'profile')}>View Profile</button>
                  {Department === "SDPC" ? 
                    <button className={styles.AssessmentHistoryBtn} onClick={()=>router.push('/login/authorized/'+Department+'/records/'+GoogleEmail+'/'+'assessments')}>View Assessments</button>
                    :
                    null
                  }
                </div>
              </div>
          <div className={styles.HistoryContainer}>
            {data.map((record, index) => (
              <>
                <div className={styles.Record} key={index} data-value={record._id} onClick={ViewRecord}>
                  {new Date(record.createdAt).toLocaleDateString("en-US", {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                  })} - {record.Status}
                </div>
                
              </>
              
            ))}
          </div>
        </>
      }
  </div>
  );
};

export default Dashboard;
