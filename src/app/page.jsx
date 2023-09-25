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

export default async function Home() {

    const fetcher = (...args) => fetch(...args).then((res) => res.json());

    const { data, mutate, error, isLoading } = useSWR(
      `/api/notices?department=`,
      fetcher
    );
  
    const sortedData = data && !isLoading
      ? [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(item => ({
        ...item,
        createdAt: formatDate(item.createdAt)
      }))
      : [];
  


        return (
            <div className={styles.mainContainer}>
         {isLoading ? "Loading..." : sortedData?.map(item=> (
                    <div className={styles.notice}>
                        <div className={styles.imageContainer}>
                            <Image 
                            src="" 
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
         }
