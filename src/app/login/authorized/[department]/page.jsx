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
  const date = new Date(timestamp);
  const formattedDate = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
  }).format(date);

  return formattedDate;
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

  const sorted_Blogs = Blogs && !BlogsisLoading
	? [...Blogs].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
		.map(item => ({
		...item,
		createdAt: formatDate(item.createdAt)
		}))
	: [];

	const sorted_Announcements = Announcements && !AnnouncementsisLoading
	? [...Announcements].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
		.map(item => ({
		...item,
		createdAt: formatDate(item.createdAt)
		}))
	: [];

	const sorted_FAQ = FAQ && !FAQisLoading
	? [...FAQ].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
		.map(item => ({
		...item,
		createdAt: formatDate(item.createdAt)
		}))
	: [];

  const [activeTab, setActiveTab] = useState('Announcements');

  const BlogsCode = () => {
		return ( <div>
			{BlogsisLoading ? "Loading..." : sorted_Blogs?.map((data, index) => (
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
							<p className={styles.itemDepartment}>{
								data.Department === "Dental" ? "Dental Health Services" : 
								data.Department === "Medical" ? "Medical Health Services" :
								data.Department === "SDPC" ? "Student Development And Placement Center" : null}</p>
							<p className={styles.itemDate}>{formatDate(data?.createdAt)}</p>
						</div>
					</div>
					<div className={styles.itemBodyBlogs}>
						{data?.Image && (
							<Image
								className={styles.blogImage}
								src={`/uploads/blogs/${data.Image}`}
								height={250}
								width={250}
							/>
						)}
            <div className={styles.itemBodyContent}>
              <p className={styles.itemTitle}>{data.Title}</p>
              <p dangerouslySetInnerHTML={{ __html: convertNewlines(data.Content, true) }} />
            </div>
					</div>
				</div>
			))}
		</div>)
	}

	const FAQCode = () => {
		return ( <div>
			<div className={styles.content}>
				{FAQisLoading ? "Loading..." : sorted_FAQ?.map((data, index) => (
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
		</div>)
	}

	const AnnouncementsCode = () => {
		return ( <div>
			{AnnouncementsisLoading ? "Loading..." : sorted_Announcements?.map((data, index) => (
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
		</div>)
	}


//{session?.user?.role === 'Admin'? <button className={styles.subtitleBTN} onClick={() => router.push('/login/authorized/'+Department+'/AddBlog')}>Add Blog</button> : ''}
 
if (status === 'loading') {
  return "Loading..."
}


  return (
    <div className={styles.mainContainer}>
    <div className={styles.mobileLayout}>
      <div className={styles.maintab}>
        <p className={`${activeTab === 'Blogs' ? styles.active : ''} ${styles.tabbutton}`}
          onClick={() => setActiveTab('Blogs')}>Blogs</p>
        <p className={`${activeTab === 'Announcements' ? styles.active : ''} ${styles.tabbutton}`}
          onClick={() => setActiveTab('Announcements')}>Announcements</p>
        <p className={`${activeTab === 'FAQ' ? styles.active : ''} ${styles.tabbutton}`}
          onClick={() => setActiveTab('FAQ')}>FAQ</p>
      </div>
      <div className={styles.mobileContainer}>
        {session?.user?.role === 'Admin' && (
          activeTab === 'Blogs' ? (
            <button className={styles.subtitleBTN} onClick={() => router.push(`/login/authorized/${Department}/AddBlogs`)}>Add Blog</button>
          ) : activeTab === 'Announcements' ? (
            <button className={styles.subtitleBTN} onClick={() => router.push(`/login/authorized/${Department}/AddAnnouncements`)}>Add Announcement</button>
          ) : activeTab === 'FAQ' && (
            <button className={styles.subtitleBTN} onClick={() => router.push(`/login/authorized/${Department}/AddFAQ`)}>Add FAQ</button>
          )
        )}

        {activeTab === 'Blogs' ? <BlogsCode /> : 
        activeTab === 'Announcements' ? <AnnouncementsCode /> :
        activeTab === 'FAQ' ? <FAQCode /> : null}

      </div>
    </div>
    <div className={styles.container}>
      <div className={styles.leftContainer}>
        <div className={styles.maintab}>
          <h3 className={`${styles.subtitle} ${styles.tabbutton}`}>Blogs</h3>
        </div>
        <div className={styles.blogsContainer}>
          {session?.user?.role === 'Admin'? <button className={styles.subtitleBTN} onClick={() => router.push('/login/authorized/'+Department+'/AddBlog')}>Add Blog</button> : ''}  
          <div className={styles.content}>
            {<BlogsCode />}
          </div>
        </div>
      </div>

      <div className={styles.rightContainer}>
        <div className={styles.maintab}>
          <p className={`${activeTab === 'Announcements' ? styles.active : ''} ${styles.tabbutton}`}
            onClick={() => setActiveTab('Announcements')}>Announcements</p>
          <p className={`${activeTab === 'FAQ' ? styles.active : ''} ${styles.tabbutton}`}
            onClick={() => setActiveTab('FAQ')}>FAQ</p>
        </div>

        <div className={ activeTab === 'Announcements' ? `${styles.announcementsContainer}` : `${styles.hide}`}>
        {session?.user?.role === 'Admin'? <button className={styles.subtitleBTN} onClick={() => router.push('/login/authorized/'+Department+'/AddAnnouncement')}>Add Announcement</button> : ''}  
          <div className={styles.content}>
            {<AnnouncementsCode />}
          </div>
        </div>

        <div className={ activeTab === 'FAQ' ? `${styles.FAQContainer}` : `${styles.hide}`}>
          {session?.user?.role === 'Admin'? <button className={styles.subtitleBTN} onClick={() => router.push('/login/authorized/'+Department+'/AddFAQ')}>Add FAQ</button> : ''}  
          {<FAQCode />}
        </div>
      </div>
    </div>
  </div>
  );
};

export default Dashboard;
