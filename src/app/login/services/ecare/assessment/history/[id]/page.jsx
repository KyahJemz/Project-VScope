"use client"

import React, { useState,useEffect } from "react";
import useSWR from "swr";
import styles from "./page.module.css"
import Image from "next/image";
import { useSession } from "next-auth/react";
import { AssessmentQuestions } from "@/models/AssessmentQuestions";

const Page = ({ params }) => {
  const Id = params.id;
  const { data: session, status } = useSession();
	const [GoogleEmail, setGoogleEmail] = useState("");

  useEffect(() => {
		if (status === "authenticated" && session?.user?.email) {
		  setGoogleEmail(session.user.email);
		}
	}, [status, session]);

  const formatDate = (timestamp) => {
		const options = { month: 'short', day: 'numeric', year: 'numeric' };
		const formattedDate = new Date(timestamp).toLocaleDateString(undefined, options);
	  
		const hours = new Date(timestamp).getHours();
		const minutes = new Date(timestamp).getMinutes();
		const amOrPm = hours >= 12 ? 'pm' : 'am';
		const formattedTime = `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')}${amOrPm}`;
	  
		return `${formattedDate} ${formattedTime}`;
	};

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
    
	const { data: RecordsData, mutate: RecordsMutate, error: RecordsError, isLoading: RecordsIsLoading } =  useSWR(
		`/api/assessments/GET_Assessment?Id=${encodeURIComponent(Id)}`,
		fetcher
	);

  return (
    <div className={styles.MainContainer}>
      <div className={styles.Header}>Assessment Result</div>
        {!RecordsIsLoading && RecordsData ? (
          <>
            <div className={styles.Type}>{RecordsData.Type}</div>
            <div className={styles.Result}>
              <div className={styles.ResultHeader}>Result</div>
              <div className={styles.MainCategory}>{RecordsData.Type === "Educational Test" ? "Congratulations" : RecordsData.Ranking[0].MainCategory}</div>
              <div className={styles.SubCategory}>Result: {RecordsData.Ranking[0].SubCategory}</div>
              <div className={styles.Description}>{AssessmentQuestions["SDPC Result"][RecordsData.Ranking[0].SubCategory]}</div>
            </div>
          </>
        ) : (
          "Loading..."
        )}

    </div>
  )
};

export default Page;


