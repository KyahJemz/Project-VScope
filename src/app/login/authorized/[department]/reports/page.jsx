"use client"

import React, { useState } from "react";
import styles from "./page.module.css";
import { useRouter } from 'next/navigation';
import useSWR from "swr";
import Image from "next/image";
import Dental from "public/Dental.jpg";
import Medical from "public/Medical.jpg";
import SDPC from "public/SDPC.jpg";

const Dashboard = ({ params }) => {
  const Department = params.department;
  console.log(params);
  const router = useRouter();


  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const { data, mutate, error, isLoading } = useSWR(
    `/api/blogs?department=${encodeURIComponent(Department)}`,
    fetcher
  );
  


  return (
    <div className={styles.MainContainer}>
		<div className={styles.StatusChart}></div>
		<div className={styles.DailyChart}></div>
		<div className={styles.OverviewChart}></div>
		<div className={styles.SystemChart}></div>
   
  	</div>
  );
};

export default Dashboard;
