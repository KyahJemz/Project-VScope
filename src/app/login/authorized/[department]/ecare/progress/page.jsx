
import React from "react";
import { redirect } from "next/navigation";

const Page = ({ params }) => {
  const Department = params.department;

  redirect('/login/authorized/'+Department+'/ecare/progress/walkins');

  return (
    <>
       
    </>
  )
};

export default Page;


