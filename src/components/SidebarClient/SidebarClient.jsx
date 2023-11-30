"use client";

import React from "react";
import styles from "./SidebarClient.module.css";
import { useSession } from "next-auth/react";

const Sidebar = ({department}) => {
  const { data: session, status } = useSession();

  const ManagementLinks = [
    {
      id: 1,
      title: "DASHBOARD",
      url: "/login/authorized/"+department,
    },
    {
      id: 2,
      title: "APPOINTMENTS",
      url: "/login/authorized/"+department+"/appointments",
    },
    {
      id: 3,
      title: "e-CARE",
      url: "/login/authorized/"+department+"/consultation",
    },
    {
      id: 4,
      title: "RECORDS",
      url: "/login/authorized/"+department+"/search",
    },
    {
      id: 5,
      title: "REPORTS",
      url: "/login/authorized/"+department+"/search",
    },
    {
      id: 6,
      title: "MANAGEMENT",
      url: "/login/authorized/"+department+"/search",
    },
  ];
  
  const AdminLinks = [
    {
      id: 4,
      title: "Analytics",
      url: "/login/authorized/"+department+"/analytics",
    }
  ];


  
  return (
    <div className={styles.container}>
        <div className={styles.links}>
          {ManagementLinks.map((link) => (
            <a key={link.id} href={link.url} className={styles.link}>
              {link.title}
            </a>
          ))}
          {status === "authenticated" && session.user.role === "Admin" ? AdminLinks.map((link) => (
            <a key={link.id} href={link.url} className={styles.link}>
              {link.title}
            </a>
            )) 
            : null
          }
      </div>
    </div>
  );
};

export default Sidebar;
