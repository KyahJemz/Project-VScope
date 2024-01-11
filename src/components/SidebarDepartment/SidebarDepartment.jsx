"use client";

import React from "react";
import styles from "./SidebarDepartment.module.css";
import { useSession } from "next-auth/react";
import useSWR from "swr";

const Sidebar = ({department}) => {
    const { data: session, status } = useSession();

    const fetcher = (...args) => fetch(...args).then((res) => res.json());

    const { data: RecordsData, mutate: RecordsMutate, error: RecordsError, isLoading: RecordsIsLoading } =  useSWR(
      `/api/messages/GET_Messages?Department=${encodeURIComponent(department)}`,
      fetcher
    );

    const IsNew = (record) => {
      let unviewedCount = 0;
  
      if (record) {
        for (const item of record) {
          if (item?.Responses) {
            for (const response of item.Responses) {
              if (response.ViewedByDepartment === false) {
                unviewedCount++;
              }
            }
          }
        }
      }
  
      return unviewedCount;
    };

    const IsNewPending = (record) => {
      let unviewedCount = 0;
  
      if (record) {
        for (const item of record) {
          if (item.Status === "Pending") {
            unviewedCount++;
          }
        }
      }
  
      return unviewedCount;
    };

    const { data: DirectData, mutate: DirectMutate, error: DirectError, isLoading: DirectIsLoading } =  useSWR(
      `/api/messages/GET_Messages?Department=${encodeURIComponent(department)}&Type=${encodeURIComponent("Direct Message")}`,
      fetcher
  );
  
  const HasDirectMessages = (record) => {
    let unviewedCount = 0;
    
    if (record) {
      for (const item of record) {
        if (item?.Responses) {
        for (const response of item.Responses) {
          if (response.ViewedByDepartment === false) {
          unviewedCount++;
          }
        }
        }
      }
      }
    
    return unviewedCount;
  };
  


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
      active: IsNewPending(RecordsData) > 0 ? true : false
    },
    {
      id: 3,
      title: "e-CARE",
      url: "/login/authorized/"+department+"/ecare",
      active: IsNew(RecordsData) > 0 || HasDirectMessages(DirectData) > 0? true : false
    },
  ];
  
  const AdminLinks = [
    {
      id: 1,
      title: "RECORDS",
      url: "/login/authorized/"+department+"/records",
    },
    {
      id: 2,
      title: "REPORTS",
      url: "/login/authorized/"+department+"/reports",
    },
    {
      id: 3,
      title: "MANAGEMENT",
      url: "/login/authorized/"+department+"/management",
    },
  ];
  
  return (
    <div className={styles.container}>
        <div className={styles.links}>
          {ManagementLinks.map((link) => (
            <a key={link.id} href={link.url} className={styles.link}>
              {link.title}
              {link?.active && link.active === true ? <div className="dot"></div> : null}
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
