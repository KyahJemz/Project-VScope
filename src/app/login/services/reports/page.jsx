"use client"

import React, { useState, useEffect } from "react";
import useSWR from "swr";
import styles from "./page.module.css"
import PieChart from "@/components/PieChart/PieChart";
import LineChart from "@/components/LineChart/LineChart";
import { useSession } from "next-auth/react";

const Page = () => {
  const { data: session, status } = useSession();
	const [GoogleEmail, setGoogleEmail] = useState("");
	const [Role, setRole] = useState("");
	useEffect(() => {
	  if (status === "authenticated" && session?.user?.email) {
		setGoogleEmail(session.user.email);
		setRole(session.user.role);
	  }
	}, [status, session]);

  const [Panel, setPanel] = useState("Diagnosis");
  const [Filter, setFilter] = useState("Week");
  const [Department, setDepartment] = useState("Medical");

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  
	const { data, mutate, error, isLoading } = useSWR(
	  `/api/reports?Department=${encodeURIComponent(Department)}&Type=Client&GoogleEmail=${encodeURIComponent(GoogleEmail)}`,
	  fetcher
	);

  const StatusPieChartData = {
		labels: ["Approved","Canceled","Pending"],
		datasets: [
		{
			data: [data?.ChartStatus?.Approved??0, data?.ChartStatus?.Canceled??0, data?.ChartStatus?.Pending??0],
			backgroundColor: ['#AFF4C6', '#F24822', '#FFCD29'], 
			hoverBackgroundColor: ['#AFF4C67c','#F248227c','#FFCD297c'],
		},
		],
	};

  const DiagnosisPieChartData = {
    labels: data?.TopDiagnosis?.map(item => item.Diagnosis) ?? [],
    datasets: [
      {
        data: data?.TopDiagnosis?.map(item => item.Count) ?? [],
        backgroundColor: Array.from({ length: 10 }, (_, index) => `#${Math.floor(Math.random()*16777215).toString(16)}`),
        hoverBackgroundColor: "#ffffff80",
      },
    ],
  };

  const PrescriptionPieChartData = {
    labels: data?.TopPrescriptions?.map(item => item.Prescription) ?? [],
    datasets: [
      {
        data: data?.TopPrescriptions?.map(item => Number(item.Count)) ?? [],
        backgroundColor: Array.from({ length: 10 }, (_, index) => `#${Math.floor(Math.random()*16777215).toString(16)}`),
        hoverBackgroundColor: "#ffffff80",
      },
    ],
  };

  const PatientsLineChartData = {
		labels: data?.PatientsSummary[Filter].Legend,
		datasets: [
		{
			label: '',
			data: data?.PatientsSummary[Filter].Data,
			borderColor: '#14AE5C', 
			borderWidth: 1,
		},
		],
	};
    if (!isLoading) {
      console.log(data)
    }

    return (
      <div className={styles.MainContainer}>

        <div className={styles.Header}>
          <select className={styles.DepartmentSelection} defaultValue={Department} onChange={(e)=>setDepartment(e.target.value)}>
            <option value="Medical">Medical</option>
            <option value="Dental">Dental</option>
            {Role === "Student" ? <option value="SDPC">SDPC</option> : null}
          </select>
          {Department} Reports
        </div>

        <div className={styles.StatusContainer}>
          <div className={styles.StatusPieChartData}>
            <PieChart data={StatusPieChartData} />
          </div>
          <div className={styles.StatusCountContainer}>
            <p className={styles.StatusName}>Approved</p>
            <p className={styles.StatusCount}>{data?.ChartStatus?.Approved??0}</p>
          </div>
          <div className={styles.StatusCountContainer}>
            <p className={styles.StatusName}>Canceled</p>
            <p className={styles.StatusCount}>{data?.ChartStatus?.Canceled??0}</p>
          </div>
          <div className={styles.StatusCountContainer}>
            <p className={styles.StatusName}>Pending</p>
            <p className={styles.StatusCount}>{data?.ChartStatus?.Pending??0}</p>
          </div>
        </div>

        <div className={styles.ChartsContainer}>
          <div className={styles.LineChartContainer}>
            <div className={styles.PatientsLineChartData}>
              <LineChart data ={PatientsLineChartData} />
            </div>
            <div className={styles.LineChartButtons}>
              <button className={`${styles.FilterBtn} ${Filter === "Week" ? styles.Active : null}`} onClick={() => setFilter("Week")}>Weeks</button>
              <button className={`${styles.FilterBtn} ${Filter === "Month" ? styles.Active : null}`} onClick={() => setFilter("Month")}>Months</button>
              <button className={`${styles.FilterBtn} ${Filter === "Year" ? styles.Active : null}`} onClick={() => setFilter("Year")}>Year</button>
            </div>
            <div className={styles.LineChartCards}>
              <div className={styles.LineChartCard}>
                <div className={styles.LineChartCardTitle}>Cleared</div>
                <div className={styles.LineChartCardValue}>{data?.ChartSystem?.Successful || 0}</div>
              </div>
              <div className={styles.LineChartCard}>
                <div className={styles.LineChartCardTitle}>Advised</div>
                <div className={styles.LineChartCardValue}>{data?.ChartSystem?.Advised || 0}</div>
              </div>
              <div className={styles.LineChartCard}>
                <div className={styles.LineChartCardTitle}>Re Schedule</div>
                <div className={styles.LineChartCardValue}>{data?.ChartSystem?.ReScheduled || 0}</div>
              </div>
            </div>
          </div>
          <div className={styles.PieChartContainer}>
            {Panel === "Diagnosis" ? 
              <>
                <div className={styles.PieChartData}>
                  <PieChart data={DiagnosisPieChartData} />
                </div>
                <div className={styles.PieChartDataRanking}>
                  {data?.TopDiagnosis?.length > 0 ? (
                    data.TopDiagnosis.map((item, index) => (
                      <div className={styles.RankingRow} key={index}>
                        <div className={styles.RankingName}>{item.Diagnosis}</div>
                        <div className={styles.RankingProgress}>
                          <progress
                            className={styles.ProgressBar}
                            max={data.TopDiagnosis[0].Count || 0}
                            value={item.Count || 0}
                          ></progress>
                        </div>
                        <div className={styles.RankingValue}>{item.Count}</div>
                      </div>
                    ))
                  ) : (
                    <p>No Records to show...</p>
                  )}

                </div>
              </>
            : 
              <>
                <div className={styles.PieChartData}>
                  <PieChart data={PrescriptionPieChartData} />
                </div>
                <div className={styles.PieChartDataRanking}>
                  {data?.TopPrescriptions?.length > 0 ? (
                    data.TopPrescriptions.map((item, index) => (
                      <div className={styles.RankingRow} key={index}>
                        <div className={styles.RankingName}>{item.Prescription}</div>
                        <div className={styles.RankingProgress}>
                          <progress
                            className={styles.ProgressBar}
                            max={Number(data.TopPrescriptions[0].Count) || 0}
                            value={Number(item.Count) || 0}
                          ></progress>
                        </div>
                        <div className={styles.RankingValue}>{item.Count}</div>
                      </div>
                    ))
                  ) : (
                    <p>No Records to show...</p>
                  )}
                </div>
              </>
            }
            <div className={styles.PieChartDataButtons}>
              <button className={`${styles.PanelBtn} ${Panel === "Diagnosis" ? styles.Active : null}`} onClick={() => setPanel("Diagnosis")}>Diagnosis</button>
              <button className={`${styles.PanelBtn}  ${Panel === "Prescriptions" ? styles.Active : null}`} onClick={() => setPanel("Prescriptions")}>Prescriptions</button>
            </div>
          </div>
        </div>

      </div>
    );

}

export default Page;