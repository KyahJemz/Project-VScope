"use client"

import React, { useState } from "react";
import styles from "./page.module.css";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { notFound } from "next/navigation";
import useSWR from "swr";

const Dashboard = ({ params }) => {
  const Department = params.department;
  console.log(params);
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
                    <p
                      className={`${activeTab === 'blogs' ? styles.active : ''} ${styles.tabbutton}`}
                      onClick={() => handleTabClick('blogs')}>Blogs</p>
                    <p
                      className={`${activeTab === 'announcements' ? styles.active : ''} ${styles.tabbutton}`}
                      onClick={() => handleTabClick('announcements')}>Announcements</p>
                  </div>

              <div className={ activeTab === 'blogs' ? `${styles.blogsContainer}` : `${styles.hide}`}>
                  <div className={styles.header}>
                      <h3 className={styles.subtitle}>Blogs</h3>
                      <button className={styles.subtitle}>Add Blogs</button>
                  </div>
                  <div className={styles.content}>
                    {BlogsisLoading ? "Loading..." : Blogs?.map((data, index) => (
                        <div key={index} className={styles.blogsItem}>
                            <div className={styles.itemHeader}>
                                <Image className={styles.itemDeptImage} 
                                    src={`/public/${data.Department}`}
                                    height={50}
                                    width={50}
                                />
                                <div className={styles.itemHeaderDetails}>
                                    <p className={styles.itemDepartment}>{data.Department}</p>
                                    <p className={styles.itemDate}>{data?.createdAt}</p>
                                </div>
                            </div>
                            <div className={styles.itemBody}>
                                {data?.Image && (
                                    <Image
                                        className={styles.blogImage}
                                        src={`/public/${data.Image}`}
                                        height={500}
                                        width={500}
                                    />
                                )}
                                <p className={styles.itemTitle}>{data.Title}</p>
                                <p className={styles.itemContent}>{data.Content}</p>
                            </div>
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
                        <div key={index} className={styles.AnnouncementsItem}>
                            <div className={styles.itemHeader}>
                                <Image className={styles.itemDeptImage} 
                                    src={`/public/${data.Department}`}
                                    height={50}
                                    width={50}
                                />
                                <div className={styles.itemHeaderDetails}>
                                    <p className={styles.itemDepartment}>{data.Department}</p>
                                    <p className={styles.itemDate}>{data?.createdAt}</p>
                                </div>
                            </div>
                            <div className={styles.itemBody}>
                                <p className={styles.itemTitle}>{data.Title}</p>
                                <p className={styles.itemContent}>{data.Content}</p>
                            </div>
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
                            <div key={index} className={styles.faqsItem}>
                                <Image className={styles.faqImage} 
                                    src={`/public/${data.Department}`}
                                    height={50}
                                    width={50}
                                />
                                <div className={styles.faqDetails}>
                                    <p className={styles.faqTitle}>{data.Department}</p>
                                    <details>
                                      <summary>{data.Title}</summary>
                                      <p>{data.Content}</p>
                                    </details>
                                </div>
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
