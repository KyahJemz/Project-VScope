"use client"

import React, { useState } from "react";
import styles from "./page.module.css";
import { useRouter } from 'next/navigation';
import useSWR from "swr";
import Image from "next/image";
import Dental from "public/Dental.jpg";
import Medical from "public/Medical.jpg";
import SDPC from "public/SDPC.jpg";
import PieChart from "@/components/PieChart/PieChart";
import LineChart from "@/components/LineChart/LineChart";

const Dashboard = ({ params }) => {
	const Department = params.department;
	console.log(params);
	const router = useRouter();


	const fetcher = (...args) => fetch(...args).then((res) => res.json());

	const { data, mutate, error, isLoading } = useSWR(
		`/api/blogs?department=${encodeURIComponent(Department)}`,
		fetcher
	);
	
	const StatusPieChartData = {
		labels: [5,5,5,5],
		datasets: [
		{
			data: [5,5,5,5],
			backgroundColor: ['#69c253', '#6453c2'], 
			hoverBackgroundColor: ['#69c2537c', '#6453c27c'],
		},
		],
	};

	const SystemPieChartData = {
		labels: [5,5,5,5],
		datasets: [
		{
			data: [5,5,5,5],
			backgroundColor: ['#69c253', '#6453c2'], 
			hoverBackgroundColor: ['#69c2537c', '#6453c27c'],
		},
		],
	};

	const PatientsLineChartData = {
		labels: ["Students", "Lay Collaborators"],
		datasets: [
		{
			label: 'Students',
			data: [],
			borderColor: '#69c253', // Color for the first dataset
			borderWidth: 1,
		},
		{
			label: 'Lay Collaborators',
			data: [],
			borderColor: '#6453c2', // Color for the second dataset
			borderWidth: 1,
		},
		],
	};

	return (
		<div className={styles.MainContainer}>



			<div className={styles.StatusChart}>
				<div className={styles.StatusPieChartContainer}>
					<p className={styles.chartTitle}>Status Chart</p>
					<PieChart data={StatusPieChartData} />
				</div>
				<div className={styles.StatusContainer}>
					<p className={styles.StatusName}>Completed</p>
					<p className={styles.StatusCount}>0</p>
				</div>
				<div className={styles.StatusContainer}>
					<p className={styles.StatusName}>Approved/In Progress</p>
					<p className={styles.StatusCount}>0</p>
				</div>
				<div className={styles.StatusContainer}>
					<p className={styles.StatusName}>Canceled</p>
					<p className={styles.StatusCount}>0</p>
				</div>
				<div className={styles.StatusContainer}>
					<p className={styles.StatusName}>Pending</p>
					<p className={styles.StatusCount}>0</p>
				</div>
				<div className={styles.StatusContainer}>
					<p className={styles.StatusName}>Rejected</p>
					<p className={styles.StatusCount}>0</p>
				</div>
				<div className={styles.StatusContainer}>
					<p className={styles.StatusName}>Advising</p>
					<p className={styles.StatusCount}>0</p>
				</div>
			</div>



			<div className={styles.DailyChart}>
				<div className={styles.LineChartContainer}>
					<p className={styles.chartTitle}>Patients</p>
					<LineChart data={PatientsLineChartData} />
				</div>
				<div className={styles.FilterButtons}>
					<button>Today</button>
					<button>Yesterday</button>
					<button>Week</button>
					<button>Month</button>
					<button>Year</button>
				</div>
			</div>



			<div className={styles.OverviewChart}>
				<div className={styles.OverviewContainer}>
					<p className={styles.OverviewHeader}>Overview</p>
					<table className={styles.OverviewTable}></table>
				</div>
				<div className={styles.DiagnosticsBarContainer}>
					<p className={styles.DiagnosticsBarHeader}>Highest Rate of Diagnosis</p>
					{/* <PieChart data={SystemPieChartData} /> HORIZAONTAL BAR*/}
				</div>
				<div className={styles.DiagnosticsPieContainer}>
					{/* <PieChart data={SystemPieChartData} /> HORIZAONTAL BAR*/}
				</div>
				<div className={styles.DiagnosticsSummaryContainer}>
					
				</div>
			</div>



			<div className={styles.SystemChart}>
				<div className={styles.SystemPieChartContainer}>
					<p className={styles.chartTitle}>System Chart</p>
					<PieChart data={SystemPieChartData} />
				</div>
				<div className={styles.SystemDetailsContainer}>
					<div className={styles.SystemDetailsCard}>
						<p className={styles.SystemDetailsTitle}>Successful</p>
						<div className={styles.SystemDetailsValue}>0</div>
					</div>
					<div className={styles.SystemDetailsCard}>
						<p className={styles.SystemDetailsTitle}>Successful</p>
						<div className={styles.SystemDetailsValue}>0</div>
					</div>
					<div className={styles.SystemDetailsCard}>
						<p className={styles.SystemDetailsTitle}>Successful</p>
						<div className={styles.SystemDetailsValue}>0</div>
					</div>
				</div>
				<div className={styles.PrescriptionContainer}>
					<p className={styles.PrescriptionHeader}>Prescriptions</p>
					{/* <PieChart data={SystemPieChartData} /> HORIZAONTAL BAR*/}
				</div>
				<div className={styles.ServiceContainer}>
					<p className={styles.ServiceHeader}>Service Rendered</p>
					{/* <PieChart data={SystemPieChartData} /> HORIZAONTAL BAR*/}
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
