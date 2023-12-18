"use client";

import React from "react";
import styles from "./SidebarClient.module.css";

const Sidebar = () => {

  const Links = [
    {
      id: 1,
      title: "APPOINTMENTS",
      url: "/login/services/appointments",
    },
    {
      id: 2,
      title: "eCARE",
      url: "/login/services/ecare",
    },
    {
      id: 3,
      title: "RECORDS",
      url: "/login/services/records",
    },
    {
      id: 4,
      title: "REPORTS",
      url: "/login/services/reports",
    },
  ];
  
  return (
    <div className={styles.container}>
        <div className={styles.links}>
          {Links.map((link) => (
            <a key={link.id} href={link.url} className={styles.link}>
              {link.title}
            </a>
          ))}
      </div>
    </div>
  );
};

export default Sidebar;
