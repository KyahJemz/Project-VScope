
import React from "react";
import styles from "./page.module.css"
import { redirect } from "next/navigation";

const Page = ({ params }) => {

  redirect('/login/services/records/appointments');

  return (
    <></>
  )
};

export default Page;


