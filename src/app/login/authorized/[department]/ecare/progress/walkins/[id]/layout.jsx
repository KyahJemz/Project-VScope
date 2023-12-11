"use client"

import styles from "./page.module.css";
import React, {useState} from "react";

export default function RootLayout(prop) {
    const Department = prop.params.department;
    const [IsValidated, setIsValidated] = useState(false);
    const [IsValidating, setIsValidating] = useState(false);
    const [Note, setNote] = useState("");

    const Validate = async (e) => {
        e.preventDefault();
		setIsValidating(true);
		try {
            const formData = new FormData(e.target); 

            const response = await fetch("/api/password-verify", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                console.log("Complete");
                setIsValidated(true);
            } else {
                console.log("Failed");
                setIsValidated(false);
                setNote("Wrong password!")
            }
        } catch (err) {
            console.log(err);
		} finally {
			setIsValidating(false);
		}
    }

    return (
        <>
            {IsValidated ? (
                prop.children
            ) : (
                <>
                    <form onSubmit={Validate} className={styles.PasswordForm}>
                        <p className={styles.PasswordFormTitle}>Protected Page</p>
                        {Note !== "" ? <p className={styles.PasswordFormNote}>{Note}</p> : null}
                        <input placeholder="Password" className={styles.PasswordFormInput} name="Password" type="password" disabled={IsValidating}/>
                        <input name="Department" hidden type="text" value={Department}/>
                        <button className={styles.PasswordFormButton} disabled={IsValidating}>{IsValidating?"Validating...":"Verify"}</button>
                    </form>
                </>
            )}
        </>
    );
}
