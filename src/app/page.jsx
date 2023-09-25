"use client"

import Image from "next/image";
import styles from "./page.module.css";
import useSWR from 'swr';

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


  const fetcher = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  const Home = () => {
    const { data, error } = useSWR(`/api/notices`, fetcher);
    
    if (error) {
      return <div>Error loading data</div>;
    }
  
    const sortedData = data
      ? data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((item) => ({
            ...item,
            createdAt: formatDate(item.createdAt),
          }))
      : [];
  
    return (
      <div className={styles.mainContainer}>
        {sortedData.map((item, index) => (
          <div key={index} className={styles.notice}>
            <div className={styles.imageContainer}>
                <Image 
                src='' 
                alt=""
                width={150}
                height={150}
                className={styles.image}
                />
            </div>
            <div className={styles.body}>
                <div className={styles.title}>{item.nTitle}</div>
                <div className={styles.author}>{item.nDepartment}</div>
                <div className={styles.content}>
                {item.nContent}
                </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default Home;