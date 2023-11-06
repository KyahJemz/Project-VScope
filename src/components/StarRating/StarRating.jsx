"use client"
import { useState } from 'react';
import styles from './StarRating.module.css'; // Import your CSS file for styling

const StarRating = ({Refresh, Email, blogId, averageRating }) => {
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleStarHover = (rating) => {
    setHoveredRating(rating);
  };

  const handleMouseLeave = () => {
    setHoveredRating(0);
  };

  const handleStarClick = async (rating) => {
    try {
        const formData = new FormData();
        formData.append("BlogId", blogId);
        formData.append("Id", Email);
        formData.append("Rating", rating);

        const response = await fetch("/api/ratings", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            console.log("Rated Successfully");
            Refresh();
        } else {
            console.log("Rating Failed");
        }
    } catch (err) {
        console.log(err);
    }
  };

  const stars = [1, 2, 3, 4, 5].map((star, index) => {
    const isFilled = star <= (hoveredRating || averageRating);

    return (
      <span
        key={index}
        className={isFilled ? styles.starFilled : styles.star}
        onMouseEnter={() => handleStarHover(star)}
        onClick={() => handleStarClick(star)}
      >
        ★
      </span>
    );
  });

  return (
    <div className={styles.starRatingContainer} onMouseLeave={handleMouseLeave}>
        <div className={styles.starsContainer}>Ratings:&nbsp;&nbsp; {stars}</div>
        <div className={styles.averageRating}>Average Rating: {averageRating}</div>
    </div>
  );
};

export default StarRating;
