import React from "react";
import styles from "./page.module.css";
import Button from "@/components/Button/Button";
import Link from "next/link";
import Image from "next/image";
import { items } from "./data.js";
import { notFound } from "next/navigation";

const getData = (cat) => {
  const data = items[cat];

  if (data) {
    return data;
  }

  return notFound();
};

const Department = ({ params }) => {
  const data = getData(params.department);
  return (
    <div className={styles.container}>
      <h3 className={styles.mainTitle}>Services</h3>
      <h1 className={styles.catTitle}>{params.department}</h1>
      {/* <div className={styles.appointmentBtn} ><a className={styles.appointmentBtntext} href={`/login/services/${params.department}/appointments`}> Set Appointment</a></div> */}

      {data.map((item) => (
        <div className={styles.item} key={item.id}>
          <div className={styles.content}>
            <h1 className={styles.title}>{item.title}</h1>
            <p className={styles.desc}>{item.desc}</p>
            {item.button_1 && <Button text={item.button_1.text} url={item.button_1.url} />}
            {item.button_2 && <Button text={item.button_2.text} url={item.button_2.url} />}
            {item.button_3 && <Button text={item.button_3.text} url={item.button_3.url} />}
          </div>
          <div className={styles.imgContainer}>
            <Image
              className={styles.img}
              fill={true}
              src={item.image}
              alt='ImageFile'
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Department;
