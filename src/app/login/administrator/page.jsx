import React from "react";
import { redirect } from 'next/navigation';

const Administrator = () => {
  
  redirect('/login/administrator/clients');

  return (
    <></>
  );
};

export default Administrator;