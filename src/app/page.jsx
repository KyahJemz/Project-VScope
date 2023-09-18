import Image from "next/image";
import styles from "./page.module.css";

async function getData() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts', { 
      cache: 'no-store' 
  })
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
 
  return res.json()
}

export default async function Home() {
    const data = await getData();
        return (
            <div className={styles.mainContainer}>
                {data.map(item=> (
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
                            <div className={styles.title}>{item.title}</div>
                            <div className={styles.author}>1321313</div>
                            <div className={styles.content}>
                                {item.body}
                            </div>
                        </div>
                    </div>
                ))}
        </div>
    );
}
