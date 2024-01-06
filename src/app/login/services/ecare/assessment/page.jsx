"use client"

import React from "react";
import styles from "./page.module.css"
import Image from "next/image";
import { useRouter } from "next/navigation";

const Page = ({ params }) => {

  const router = useRouter();


  return (
    <div className={styles.MainContainer}>
      <div className={styles.Header}>Assessments <button className={styles.HistoryBtn} onClick={()=>router.push('/login/services/ecare/assessment/history')}>Assessment history</button></div>
      
      <div className={styles.Cards}>
        <div className={styles.Card}>
          <div className={styles.Color}>PERSONALITY TEST</div>
          <button className={styles.Button} onClick={()=>router.push('/login/services/ecare/assessment/personalitytest')}>TRY IT</button>
        </div>
        <div className={styles.Card}>
          <div className={styles.Color}>MENTAL HEALTH TEST</div>
          <button className={styles.Button} onClick={()=>router.push('/login/services/ecare/assessment/mentalhealthtest')}>TRY IT</button>
        </div>
        <div className={styles.Card}>
          <div className={styles.Color}>EDUCATIONAL TEST</div>
          <button className={styles.Button} onClick={()=>router.push('/login/services/ecare/assessment/educationaltest')}>TRY IT</button>
        </div>
      </div>
      <div className={styles.RecentAssessments}>

      </div>
    </div>
  )
};

export default Page;


