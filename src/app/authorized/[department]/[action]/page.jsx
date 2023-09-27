"use client"

import React, { useState } from "react";
import styles from "./page.module.css";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";



const action = ({ params }) => {
  const Department = params.department;
  const Action = params.action;
  console.log(params);
  const { data: session, status } = useSession();
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  // if (status === "authenticated") {
  //   console.log('-----AUTHORIZED', session);
  //   if (session.UserData?.Department){
  //     if (Department != session.UserData.Department) {
  //       router.push('/authorized/'+session.UserData.Department);
  //     }
  //   } else {
  //     router.push('/services');
  //   }
  // }

  function convertNewlines(text, toHTML = false) {
    if (toHTML) {
      // Replace newlines with <br />
      return text.replace(/\n/g, '<br />');
    } else {
      // Replace newlines with \n
      return text.replace(/<br \/>|<br\/>|<br>|<br\s\/>/g, '\n');
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    var Title = '';
    var Image = '';
    var Content = '';

    if (Action === 'AddBlog') {
        Title = e.target[0].value;
        Image = e.target[1].files[0];;
        Content = convertNewlines(e.target[2].value, false);
    } else {
        Title = e.target[0].value;
        Content = convertNewlines(e.target[1].value, false);
    }
  
    try {
        setUploading(true);
        const formData = new FormData();
        formData.append("Title", Title);
        formData.append("Image", Image);
        formData.append("Content", Content);
        formData.append("Department", Department);

        var response = null;
        
        if (Action === 'AddBlog') {
            response = await fetch("/api/blogs", { method: "POST", body: formData });
        }

        if (Action === 'AddAnnouncement') {
            response = await fetch("/api/announcements", { method: "POST", body: formData });
        }

        if (Action === 'AddFAQ') {
            response = await fetch("/api/faqs", { method: "POST", body: formData });
        }
      
        setUploading(false);
        e.target.reset();

        if (response.ok) {
            console.log("Complete");
            router.push('/authorized/'+Department);
        } else {
            console.log("Failed");
        }
    } catch (err) {
        console.log(err);
    }
  };



    const AddBlogForm = () => {
        return (
            <form className={styles.form} onSubmit={handleSubmit} enctype="multipart/form-data">
                <h3 className={styles.title}>Blog Form</h3>
                <input 
                    type="text" 
                    placeholder="Title"
                    className={styles.input}
                    required
                />
                <input 
                    type="file" 
                    className={styles.input}
                />
                <textarea 
                    type="text" 
                    className={styles.input}
                    required
                    placeholder="Content"
                    cols="30"
                    rows="10"
                />
                <button className={styles.button} disabled={uploading}>{uploading ? "Uploading..." : "Upload"}</button>
            </form>
        );
    }

    const AddAnnouncementForm = () => {
        return (
            <form className={styles.form} onSubmit={handleSubmit}>
                <h3 className={styles.title}>Announcement Form</h3>
                <input 
                    type="text" 
                    placeholder="Title"
                    className={styles.input}
                    required
                />
                <textarea 
                    type="text" 
                    className={styles.input}
                    required
                    placeholder="Content"
                    cols="30"
                    rows="10"
                />
                <button className={styles.button} disabled={uploading}>{uploading ? "Uploading..." : "Upload"}</button>
            </form>
        );
    }

    const AddFAQForm = () => {
        return  (
            <form className={styles.form} onSubmit={handleSubmit}>
                <h3 className={styles.title}>FAQ Form</h3>
                <input 
                    type="text" 
                    placeholder="Title"
                    className={styles.input}
                    required
                />
                <textarea 
                    type="text" 
                    className={styles.input}
                    required
                    placeholder="Content"
                    cols="30"
                    rows="10"
                />
                <button className={styles.button} disabled={uploading}>{uploading ? "Uploading..." : "Upload"}</button>
            </form>
        );
    }

    function InitializeAction () {
        if (Department === 'Medical' || Department === 'SDPC' || Department === 'Dental') {
            if (Action === 'AddBlog') {
                return AddBlogForm();
            } else if (Action === 'AddAnnouncement') {
                return AddAnnouncementForm();
            } else if (Action === 'AddFAQ') {
                return AddFAQForm();
            } else {
                return notFound();
            }
        }else {
            return notFound();
        }
    }
  
    return (
        <div className={styles.mainContainer}>
          <a href={'/authorized/' + Department} className={styles.back}>
            &lt; Back
          </a>
          {InitializeAction()}
        </div>
      );
};

export default action;