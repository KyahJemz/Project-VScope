"use client"

import React from "react";
import styles from "./page.module.css"
import { useRouter } from "next/navigation";

const Layout = (param) => {
    console.log(param)
    const router = new useRouter();
    const Department = param.params.department;

    if (param.params.department !== "Medical" && param.params.department !== "Dental" && param.params.department !== "SDPC" && param.params.department !== "Accounts") {
        router.push("/login/administrator/management/Accounts");
    }
    return ( 
        <div className={styles.mainContainer}>
            <div className={styles.MiniNav}>  
                <div className={styles.MiniNavTop}>
                    <select className={styles.DepartmentSelection} name="" id="" defaultValue={Department} onChange={(e)=>router.push("/login/administrator/management/"+e.target.value)}>
                        <option value="Accounts">Accounts</option>
                        <option value="Medical">Medical</option>
                        <option value="Dental">Dental</option>
                        <option value="SDPC">SDPC</option>
                    </select>
                    <p className={`${styles.MiniNavText}`}>{Department} Management</p>
                </div>
            </div>  

            {param.children}
            
        </div>
    )
};

export default Layout;