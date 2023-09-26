"use client";

import Link from "next/link";
import React from "react";
import styles from "./navbar.module.css";
import DarkModeToggle from "../DarkModeToggle/DarkModeToggle";
import { signOut, useSession } from "next-auth/react";

const StaffLinks = [
  {
    id: 1,
    title: "Dashboard",
    url: "/authorized/department/dashboard",
  },
  {
    id: 2,
    title: "Appointments",
    url: "/authorized/department/appointments",
  },
];

const AdminLinks = [
  {
    id: 3,
    title: "Consultation",
    url: "/authorized/department/consultation",
  },
  {
    id: 4,
    title: "Analytics",
    url: "/authorized/department/analytics",
  }
];

const Sidebar = () => {
  const { data: session, status } = useSession();
  
  return (
    <div className={styles.container}>
      <Link href="/" className={styles.logo}>
        VScope
      </Link>
      <div className={styles.links}>
        <DarkModeToggle />
        {links.map((link) => (
          <Link key={link.id} href={link.url} className={styles.link}>
            {link.title}
          </Link>
        ))}
        {status === "authenticated" && (
          <button className={styles.logout} onClick={signOut}>
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
