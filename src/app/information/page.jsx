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
            <Link href="/information/Medical" className={styles.Medical}>
              <span className={styles.title}>Medical</span>
            </Link>
          </div>

          <div className={styles.itemcontainer}>
            <Link href="/information/Dental" className={styles.Dental}>
              <span className={styles.title}>Dental</span>
            </Link>
          </div>

          <div className={styles.itemcontainer}>
            <Link href="/information/SDPC" className={styles.SDPC}>
              <span className={styles.title}>SDPC</span>
            </Link>
          </div>
          
        </div>
      </div>
    );
};

export default Services;
