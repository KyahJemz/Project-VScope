"use client"

import React, { useState } from "react";
import useSWR from "swr";
import { useRouter  } from "next/navigation";
import styles from "./page.module.css";
import ActionConfirmation from "@/components/ActionConfirmation/ActionConfirmation";
import 'react-datepicker/dist/react-datepicker.css';


const Page = ({ params }) => {
	const Department = params.department;
	const router = useRouter();
	return (
		<div className={styles.MainContent}>	

		</div>
	)
};

export default Page;


