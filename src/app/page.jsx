"use client"

import React, { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import useSWR from 'swr';
import Dental from "public/Dental.jpg";
import Medical from "public/Medical.jpg";
import SDPC from "public/SDPC.jpg";

// functn para sa Date Formatig
const formatDate = (timestamp) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(timestamp).toLocaleDateString(undefined, options);
    const hours = new Date(timestamp).getHours();
    const minutes = new Date(timestamp).getMinutes();
    const amOrPm = hours >= 12 ? 'pm' : 'am';
    const formattedTime = `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')}${amOrPm}`;
    return `${formattedDate} ${formattedTime}`;
  };


  const Home = () => {


    function convertNewlines(text, toHTML = false) {
        if (toHTML) {
          return text.replace(/\n/g, '<br />');
        } else {
          return text.replace(/<br \/>|<br\/>|<br>|<br\s\/>/g, '\n');
        }
      }

    const fetcher = (...args) => fetch(...args).then((res) => res.json());

    const { data: Blogs, mutate: Blogsmutate, error: Blogserror, isLoading: BlogsisLoading } = useSWR(
      `/api/blogs?department=`,
      fetcher
    );
    
    const { data: Announcements, mutate: Announcementsmutate, error: Announcementserror, isLoading: AnnouncementsisLoading } = useSWR(
      `/api/announcements?department=`,
      fetcher
    );
    
    const { data: FAQ, mutate: FAQmutate, error: FAQerror, isLoading: FAQisLoading } = useSWR(
      `/api/faqs?department=`,
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
            <h3 className={styles.mainTitle}>Home</h3>
  
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
  
  export default Home;