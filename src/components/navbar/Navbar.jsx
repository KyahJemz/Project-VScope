"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";
import styles from "./navbar.module.css";
import DarkModeToggle from "../DarkModeToggle/DarkModeToggle";
import { signOut, useSession } from "next-auth/react";

const links = [
  {
    id: 1,
    title: "Home",
    url: "/",
    icon: "/images/icons/2.png",
  },
  {
    id: 2,
    title: "Information",
    url: "/information",
    icon: "/images/icons/4.png",
  },
  {
    id: 3,
    title: "About",
    url: "/about",
    icon: "/images/icons/3.png",
  },
  {
    id: 4,
    title: "Services",
    url: "/login",
    icon: "/images/icons/5.png",
  }
];

const Navbar = () => {
  const { data: session, status } = useSession();
  
  return (
    <div className={styles.container}>
      <Link href="/" className={styles.logo}>
        VScope
      </Link>
      <div className={styles.links}>
        <DarkModeToggle />

        <div className={styles.webLayout}>
          {links.map((link) => (
            <Link key={link.id} href={link.url} className={styles.link}>
              {link.title}
            </Link>
          ))}
        </div>

        <div className={styles.mobileLayout}>
          {links.map((link) => (
              <Link key={link.id} href={link.url} className={styles.link}>
                <Image className={styles.icons} src={link.icon} width='25' height='25'/>
              </Link>
          ))}
        </div>

        {status === "authenticated" && (
          <button className={styles.logout} onClick={signOut}>
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
