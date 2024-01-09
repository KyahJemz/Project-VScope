"use client"

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import { getProviders, signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Image from "next/image";
import Hero from "public/hero.png";
import ImageSlider from "@/components/ImageSlider/ImageSlider";

const slides = [
  { url: "https://i.imgur.com/4dEzbKy.png", title: "beach" },
  { url: "https://i.imgur.com/4dEzbKy.png", title: "boat" },
  { url: "https://i.imgur.com/FWAH6wd.png", title: "forest" },
];

const containerStyles = {
  width: "300px",
  height: "300px",
};

const Login = () => {
  const {data: session, status} = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "authenticated") {
    if (session.user?.department && session.user.department != null) {
      if (session.user.department === "Administrator") {
        redirect('/login/administrator');
      } else {
        redirect('/login/authorized/' + session.user.department);
      }
    } else {
      redirect('/login/services');
    }
  }

  return (
    <div className={styles.container}>

      <div className={styles.leftpanel}>
        <div style={containerStyles}>
          <ImageSlider slides={slides} />
        </div>
      </div>

      <div classname={styles.rightpanel}>

        <div className={styles.visible}>
          <Image src="https://i.imgur.com/4immlsF.png" className={styles.imagelogo} alt="logo" width={100} height={100} />
          <button className={styles.googlesignin} onClick={() => {signIn("google");}}>
            Login
          </button>
          <p className={styles.note}>IF YOU DONT HAVE AN SSCR EMAIL PLEASE CONTACT ICT DEPARTMENT FOR YOUR CONCERNS. THANK YOU!</p>
        </div>

      </div>

    </div>
  );
};

export default Login;

