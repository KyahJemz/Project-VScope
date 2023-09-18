import React from "react";
import styles from "./page.module.css";
import Link from "next/link";

const Services = () => {
  return (
    <div className={styles.container}>
      <h3 className={styles.mainTitle}>Services</h3>
      <h3 className={styles.selectTitle}>Click down below:</h3>
      <div className={styles.items}>
        <Link href="/services/Medical" className={styles.item}>
          <span className={styles.title}>Medical</span>
        </Link>
        <Link href="/services/Dental" className={styles.item}>
          <span className={styles.title}>Dental</span>
        </Link>
        <Link href="/services/SDPC" className={styles.item}>
          <span className={styles.title}>SDPC</span>
        </Link>
      </div>
    </div>
  );
};

export default Services;
