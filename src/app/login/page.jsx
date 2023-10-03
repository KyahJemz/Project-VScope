"use client"

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import { getProviders, signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Image from "next/image";
import Hero from "public/hero.png";

const Login = () => {
  const {data: session, status} = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  console.log("--LOGIN--",session);

  if (status === "authenticated") {
    if (session.user?.department && session.user.department != null) {
      redirect('/login/authorized/' + session.user.department);
    } else {
      redirect('/login/services');
    }
  }

  return (
    <div className={styles.container}>

      <div className={styles.leftpanel}>
        <Image src={Hero} alt="" className={styles.img} />
      </div>

      <div classname={styles.rightpanel}>

        <div className={styles.visible}>
          <h2 className={styles.title}>Login</h2>
          <button className={styles.googlesignin} onClick={() => {signIn("google");}}>
            Sign in using Google
          </button>
        </div>

      </div>

    </div>
  );
};

export default Login;

