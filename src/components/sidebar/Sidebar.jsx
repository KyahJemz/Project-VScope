"use client";

import Link from "next/link";
import React, { useState } from "react";
import styles from "./Sidebar.module.css";
import { useSession } from "next-auth/react";

const Sidebar = ({department}) => {
  const { data: session, status } = useSession();

  const [panel, setPanel] = useState(false);

  const ManagementLinks = [
    {
      id: 1,
      title: "Dashboard",
      url: "/login/authorized/"+department,
    },
    {
      id: 2,
      title: "Appointments",
      url: "/login/authorized/"+department+"/appointments",
    },
    {
      id: 3,
      title: "Consultation",
      url: "/login/authorized/"+department+"/consultation",
    },
    {
      id: 4,
      title: "Search",
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
    <div className={panel ? styles.container : styles.containerHide}>
      <div className={styles.toggle} onClick={panel ? ()=>setPanel(false) : ()=>setPanel(true)}>
        <div className={styles.toggleLine}></div>
        <div className={styles.toggleLine}></div>
        <div className={styles.toggleLine}></div>
      </div>
      {panel === false ? null : 
        <div className={styles.links}>
          <Link href="/" className={styles.logo}>
            VScope Admin
          </Link>
          {ManagementLinks.map((link) => (
            <a key={link.id} href={link.url} className={styles.link}>
              {link.title}
            </a>
          ))}
          {session.user.role === "Admin" ? AdminLinks.map((link) => (
            <a key={link.id} href={link.url} className={styles.link}>
              {link.title}
            </a>
            )) 
            : null
          }
      </div>
      }
    </div>
  );
};

export default Sidebar;
