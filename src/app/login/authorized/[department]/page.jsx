"use client"

import React, { useState } from "react";
import styles from "./page.module.css";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import useSWR from "swr";
import Image from "next/image";
import Dental from "public/Dental.jpg";
import Medical from "public/Medical.jpg";
import SDPC from "public/SDPC.jpg";

const formatDate = (timestamp) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(timestamp).toLocaleDateString(undefined, options);
  
    const hours = new Date(timestamp).getHours();
    const minutes = new Date(timestamp).getMinutes();
    const amOrPm = hours >= 12 ? 'pm' : 'am';
    const formattedTime = `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')}${amOrPm}`;
  
    return `${formattedDate} ${formattedTime}`;
  };
  


const Dashboard = ({ params }) => {
  const Department = params.department;
  console.log(params);
  const { data: session, status } = useSession();
  const router = useRouter();

  function convertNewlines(text, toHTML = false) {
    if (toHTML) {
      return text.replace(/\n/g, '<br />');
    } else {
      return text.replace(/<br \/>|<br\/>|<br>|<br\s\/>/g, '\n');
    }
  }

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
    `/api/faqs?department=${encodeURIComponent(Department)}`,
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
                      {session?.user?.role === 'Admin'? <button className={styles.subtitleBTN} onClick={() => router.push('/login/authorized/'+Department+'/AddBlog')}>Add Blog</button> : ''}
                  </div>
                  <div className={styles.content}>
                    {BlogsisLoading ? "Loading..." : Blogs?.map((data, index) => (
                        <div key={index} className={styles.blogsItem}>
                            <div className={styles.itemHeader}>
                                <Image className={styles.itemDeptImage} 
                                    src={
                                      data.Department === "Dental" ? Dental : 
                                      data.Department === "Medical" ? Medical :
                                      data.Department === "SDPC" ? SDPC : null
                                    }
                                    height={50}
                                    width={50}
                                />
                                <div className={styles.itemHeaderDetails}>
                                    <p className={styles.itemDepartment}>{data.Department}</p>
                                    <p className={styles.itemDate}>{formatDate(data?.createdAt)}</p>
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
                                <p dangerouslySetInnerHTML={{ __html: convertNewlines(data.Content, true) }} />
                            </div>
                        </div>
                    ))}
                  </div>
              </div>

              <div className={ activeTab === 'announcements' ? `${styles.announcementsContainer}` : `${styles.hide}`}>
                  <div className={styles.header}>
                      <h3 className={styles.subtitle}>Announcements</h3>
                      {session?.user?.role === 'Admin' ? <button className={styles.subtitleBTN} onClick={() => router.push('/login/authorized/'+Department+'/AddAnnouncement')}>Add Announcement</button> : ''}
                  </div>
                  <div className={styles.content}>
                    {AnnouncementsisLoading ? "Loading..." : Announcements?.map((data, index) => (
                        <div key={index} className={styles.AnnouncementsItem}>
                            <div className={styles.itemHeader}>
                                <Image className={styles.itemDeptImage} 
                                    src={
                                      data.Department === "Dental" ? Dental : 
                                      data.Department === "Medical" ? Medical :
                                      data.Department === "SDPC" ? SDPC : null
                                    }
                                    height={50}
                                    width={50}
                                />
                                <div className={styles.itemHeaderDetails}>
                                    <p className={styles.itemDepartment}>{data.Department}</p>
                                    <p className={styles.itemDate}>{formatDate(data?.createdAt)}</p>
                                </div>
                            </div>
                            <div className={styles.itemBody}>
                                <p className={styles.itemTitle}>{data.Title}</p>
                                <p dangerouslySetInnerHTML={{ __html: convertNewlines(data.Content, true) }} />
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
                      {session?.user?.role === 'Admin' ? <button className={styles.subtitleBTN} onClick={() => router.push('/login/authorized/'+Department+'/AddFAQ')}>Add FAQ</button> : ''}
                    </div>
                    <div className={styles.content}>
                        {FAQisLoading ? "Loading..." : FAQ?.map((data, index) => (
                            <div key={index} className={styles.faqsItem}>
                                <Image className={styles.faqImage} 
                                    src={
                                      data.Department === "Dental" ? Dental : 
                                      data.Department === "Medical" ? Medical :
                                      data.Department === "SDPC" ? SDPC : null
                                    }
                                    height={50}
                                    width={50}
                                />
                                <div className={styles.faqDetails}>
                                    <p className={styles.faqTitle}>{data.Department}</p>
                                    <details>
                                      <summary>{data.Title}</summary>
                                      <p className={styles.faqContent} dangerouslySetInnerHTML={{ __html: convertNewlines(data.Content, true) }} />
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
