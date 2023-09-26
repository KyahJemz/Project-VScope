"use client"

import React, { useState } from "react";
import styles from "./page.module.css";
import { getProviders, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Hero from "public/hero.png";

async function redirect(Email) {
  const router = useRouter();
  try {
    const response = await fetch(`/api/access?GoogleEmail=${encodeURIComponent(Email)}`);
    if (response.ok) {
      const data = await response.json();
      console.log("redirect",data);
      return router.push(data.path+'/'+data.data[0].Department);
    } else {
      return router.push('/login');
    }
  } catch (error) {
    return router.push(`/login?Error=${error.message}`);
  }
}

const Login = () => {
  const session = useSession();
  const [activePanel, setActivePanel] = useState('clientPanel');

  if (session.status === "loading") {
    return <p>Loading...</p>;
  }

  
  
  if (session.status === "authenticated") {
    // Assign the user's email to the Email variable
      const Email = session.data.user.email;
      console.log(Email);
      redirect(Email);
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

