"use client"

import React from "react";
import styles from "./page.module.css"
import Image from "next/image";
import { useRouter } from "next/navigation";

const Page = ({ params }) => {

  const router = useRouter();


  return (
    <div className={styles.MainContainer}>
      <div className={styles.Header}>Mental Health Test</div>
      <div className={styles.Introduction}>If you are experiencing symptoms related to mental health problems, seeking professional help is essential for an accurate diagnosis and appropriate support.</div>
      
      <div className={styles.Cards}>
        <div className={styles.Card}>
          <div className={styles.Color}>Mood Disorders</div>
          <button className={styles.Button} onClick={()=>router.push('/login/services/ecare/assessment/mentalhealthtest/mht1')}>Take this test</button>
        </div>
        <div className={styles.Card}>
          <div className={styles.Color}>Anxiety Disorders</div>
          <button className={styles.Button} onClick={()=>router.push('/login/services/ecare/assessment/mentalhealthtest/mht2')}>Take this test</button>
        </div>
        <div className={styles.Card}>
          <div className={styles.Color}>Trauma-Related Disorders</div>
          <button className={styles.Button} onClick={()=>router.push('/login/services/ecare/assessment/mentalhealthtest/mht3')}>Take this test</button>
        </div>
        <div className={styles.Card}>
          <div className={styles.Color}>Personality Disorders</div>
          <button className={styles.Button} onClick={()=>router.push('/login/services/ecare/assessment/mentalhealthtest/mht4')}>Take this test</button>
        </div>
        <div className={styles.Card}>
          <div className={styles.Color}>Other Mental Health Problems</div>
          <button className={styles.Button} onClick={()=>router.push('/login/services/ecare/assessment/mentalhealthtest/mht5')}>Take this test</button>
        </div>
      </div>
      <div className={styles.RecentAssessments}>

      </div>
    </div>
  )
};

export default Page;


