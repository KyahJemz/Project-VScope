
import React from "react";
import { redirect } from "next/navigation";

const Appointments = ({ params }) => {
  const Department = params.department;

  redirect('/login/authorized/'+Department+'/appointments/pending');

  return (
    <>
       
    </>
  )
};

export default Appointments;


