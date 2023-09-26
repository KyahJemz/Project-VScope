import React from "react";
import styles from "./page.module.css";
import Link from "next/link";

const Dashboard = () => {
  // View Blogs
  // View Anns
  // View FAQ

  // Admin Post Blogs
  // Admin Post Announcements
  // Update FAQ


  return (
    <div className={styles.container}>
      <h3 className={styles.mainTitle}>Dashboard</h3>
      <div className={styles.tab}>
        <button>Blogs</button>
        <button>Announcements</button>
        <button>FAQ</button>
      </div>
      <div className={styles.blogsContainer}>

      </div>
      <div className={styles.announcementsContainer}>

      </div>
      <div className={styles.FAQContainer}>

      </div>
    </div>
  );
};

export default Dashboard;
