import React from "react";
import { redirect } from 'next/navigation';
import styles from "./page.module.css";

const Administrator = () => {
  
  redirect('/login/administrator/management');

  return (
    <></>
  );
};

export default Administrator;