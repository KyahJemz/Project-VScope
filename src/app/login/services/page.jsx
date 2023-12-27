
import React from "react";
import { redirect } from "next/navigation";

const Services = ({ params }) => {

  redirect('/login/services/appointments');

  const mainContainerStyle = {
    flex: 1
  };


  return (
    <div style={mainContainerStyle}></div>
  )
};

export default Services;


