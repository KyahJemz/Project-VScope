"use client"

import React, { useState } from 'react';
import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";
import Button from '@/components/Button/Button';

const Login = () => {
  const [activePanel, setActivePanel] = useState('clientPanel');

  const handlePanelChange = (panel) => {
    console.log("changed" + panel);
    setActivePanel(panel);
  };

  return (
    <div className={styles.container}>
      <div
        className={`${activePanel === 'adminPanel' ? styles.visible : styles.panel}`}>
        <h2 className={styles.title}>Admin panel</h2>
        <form className='form'>
          <input 
            type="text" 
            placeholder='Username'
            className={styles.input}
            required
          />
          <input 
            type="password" 
            placeholder='Password'
            className={styles.input}
            required
          />
          <button className={`${styles.input} ${styles.button}`}>Sign up</button>
        </form>
      </div>
      <div
        className={`${activePanel === 'staffPanel' ? styles.visible : styles.panel}`}>
        <h2 className={styles.title}>Staff panel</h2>
        <form className='form'>
          <input 
            type="text" 
            placeholder='Username'
            className={styles.input}
            required
          />
          <input 
            type="password" 
            placeholder='Password'
            className={styles.input}
            required
          />
          <button className={`${styles.input} ${styles.button}`}>Sign up</button>
        </form>
      </div>
      <div
        className={`${activePanel === 'clientPanel' ? styles.visible : styles.panel}`}>
        <h2 className={styles.title}>Client panel</h2>
        <button className={styles.googlesignin} onClick={() => console.log('Sign in using SSSC Email')}>
          Sign in using SSSC Email
        </button>
      </div>

      <p className={styles.options}>Login as  
        <a className={styles.option} onClick={() => handlePanelChange('adminPanel')}>Admin,</a>
        <a className={styles.option} onClick={() => handlePanelChange('staffPanel')}>Staff,</a>
        <a className={styles.option} onClick={() => handlePanelChange('clientPanel')}>Client</a>
      </p>
    </div>
  );
};

export default Login;

