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
  return (
  <form action="" className={styles.form}>
    <div className={styles.formRow}>
    <p className={styles.formTitle}>Dental Form</p>
    </div>
    

    <div className={styles.formRow}>
        <div className={styles.inputContainerMax}>
            <p className={styles.label}>Name:</p>
            <input className={`${styles.input} ${styles.fullInput}`} placeholder="First name" type="text" required/>
            <input className={`${styles.input} ${styles.fullInput}`} placeholder="Middle name" type="text" required/>
            <input className={`${styles.input} ${styles.fullInput}`} placeholder="Last name" type="text" required/>
        </div>
        <div className={styles.inputContainer}>
            <p className={styles.label}>Civil Status:</p>
            <input className={`${styles.input} ${styles.smallInput}`} type="text" required/>
        </div>
    </div>

    <div className={styles.formRow}>
        <div className={styles.inputContainerMax}>
            <p className={styles.label}>Address:</p>
            <input className={`${styles.input} ${styles.fullInput}`} type="text" required/>
        </div>
    </div>

    <div className={styles.formRow}>
        <div className={styles.inputContainerMax}>
            <p className={styles.label}>Course:</p>
            <input className={`${styles.input} ${styles.fullInput}`} type="text" required/>
        </div>
        <div className={styles.inputContainerMax}>
            <p className={styles.label}>Year:</p>
            <input className={`${styles.input} ${styles.fullInput}`} type="text" required/>
        </div>
        <div className={styles.inputContainerMax}>
            <p className={styles.label}>Section:</p>
            <input className={`${styles.input} ${styles.fullInput}`} type="text" required/>
        </div>
    </div>

    <div className={styles.formRow}>
        <div className={styles.inputContainer}>
            <p className={styles.label}>Age:</p>
            <input className={`${styles.input} ${styles.smallInput}`} type="text" required/>
        </div>
        <div className={styles.inputContainerMax}>
            <p className={styles.label}>Date of Birth:</p>
            <input className={`${styles.input} ${styles.fullInput}`} type="date" required/>
        </div>
        <div className={styles.inputContainerMax}>
            <p className={styles.label}>Religion:</p>
            <input className={`${styles.input} ${styles.fullInput}`} type="text" required/>
        </div>
        <div className={styles.inputContainerMax}>
            <p className={styles.label}>Contact No:</p>
            <input className={`${styles.input} ${styles.fullInput}`} type="text" required/>
        </div>
    </div>

    <div className={styles.formRow}>
        <div className={styles.inputContainerMax}>
            <p className={styles.label}>Spouse Name:</p>
            <input className={`${styles.input} ${styles.fullInput}`} type="text"/>
        </div>
        <div className={styles.inputContainer}>
            <p className={styles.label}>Sex:</p>
            <select className={styles.input} type="text" required>
              <option value=""></option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
        </div>
    </div>

    <div className={styles.formRow}>
        <div className={styles.inputContainerMax}>
            <p className={styles.label}>Mothers Name:</p>
            <input className={`${styles.input} ${styles.fullInput}`} type="text" required/>
        </div>
        <div className={styles.inputContainerMax}>
            <p className={styles.label}>Fathers Name:</p>
            <input className={`${styles.input} ${styles.fullInput}`} type="text" required/>
        </div>
    </div>

    <div className={styles.formRow}>
        <div className={styles.inputContainerMax}>
            <p className={styles.label}>Person to notify incase of emergency:</p>
            <input className={`${styles.input} ${styles.fullInput}`} type="text" required/>
        </div>
        <div className={styles.inputContainer}>
            <p className={styles.label}>Contact No:</p>
            <input className={styles.input} type="text" required/>
        </div>
    </div>

    <div className={styles.formRow}>
        <div className={styles.inputContainer}>
            <p className={styles.label}>Date:</p>
            <input className={styles.input} type="date" readOnly disabled/>
        </div>
        <div className={styles.inputContainer}>
            <p className={styles.label}>Tooth:</p>
            <input className={styles.input} type="text" readOnly disabled/>
        </div>
        <div className={styles.inputContainer}>
            <p className={styles.label}>Service Offered:</p>
            <input className={styles.input} type="text" readOnly disabled/>
        </div>
        <div className={styles.inputContainer}>
            <p className={styles.label}>Service Offered:</p>
            <input className={styles.input} type="text" readOnly disabled/>
        </div>
    </div>

    <div className={styles.formRow}>
        <div className={styles.textareaContainer}>
           <p className={styles.label}>Concern:</p>
            <textarea className={`${styles.input} ${styles.textarea}`} type="text" cols='20' rows='20'/>
        </div>
    </div>

  </form>

)
    
    // firstnmame middlename lastname civil status
    // address 
    // age   dateofbirth  contactnumner
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

  return (
    <form action="" className={styles.form}>

        <div className={styles.formRow}>
            <div className={styles.inputContainer}>
                <p>fullname:</p>
                <textarea type="text" />
            </div>
            <div className={styles.inputContainer}>
                <p>course/department:</p>
                <textarea type="text" />
            </div>
        </div>

        <div className={styles.formRow}>
            <div className={styles.inputContainer}>
                <p>address:</p>
                <textarea type="text" />
            </div>
            <div className={styles.inputContainer}>
                <p>age:</p>
                <textarea type="text" />
            </div>
            <div className={styles.inputContainer}>
                <p>sex:</p>
                <textarea type="text" />
            </div>
        </div>

        <div className={styles.formRow}>
            <div className={styles.inputContainer}>
                <p>contact#:</p>
                <textarea type="text" />
            </div>
            <div className={styles.inputContainer}>
                <p>civilstatus:</p>
                <textarea type="text" />
            </div>
            <div className={styles.inputContainer}>
                <p>sex:</p>
                <textarea type="text" />
            </div>
        </div>

        <div className={styles.formRow}>
            <div className={styles.inputContainer}>
                <p>emergency contact person:</p>
                <textarea type="text" />
            </div>
            <div className={styles.inputContainer}>
                <p>contact number:</p>
                <textarea type="text" />
            </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.inputContainer}>
            <p>Concern:</p>
            <textarea type="text" />
          </div>
        </div>
        
    </form>
  )
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
                <DentalRegistrationForm />
                
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



