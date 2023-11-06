import React from 'react';
import styles from "./ActionConfirmation.module.css";

const ActionConfirmation = ({ title, content, onYes, onCancel }) => {
  return (
    <div className={styles.confirmationmodal}>
      <div className={styles.modalcontent}>
        <h2 className={styles.h2}>{title}</h2>
        <p className={styles.p}>{content}</p>
        <div className={styles.buttoncontainer}>
          <button className={styles.button} onClick={onYes}>Yes</button>
          <button className={styles.button} onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ActionConfirmation;