
import React from "react";
import { redirect } from "next/navigation";

const Page = ({ params }) => {
  const Department = params.department;

  redirect('/login/authorized/'+Department+'/ecare/clearance/accounts');

  return (
    <>
       
    </>
  )
};

export default Page;


