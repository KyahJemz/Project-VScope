"use client"

import React, { useState } from "react";

const Page = () => {
  const [data, setData] = useState("");

  const HandleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);

      const response = await fetch("/api/test", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const responseText = await response.text();
        console.log("Complete");
        setData(responseText);
      } else {
        console.log("Failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form action="" onSubmit={HandleSubmit}>
        <input type="text" name="text" />
        <select name="type" id="">
          <option value="Encrypt">Encrypt</option>
          <option value="Decrypt">Decrypt</option>
        </select>
        <button type="submit">Submit</button>
      </form>
      <p>{data}</p>
    </div>
  );
};

export default Page;