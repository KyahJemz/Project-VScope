"use client"

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import { notFound } from "next/navigation";
import useSWR from "swr";

// functn para sa Date Formatig
const formatDate = (timestamp) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = new Date(timestamp).toLocaleDateString(undefined, options);

  const hours = new Date(timestamp).getHours();
  const minutes = new Date(timestamp).getMinutes();
  const amOrPm = hours >= 12 ? 'pm' : 'am';
  const formattedTime = `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')}${amOrPm}`;

  return `${formattedDate} ${formattedTime}`;
};




const DentalRegistrationForm = () => {
    // firstnmame middlename lastname
    // address 
    // age   DOB  contactnumner
    // Mothersname        Fathersname
    // person in charge incase of emergency
    // contact Number
    // religion
    // course year section
    // spouse name  Gender male or femeale
    // date Tooth servicerendered  ???
    // concern
}

const MedicalRegistrationForm = () => {
  // fullname  course/department
  // address    age     sex  
  // contact#    civilstatus
  // emergency contact person          contact number
  // concern
}

const ConcernForm = () => {
  // fullname  course/department
  // address    age     sex  
  // contact#    civilstatus
  // emergency contact person          contact number
  // concern
}



const Form = (params) => {
  const category = params.params.category;

    return (
      <div className={styles.mainContainer}>
          <div className={styles.vLine}></div>
          <div className={styles.row}>
              <div className={styles.mark}>
                <div className={styles.datetime}>
                    <div className={styles.date}>September 29, 2023</div>
                    <div className={styles.time}>11:25pm</div>
                </div>
                <div className={styles.hLine}></div>
              </div>

              <div className={styles.content}>
                <p>111</p><p>111</p><p>111</p><p>111</p><p>111</p><p>111</p><p>111</p><p>111</p><p>111</p><p>111</p><p>111</p><p>111</p><p>111</p><p>111</p><p>111</p>
                
              </div>
          </div>

          <div className={styles.row}>
              <div className={styles.mark}>
                <div className={styles.datetime}>
                    <div className={styles.date}>September 29, 2023</div>
                    <div className={styles.time}>11:25pm</div>
                </div>
                <div className={styles.hLine}></div>
              </div>

              <div className={styles.content}>
                <p>111</p><p>111</p><p>111</p><p>111</p><p>111</p><p>111</p><p>111</p><p>111</p><p>111</p><p>111</p><p>111</p><p>111</p><p>111</p><p>111</p><p>111</p>
                
              </div>
          </div>

          <div className={styles.row}>
              <div className={styles.mark}>
                <div className={styles.datetime}>
                    <div className={styles.date}>September 29, 2023</div>
                    <div className={styles.time}>11:25pm</div>
                </div>
                <div className={styles.hLine}></div>
              </div>

              <div className={styles.content}>
                <p>111</p><p>111</p><p>111</p><p>111</p><p>111</p><p>111</p><p>111</p><p>111</p><p>111</p><p>111</p><p>111</p><p>111</p><p>111</p><p>111</p><p>111</p>
                
              </div>
          </div>
      </div>
    );

};

export default Form;



