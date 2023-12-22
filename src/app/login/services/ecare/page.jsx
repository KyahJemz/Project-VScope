
import React from "react";
import styles from "./page.module.css"
import { redirect } from "next/navigation";

const Page = ({ params }) => {

  redirect('/login/services/ecare/messages');

  return (
    <></>
  )
};

export default Page;


