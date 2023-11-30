"use client"

import React from "react";
import styles from "./page.module.css";
import Link from "next/link";
import { useRouter  } from "next/navigation";

export default function RootLayout(prop) {

const Department = params.department;
const router = useRouter();

const Layout = () => {
    <div className={styles.SideNavigations}>
      <Link className={`${styles.Button} ${styles.SideNavigation}`} onClick={setActivePanel("WALKINS")}>WALKINS</Link>
      <Link className={`${styles.Button} ${styles.SideNavigation}`} onClick={setActivePanel("MESSAGES")}>MESSAGES</Link>
      <Link className={`${styles.Button} ${styles.SideNavigation}`} onClick={setActivePanel("CLEARANCES")}>CLEARANCES</Link>
      <Link className={`${styles.Button} ${styles.SideNavigation}`} onClick={setActivePanel("PROGRESS")}>PROGRESS</Link>
    </div>
  };

  return (
    <>
        <SideNavigation/>
        {prop.children}
    </>
  );
}
