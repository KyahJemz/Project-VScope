"use client"

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import Image from "next/image";
import { data } from "./data.js";
import ImageSlider from "@/components/ImageSlider/ImageSlider";

const slides = [
  { url: "/1.png", title: "beach" },
  { url: "/2.png", title: "boat" },
  { url: "/3.png", title: "forest" },
];

const containerStyles = {
  width: "100%",
  height: "400px",
};


const About = () => {
  return (
    <div className={styles.container}>
      <div className={`${styles.row}`}>
        <div style={containerStyles} className={styles.imageSlider}>
          <ImageSlider slides={slides} />
        </div>
      </div>

      <div className={`${styles.row} ${styles.border}`}>
        <div className={styles.header}>The V-Scope: Health Services Management System</div>
        <div className={styles.thevscope}>
          <div className={styles.aboutvscope}>
            <p className={styles.aboutvscopetitle}>{data.aboutvscope[0].title}</p>
            <p className={styles.aboutvscopecontent}>{data.aboutvscope[0].desc}</p>
          </div>
          <div className={styles.vscopevideo}>
            <Image src={data.aboutvscope[0].image} alt="" width='300' height='300'/>
          </div>
        </div>
      </div>

      <div className={styles.row}>
        <p className={styles.thedevelopers}>The Developers</p>
        <div className={styles.thedeveloperscontainer}>
          {data['developers'].map((item) => (
            <div className={styles.thedevelopersborder}  key={item.id}>
              <div className={styles.thedeveloperscards}>
                <Image className={styles.thedevelopersimage} src={item.image} alt="" height="200" width="200"/>
                <p className={styles.thedevelopersname}>{item.name}</p>
              </div>
            </div>
          ))}
          
        </div>
      </div>

      <div className={styles.row}>
        {data['about'].map((item) => (
              <div className={styles.aboutrow} key={item.id}>
                <div className={styles.aboutcontent}>
                  <p className={styles.abouttitle}>{item.title}</p>
                  <p className={styles.abouttext}>{item.desc}</p>
                </div>
                <Image className={styles.aboutimage} src={item.image} alt="" height="300" width="300"/>
              </div>
          ))}
      </div>
      
    </div>
  );
};

export default About;
