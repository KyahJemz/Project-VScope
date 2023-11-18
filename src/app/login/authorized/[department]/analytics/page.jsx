"use client"

import React, { useState } from "react";
import styles from "./page.module.css";
import useSWR from "swr";
import PieChart from "@/components/PieChart/PieChart";
import LineChart from "@/components/LineChart/LineChart";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const Analytics = ({ params }) => {
  const Department = params.department;
  const [option, setOption] = useState ('day');
  const { data: session, status } = useSession();
  
  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const { data: SLC, mutate: SLCmutate, error: SLCserror, isLoading: SLCisLoading } = useSWR(
    `/api/charts?department=${encodeURIComponent(Department)}&query=countSLC&option=${option}&status=`,
    fetcher
  );

  const PieChartData = {
    labels: SLC?.label ? SLC.label : [],
    datasets: [
      {
        data: SLC?.counts ? SLC.counts : [],
        backgroundColor: ['#69c253', '#6453c2'], // Colors for each section
        hoverBackgroundColor: ['#69c2537c', '#6453c27c'],
      },
    ],
  };

  const { data: Canceled, mutate: Canceledmutate, error: Canceledserror, isLoading: CanceledisLoading } = useSWR(
    `/api/charts?department=${encodeURIComponent(Department)}&query=countStatus&option=${option}&status=Canceled`,
    fetcher
  );

  const LineChartCanceledData = {
    labels: Canceled?.label ? Canceled.label : [],
    datasets: [
      {
        label: 'Students',
        data: Canceled?.countsStudent ? Canceled.countsStudent : [],
        borderColor: '#69c253', // Color for the first dataset
        borderWidth: 1,
      },
      {
        label: 'Lay Collaborators',
        data: Canceled?.countsLayCollaborator ? Canceled.countsLayCollaborator : [],
        borderColor: '#6453c2', // Color for the second dataset
        borderWidth: 1,
      },
    ],
  };

  const { data: Completed, mutate: Completedmutate, error: Completedserror, isLoading: CompletedisLoading } = useSWR(
    `/api/charts?department=${encodeURIComponent(Department)}&query=countStatus&option=${option}&status=Completed`,
    fetcher
  );

  const LineChartCompletedData = {
    labels: Completed?.label ? Completed.label : [],
    datasets: [
      {
        label: 'Students',
        data: Completed?.countsStudent ? Completed.countsStudent : [],
        borderColor: '#69c253', // Color for the first dataset
        borderWidth: 1,
      },
      {
        label: 'Lay Collaborators',
        data: Completed?.countsLayCollaborator ? Completed.countsLayCollaborator : [],
        borderColor: '#6453c2', // Color for the second dataset
        borderWidth: 1,
      },
    ],
  };

  const { data: Approved, mutate: Approvedmutate, error: Approvedserror, isLoading: ApprovedisLoading } = useSWR(
    `/api/charts?department=${encodeURIComponent(Department)}&query=countStatus&option=${option}&status=Approved`,
    fetcher
  );

  const LineChartApprovedData = {
    labels: Approved?.label ? Approved.label : [],
    datasets: [
      {
        label: 'Students',
        data: Approved?.countsStudent ? Approved.countsStudent : [],
        borderColor: '#69c253', // Color for the first dataset
        borderWidth: 1,
      },
      {
        label: 'Lay Collaborators',
        data: Approved?.countsLayCollaborator ? Approved.countsLayCollaborator : [],
        borderColor: '#6453c2', // Color for the second dataset
        borderWidth: 1,
      },
    ],
  };

  const { data: Rejected, mutate: Rejectedmutate, error: Rejectedserror, isLoading: RejectedisLoading } = useSWR(
    `/api/charts?department=${encodeURIComponent(Department)}&query=countStatus&option=${option}&status=Rejected`,
    fetcher
  );

  const LineChartRejectedData = {
    labels: Rejected?.label ? Rejected.label : [],
    datasets: [
      {
        label: 'Students',
        data: Rejected?.countsStudent ? Rejected.countsStudent : [],
        borderColor: '#69c253', // Color for the first dataset
        borderWidth: 1,
      },
      {
        label: 'Lay Collaborators',
        data: Rejected?.countsLayCollaborator ? Rejected.countsLayCollaborator : [],
        borderColor: '#6453c2', // Color for the second dataset
        borderWidth: 1,
      },
    ],
  };

  const { data: Pending, mutate: Pendingmutate, error: Pendingerror, isLoading: PendingisLoading } = useSWR(
    `/api/charts?department=${encodeURIComponent(Department)}&query=countStatus&option=${option}&status=Pending`,
    fetcher
  );

  const LineChartPendingData = {
    labels: Pending?.label ? Pending.label : [],
    datasets: [
      {
        label: 'Students',
        data: Pending?.countsStudent ? Pending.countsStudent : [],
        borderColor: '#69c253', // Color for the first dataset
        borderWidth: 1,
      },
      {
        label: 'Lay Collaborators',
        data: Pending?.countsLayCollaborator ? Pending.countsLayCollaborator : [],
        borderColor: '#6453c2', // Color for the second dataset
        borderWidth: 1,
      },
    ],
  };

  if (status === 'loading') {
    return "Loading...";
  }

  if (session.user.role != "Admin") {
    redirect('/login/authorized/'+Department);
    return "Loading...";
  }


  return (
    <div className={styles.mainContainer}>
        <h3 className={styles.mainTitle}>Analytics</h3>
        <div className={styles.options}>
            <button className={styles.option} onClick={()=> setOption('day')}>Day</button>
            <button className={styles.option} onClick={()=> setOption('week')}>Week</button>
            <button className={styles.option} onClick={()=> setOption('month')}>Month</button>
            <button className={styles.option} onClick={()=> setOption('year')}>Year</button>
        </div>

        <div className={styles.container}>

          <div className={styles.leftpanel}>
              <div className={styles.PieChartContainer}>
                <p className={styles.chartTitle}>Category Chart</p>
                <PieChart data={PieChartData} />
              </div>
          </div>

          <div className={styles.rightpanel}>
              <div className={styles.LineChartContainer}>
                  <p className={styles.chartTitle}>Canceled</p>
                  <LineChart data={LineChartCanceledData} />
              </div>

              <div className={styles.LineChartContainer}>
                  <p className={styles.chartTitle}>Completed</p>
                  <LineChart data={LineChartCompletedData} />
              </div>

              <div className={styles.LineChartContainer}>
                  <p className={styles.chartTitle}>Approved</p>
                  <LineChart data={LineChartApprovedData} />
              </div>

              <div className={styles.LineChartContainer}>
                  <p className={styles.chartTitle}>Rejected</p>
                  <LineChart data={LineChartRejectedData} />
              </div>

              <div className={styles.LineChartContainer}>
                  <p className={styles.chartTitle}>Pending</p>
                  <LineChart data={LineChartPendingData} />
              </div>

          </div>

        </div>

    </div>
  );
};

export default Analytics;
