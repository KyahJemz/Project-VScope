import React from "react";
import styles from "./page.module.css";
import Link from "next/link";

const Services = () => {

    return (
      <div className={styles.container}>
        <h3 className={styles.mainTitle}>Services</h3>
        <h3 className={styles.selectTitle}>Click down below:</h3>
        <div className={styles.items}>

          <div className={styles.itemcontainer}>
            <Link href="/login/services/Medical" className={styles.Medical}>
              <span className={styles.title}>Medical</span>
            </Link>
            <Link href="/login/services/Medical/appointments" className={styles.setAppointment}>Set Appointment</Link>
          </div>

          <div className={styles.itemcontainer}>
            <Link href="/login/services/Dental" className={styles.Dental}>
              <span className={styles.title}>Dental</span>
            </Link>
            <Link href="/login/services/Dental/appointments" className={styles.setAppointment}>Set Appointment</Link>
          </div>

          <div className={styles.itemcontainer}>
            <Link href="/login/services/SDPC" className={styles.SDPC}>
              <span className={styles.title}>SDPC</span>
            </Link>
            <Link href="/login/services/SDPC/appointments" className={styles.setAppointment}>Set Appointment</Link>
          </div>
          
        </div>
      </div>
    );
};

export default Services;
