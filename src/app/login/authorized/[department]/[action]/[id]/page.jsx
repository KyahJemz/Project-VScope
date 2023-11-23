"use client"

import { useEffect, useState } from 'react';
import styles from "./page.module.css";
import { useRouter } from 'next/navigation';
import { notFound } from "next/navigation";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const action = ({ params }) => {
    const Department = params.department;
    const [file, setFile] = useState(null);
    const Action = params.action;
    const Id = params.id;
    const [uploading, setUploading] = useState(false);
    const { data: session, status } = useSession();
    const router = useRouter();
    const [data, setData] = useState({
      Title: '',
      Content: '',
    });
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/${Action.toLowerCase()}s/read?id=${Id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
  
          const result = await response.json();
          setData(result);
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchData();
    }, [Action, Id]);
  
    if (status === 'loading') {
      return 'Loading...';
    }
  
    if (session.user.role !== 'Admin') {
      redirect(`/login/authorized/${Department}`);
      return 'Loading...';
    }
  
    function convertNewlines(text, toHTML = false) {
      if (toHTML) {
        return text.replace(/\n/g, '<br />');
      } else {
        return text.replace(/<br \/>|<br\/>|<br>|<br\s\/>/g, '\n');
      }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        var Title = '';
        var Content = '';

        if (Action === 'AddBlog') {
            Title = e.target[0].value;
            Content = convertNewlines(e.target[2].value, false);
        } else {
            Title = e.target[0].value;
            Content = convertNewlines(e.target[1].value, false);
        }
    
        try {
            setUploading(true);
            const formData = new FormData();
            formData.append("Title", Title);
            formData.set("Image", file);
            formData.append("Content", Content);
            formData.append("Department", Department);

            var response = null;
            
            if (Action === 'AddBlog') {
                response = await fetch("/api/blogs/edit", { method: "POST", body: formData });
            }

            if (Action === 'AddAnnouncement') {
                response = await fetch("/api/announcements/edit", { method: "POST", body: formData });
            }

            if (Action === 'AddFAQ') {
                response = await fetch("/api/faqs/edit", { method: "POST", body: formData });
            }
        
            setUploading(false);
            e.target.reset();

            if (response.ok) {
                console.log("Complete");
                router.push('/login/authorized/'+Department);
            } else {
                console.log("Failed");
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        var Title = '';
        var Content = '';

        if (Action === 'Blog') {
            Title = e.target[0].value;
            Content = convertNewlines(e.target[2].value, false);
        } else {
            Title = e.target[0].value;
            Content = convertNewlines(e.target[1].value, false);
        }
    
        try {
            setUploading(true);
            const formData = new FormData();
            formData.append("id", Id);
            formData.append("Title", Title);
            formData.set("Image", file);
            formData.append("Content", Content);

            var response = null;
            
            if (Action === 'Blog') {
                response = await fetch("/api/blogs/edit", { method: "POST", body: formData });
            }

            if (Action === 'Announcement') {
                response = await fetch("/api/announcements/edit", { method: "POST", body: formData });
            }

            if (Action === 'FAQ') {
                response = await fetch("/api/faqs/edit", { method: "POST", body: formData });
            }
        
            setUploading(false);
            e.target.reset();

            if (response && response.ok) {
                console.log("Complete");
                router.push('/login/authorized/' + Department);
            } else {
                console.log("Failed");
            }
        } catch (err) {
            console.log(err);
        }
    };


    const EditBlogForm = () => {
        return (
            <form className={styles.form} onSubmit={handleUpdate} encType="multipart/form-data">
                <h3 className={styles.title}>Blog Form</h3>
                <input 
                    type="text" 
                    placeholder="Title"
                    className={styles.input}
                    defaultValue={data.Title}
                    required
                />
                <input 
                    name="Image"
                    type="file" 
                    onChange={(e) => setFile (e.target.files?.[0])}
                    className={styles.input}
                    hidden
                />
                <textarea 
                    type="text" 
                    className={styles.input}
                    defaultValue={data.Content}
                    required
                    placeholder="Content"
                    cols="30"
                    rows="10"
                />
                <button className={styles.button} disabled={uploading}>{uploading ? "Uploading..." : "Upload"}</button>
            </form>
        );
    }

    const EditAnnouncementForm = () => {
        return (
            <form className={styles.form} onSubmit={handleUpdate}>
                <h3 className={styles.title}>Announcement Form</h3>
                <input 
                    type="text" 
                    placeholder="Title"
                    className={styles.input}
                    defaultValue={data.Title}
                    required
                />
                <textarea 
                    type="text" 
                    className={styles.input}
                    required
                    defaultValue={data.Content}
                    placeholder="Content"
                    cols="30"
                    rows="10"
                />
                <button className={styles.button} disabled={uploading}>{uploading ? "Uploading..." : "Upload"}</button>
            </form>
        );
    }

    const EditFAQForm = () => {
        return  (
            <form className={styles.form} onSubmit={handleUpdate}>
                <h3 className={styles.title}>FAQ Form</h3>
                <input 
                    type="text" 
                    placeholder="Title"
                    className={styles.input}
                    defaultValue={data.Title}
                    required
                />
                <textarea 
                    type="text" 
                    className={styles.input}
                    required
                    defaultValue={data.Content}
                    placeholder="Content"
                    cols="30"
                    rows="10"
                />
                <button className={styles.button} disabled={uploading}>{uploading ? "Uploading..." : "Upload"}</button>
            </form>
        );
    }


    function InitializeAction() {
        if (Department === 'Medical' || Department === 'SDPC' || Department === 'Dental') {
          if (Action === 'Blog') {
            return <EditBlogForm />;
          } else if (Action === 'Announcement') {
            return <EditAnnouncementForm />;
          } else if (Action === 'FAQ') {
            return <EditFAQForm />;
          } else {
            return notFound();
          }
        } else {
          return notFound();
        }
      }
    
  
    return (
        <div className={styles.mainContainer}>
          <a href={'/login/authorized/' + Department} className={styles.back}>&lt; Back</a>
          {InitializeAction()}
        </div>
      );
};

export default action;
