"use client"

import React, { useState } from "react";
import styles from "./page.module.css";
import { getProviders, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Hero from "public/hero.png";

const Login = () => {
  const session = useSession();
  const [activePanel, setActivePanel] = useState('clientPanel');

  if (session.status === "loading") {
    return <p>Loading...</p>;
  }

  const router = useRouter();
  if (session.status === "authenticated") {
      console.log('-----LOGIN', session);
      if (session.data.UserData?.Department){
        router.push('/authorized/'+session.data.UserData.Department);
      } else {
        router.push('/services');
      }
  }

  const handlePanelChange = (panel) => {
    console.log("changed" + panel);
    setActivePanel(panel);
  };

  return (
    <div className={styles.container}>

      <div className={styles.leftpanel}>
        <Image src={Hero} alt="" className={styles.img} />
      </div>

      <div classname={styles.rightpanel}>

        <p className={styles.options}>Login as  
          <a className={styles.option} onClick={() => handlePanelChange('adminPanel')}>Admin,</a>
          <a className={styles.option} onClick={() => handlePanelChange('staffPanel')}>Staff,</a>
          <a className={styles.option} onClick={() => handlePanelChange('clientPanel')}>Client</a>
        </p>

        <div className={`${activePanel === 'adminPanel' ? styles.visible : styles.panel}`}>
          <h2 className={styles.title}>Admin panel</h2>
          <button className={styles.googlesignin} onClick={() => {signIn("google");}}>
            Sign in using Admin SSCR Email
          </button>
        </div>

        <div
          className={`${activePanel === 'staffPanel' ? styles.visible : styles.panel}`}>
          <h2 className={styles.title}>Staff panel</h2>
          <button className={styles.googlesignin} onClick={() => {signIn("google");}}>
            Sign in using Registered Personal Email
          </button>
        </div>

        <div
          className={`${activePanel === 'clientPanel' ? styles.visible : styles.panel}`}>
          <h2 className={styles.title}>Client panel</h2>
          <button className={styles.googlesignin} onClick={() => {signIn("google");}}>
            Sign in using SSCR Email
          </button>
        </div>

      </div>

    </div>
  );
};

export default Login;

