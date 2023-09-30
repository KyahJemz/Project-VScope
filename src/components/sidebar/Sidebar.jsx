"use client";

import Link from "next/link";
import React, { useState } from "react";
import styles from "./Sidebar.module.css";

const Sidebar = ({department}) => {

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
  ];
  
  const AdminLinks = [
    {
      id: 3,
      title: "Consultation",
      url: "/login/authorized/"+department+"/consultation",
    },
    {
      id: 4,
      title: "Analytics",
      url: "/login/authorized/"+department+"/analytics",
    }
  ];
  
  return (
    <div className={panel ? styles.container : styles.containerHide}>
      <button className={styles.toggle} onClick={panel ? ()=>setPanel(false) : ()=>setPanel(true)}>#</button>
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
          {AdminLinks.map((link) => (
            <a key={link.id} href={link.url} className={styles.link}>
              {link.title}
            </a>
          ))}
      </div>
      }
    </div>
  );
};

export default Sidebar;
