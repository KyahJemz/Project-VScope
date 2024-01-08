"use client"
import React from "react";
import { redirect } from "next/navigation";
import styles from "./page.module.css";

const Page = ({ params }) => {
  const Department = params.department;

  return (
      <div className={styles.NoContent}>
        <div className={styles.NoContentHeader}>
                Messaging
          </div>
        Select message...
      </div>
  )
};

export default Page;


