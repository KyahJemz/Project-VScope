"use client"

import React, { useState } from "react";
import styles from "./page.module.css";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { notFound } from "next/navigation";
import useSWR from "swr";

const Dashboard = ({ params }) => {
  const Department = params.department;
  const { data: session, status } = useSession();
  const router = useRouter();

  // if (status === "authenticated") {
  //   console.log('-----AUTHORIZED', session);
  //   if (session.UserData?.Department){
  //     if (Department != session.UserData.Department) {
  //       router.push('/authorized/'+session.UserData.Department);
  //     }
  //   } else {
  //     router.push('/services');
  //   }
  // }

  // View Blogs
  // View Anns
  // View FAQ

  // Admin Post Blogs
  // Admin Post Announcements
  // Update FAQ

  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const { data: Blogs, mutate: Blogsmutate, error: Blogserror, isLoading: BlogsisLoading } = useSWR(
    `/api/blogs?department=${encodeURIComponent(Department)}`,
    fetcher
  );
  
  const { data: Announcements, mutate: Announcementsmutate, error: Announcementserror, isLoading: AnnouncementsisLoading } = useSWR(
    `/api/announcements?department=${encodeURIComponent(Department)}`,
    fetcher
  );
  
  const { data: FAQ, mutate: FAQmutate, error: FAQerror, isLoading: FAQisLoading } = useSWR(
    `/api/faq?department=${encodeURIComponent(Department)}`,
    fetcher
  );

  const [activeTab, setActiveTab] = useState('blogs');

  const handleTabClick = (tab) => {
    Blogsmutate();
    Announcementsmutate();
    FAQmutate();
    setActiveTab(tab);
  };

  return (
      <div className={styles.mainContainer}>
          <h3 className={styles.mainTitle}>Dashboard</h3>

          <div className={styles.container}>
            
              <div className={styles.leftContainer}>
                  <div className={styles.tab}>
                      <button className={activeTab === 'blogs' ? styles.active : ''} onClick={() => handleTabClick('blogs')}>Blogs</button>
                      <button className={activeTab === 'announcements' ? styles.active : ''} onClick={() => handleTabClick('announcements')}>Announcements</button>
                  </div>

              <div className={ activeTab === 'blogs' ? `${styles.blogsContainer}` : `${styles.hide}`}>
                  <div className={styles.header}>
                      <h3 className={styles.subtitle}>Blogs</h3>
                      <button className={styles.subtitle}>Add Blogs</button>
                  </div>
                  <div className={styles.content}>
                    {BlogsisLoading ? "Loading..." : Blogs?.map((data, index) => (
                        <div key={index} className={styles.blogsItem}>
                            
                        </div>
                    ))}
                  </div>
              </div>

              <div className={ activeTab === 'announcements' ? `${styles.announcementsContainer}` : `${styles.hide}`}>
                  <div className={styles.header}>
                      <h3 className={styles.subtitle}>Announcements</h3>
                      <button className={styles.subtitle}>Add Announcements</button>
                  </div>
                  <div className={styles.content}>
                    {AnnouncementsisLoading ? "Loading..." : Announcements?.map((data, index) => (
                        <div key={index} className={styles.blogsItem}>
                            
                        </div>
                    ))}
                  </div>
              </div>

            </div>

            <div className={styles.rightContainer}>
                <div className={styles.FAQContainer}>
                    <div className={styles.header}>
                      <h3 className={styles.subtitle}>FAQ</h3>
                      <button className={styles.subtitle}>Add FAQ</button>
                    </div>
                    <div className={styles.content}>
                        {FAQisLoading ? "Loading..." : FAQ?.map((data, index) => (
                            <div key={index} className={styles.blogsItem}>
                                
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

    </div>
  );
};

export default Dashboard;
