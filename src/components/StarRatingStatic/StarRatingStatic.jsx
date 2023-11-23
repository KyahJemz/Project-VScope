"use client"
import { useState } from 'react';
import styles from './StarRatingStatic.module.css'; // Import your CSS file for styling

const StarRatingStatic = ({ Email, blogId, averageRating, count}) => {
  const [hoveredRating, setHoveredRating] = useState(0);

  const stars = [1, 2, 3, 4, 5].map((star, index) => {
    const isFilled = star <= ( averageRating);

    return (
      <span
        key={index}
        className={isFilled ? styles.starFilled : styles.star}
      >
        ★
      </span>
    );
  });

  return (
    <div className={styles.starRatingContainer}>
        <div className={styles.starsContainer}>Ratings:&nbsp;&nbsp; {stars}</div>
        <div className={styles.averageRating}>Average rating of {averageRating} by {count} people.</div>
    </div>
  );
};

export default StarRatingStatic;
