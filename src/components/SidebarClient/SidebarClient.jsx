"use client";

import React, { useState, useEffect } from "react";
import styles from "./SidebarClient.module.css";
import { useSession } from "next-auth/react";
import useSWR from "swr";

const Sidebar = () => {
  const { data: session, status } = useSession();
  const [GoogleEmail, setGoogleEmail] = useState("");

  useEffect(() => {
	  if (status === "authenticated" && session?.user?.email) {
      setGoogleEmail(session.user.email)
	  }
	}, [status, session]);

  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const { data: RecordsData, mutate: RecordsMutate, error: RecordsError, isLoading: RecordsIsLoading } =  useSWR(
		`/api/messages/GET_Messages?GoogleEmail=${encodeURIComponent(GoogleEmail)}`,
		fetcher
	);

  const IsNew = (record) => {
		let unviewedCount = 0;

    if (record) {
      for (const item of record) {
        if (item?.Responses) {
          for (const response of item.Responses) {
            if (response.ViewedByClient === false) {
              unviewedCount++;
            }
          }
        }
      }
    }

		return unviewedCount;
	};

  const { data, mutate, error, isLoading } = useSWR(
    `/api/messages/GET_Message?GoogleEmail=${encodeURIComponent(GoogleEmail)}`,
    fetcher
);

const HasDirectMessages = (record) => {
let unviewedCount = 0;

if (record) {
  for (const item of record) {
    if (item?.Responses) {
    for (const response of item.Responses) {
      if (response.ViewedByClient === false) {
      unviewedCount++;
      }
    }
    }
  }
  }

return unviewedCount;
};



const { data: NotificationData, mutate: NotificationMutate, error: NotificationError, isLoading: NotificationIsLoading } =  useSWR(
  `/api/notifications/GET_Notifications`,
  fetcher
);

const filteredNotificationsData = NotificationData?.filter((notification) => {
  if (notification.Target !== "All" && notification.Target !== Role+"s"){
    return false;
  }
    return true;
  });

  if(!NotificationIsLoading) {
    console.log(filteredNotificationsData);
  }

  const HasInProgress = (records) => {
    let InProgress = [];
  
    if (records) {
      for (const record of records) {

          // Check if GoogleEmail is in the Cleared array
          const isCleared = record.Cleared.includes(GoogleEmail);
  
          // If GoogleEmail is in Cleared array, mark the record as cleared
          InProgress.push({ ...record, cleared: isCleared });
      }
    }
  
    const isNotCleared = InProgress.some(record => !record.cleared);
  
    return isNotCleared;
  };
  

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
      active: Number(IsNew(RecordsData)) + Number(HasDirectMessages(data)) > 0 ? true : false
    },
    {
      id: 3,
      title: "RECORDS",
      url: "/login/services/records",
      active: HasInProgress(filteredNotificationsData) ? true : false,
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
              {link?.active && link.active === true ? <div className="dot"></div> : null}
            </a>
          ))}
      </div>
    </div>
  );
};

export default Sidebar;
