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

	const [activeTab, setActiveTab] = useState('Announcements');
	const [activeFAQTab, setActiveFAQTab] = useState('Dental');

	let sortedFAQ = [];

	if (!FAQisLoading) {
		sortedFAQ = FAQ.filter(item => item.Department === activeFAQTab);
	}
	
	const BlogsCode = () => {
		return ( <div>
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
							<p className={styles.itemDepartment}>{
								data.Department === "Dental" ? "Dental Health Services" : 
								data.Department === "Medical" ? "Medical Health Services" :
								data.Department === "SDPC" ? "Student Development And Placement Center" : null}</p>
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
		</div>)
	}

	const FAQCode = () => {
		return ( <div>
			<div className={styles.mainsubtab}>
				<p className={`${activeFAQTab === 'Dental' ? styles.active : ''} ${styles.tabsubbutton}`}
					onClick={() => setActiveFAQTab('Dental')}>DENTAL</p>
				<p className={`${activeFAQTab === 'Medical' ? styles.active : ''} ${styles.tabsubbutton}`}
					onClick={() => setActiveFAQTab('Medical')}>MEDICAL</p>
				<p className={`${activeFAQTab === 'SDPC' ? styles.active : ''} ${styles.tabsubbutton}`}
					onClick={() => setActiveFAQTab('SDPC')}>SDPC</p>
			</div>
			<div className={styles.content}>
				{FAQisLoading ? "Loading..." : sortedFAQ?.map((data, index) => (
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
		</div>)
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
						<div className={styles.content}>
							{<AnnouncementsCode />}
						</div>
					</div>

					<div className={ activeTab === 'FAQ' ? `${styles.FAQContainer}` : `${styles.hide}`}>
						{<FAQCode />}
					</div>
				</div>
			</div>
		</div>
	);
};
  
export default Home;