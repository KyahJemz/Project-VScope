"use client"

import React, { useState, useEffect } from "react";
import useSWR from "swr";
import styles from "./page.module.css"
import PieChart from "@/components/PieChart/PieChart";
import LineChart from "@/components/LineChart/LineChart";
import { Data } from "@/models/Data";

const Page = ({ params }) => {
	const Department = params.department;

  const [Panel, setPanel] = useState("Prescription");
  const [Filter, setFilter] = useState("Week");
  const [Course, setCourse] = useState("All");
  const [YearLevel, setYearLevel] = useState("All");

  const [ChartPatients, setChartPatients] = useState("All");
  const [ChartGender, setChartGender] = useState("All");
  const [ChartSessions, setChartSessions] = useState("All");

  const [ChartPatientsCount, setChartPatientsCount] = useState("0");
  const [ChartGenderCount, setChartGenderCount] = useState("0");
  const [ChartSessionsCount, setChartSessionsCount] = useState("0");

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  
	const { data, mutate, error, isLoading } = useSWR(
	  `/api/reports?Department=${encodeURIComponent(Department)}&Type=Department&Course=${encodeURIComponent(Course)}&YearLevel=${encodeURIComponent(YearLevel)}`,
	  fetcher
	);

  useEffect(() => {
    if (!isLoading && data) {
      setChartPatientsCount(data?.TotalPatients?.All);
      setChartGenderCount(data?.TotalGender?.All);
      setChartSessionsCount(data?.TotalServiceSession?.All);
    }
  }, [data, isLoading]);

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

  const ServicesPieChartData = {
    labels: data?.TopServices?.map(item => item.Service) ?? [],
    datasets: [
      {
        data: data?.TopServices?.map(item => Number(item.Count)) ?? [],
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
          </div>

          <div className={styles.Overview}>
            <div className={styles.OverviewTitle}>
              OVERVIEW
            </div>
            <div className={styles.OverviewTableContainer}>

                <div className={`${styles.OverviewTable} ${styles.TableBorder}`}>
                  <div className={styles.OverviewYearLevel}>
                    <p>Year Level:</p>
                    <select value={YearLevel} onChange={(e)=>setYearLevel(e.target.value)} className={styles.OverviewTableHeaderSelectInput}>
                      <option value="All">All</option>
                      {Data.YearLevel.map((element, index) => (
                        <option key={index} value={element}>{element}</option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.OverviewCourse}>
                    <p>Course:</p>
                    <select value={Course} onChange={(e)=>setCourse(e.target.value)} className={styles.OverviewTableHeaderSelectInput}>
                      <option value="All">All</option>
                      {Data.Courses.map((element, index) => (
                        <option key={index} value={element}>{element}</option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.OverviewHeader}>
                    <p className={``}>Diagnosis</p>
                    <p className={``}>Number of Patients</p>
                    <p className={``}>Gender</p>
                    <p className={``}>Services used</p>
                    <p className={`${styles.OverviewHeaderLast}`}>Top Prescriptions</p>
                  </div>
                  <div className={styles.OverviewBody}>
                    {data?.TableSets?.length > 0 ? (
                        data.TableSets.map((item, index) => (
                          <>
                            <p className={``}>{item.Diagnosis}</p>
                            <p className={``}>{item.Patients}</p>
                            <p className={``}>{item.Gender}</p>
                            <p className={``}>{item.Service}</p>
                            <p className={``}>{item.Prescriptions}</p>

                          </>
                        ))
                      ) : (
                        <>
                          <p className={``}>no data</p>
                          <p className={``}>no data</p>
                          <p className={``}>no data</p>
                          <p className={``}>no data</p>
                          <p className={``}>no data</p>
                        </>
                      )}
                  </div>

                </div>



            </div>
            <div className={styles.OverviewChart}>
              <div className={styles.PieChartDataRankingOverviewChart}>
                <div className={styles.PieChartDataRankingTitleOverviewChart}>
                    {Department === "Medical" ? "Highest Rate of Diagnosis" 
                    : Department === "Dental" ? "Highest Rate of Oral Health Conditions" 
                    : Department === "SDPC" ? "Highest Rate of Diagnosis" 
                    : ""
                    } 
                </div>
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
                  <p className={styles.Notes}>No Records to show...</p>
                )}
              </div>
            </div>

            <div className={styles.OverviewOthers}>
              <div className={styles.OverviewOthersPieChartData}>
                <PieChart data={DiagnosisPieChartData} />
              </div>

              <div className={styles.OverviewOthersMiniCard}>
                <p className={styles.OverviewOthersMiniCardTitle}>Total service to Patients</p>
                <div className={styles.MiniCardDetails}>
                  <div className={styles.MiniCardCount}>{ChartPatientsCount}</div>
                  <div className={styles.MiniCardButtons}>
                    <button className={`${styles.MiniCardBtn} ${ChartPatients === "Students" ? styles.Active : null}`} onClick={() => {
                      ChartPatients === "Students"
                        ? (setChartPatients("All"), setChartPatientsCount(data?.TotalPatients?.All??0))
                        : (setChartPatients("Students"), setChartPatientsCount(data?.TotalPatients?.Students??0));
                    }}><div className={styles.MiniCardColor1}></div>Students</button>
                    <button className={`${styles.MiniCardBtn} ${ChartPatients === "Lay Collaborators" ? styles.Active : null}`} onClick={() => {
                      ChartPatients === "Lay Collaborators"
                        ? (setChartPatients("All"), setChartPatientsCount(data?.TotalPatients?.All??0))
                        : (setChartPatients("Lay Collaborators"), setChartPatientsCount(data?.TotalPatients["Lay Collaborators"]??0));
                    }}><div className={styles.MiniCardColor2}></div>Lay Collaborators</button>
                  </div>
                </div>
              </div>

              <div className={styles.OverviewOthersMiniCard}>
                <p className={styles.OverviewOthersMiniCardTitle}>Gender / Sex</p>
                <div className={styles.MiniCardDetails}>
                  <div className={styles.MiniCardCount}>{ChartGenderCount}</div>
                  <div className={styles.MiniCardButtons}>
                    <button className={`${styles.MiniCardBtn} ${ChartGender === "Male" ? styles.Active : null}`} onClick={() => {
                      ChartGender === "Male"
                        ? (setChartGender("All"), setChartGenderCount(data?.TotalGender?.All??0))
                        : (setChartGender("Male"), setChartGenderCount(data?.TotalGender?.Male??0));
                    }}>
                      <div className={styles.MiniCardColor1}></div>Male</button>
                    <button className={`${styles.MiniCardBtn} ${ChartGender === "Female" ? styles.Active : null}`} onClick={() => {
                      ChartGender === "Female"
                        ? (setChartGender("All"), setChartGenderCount(data?.TotalGender?.All??0))
                        : (setChartGender("Female"), setChartGenderCount(data?.TotalGender?.Female??0));
                    }}>
                      <div className={styles.MiniCardColor2}></div>Female</button>
                  </div>
                </div>
              </div>

              <div className={styles.OverviewOthersMiniCard}>
                <p className={styles.OverviewOthersMiniCardTitle}>Service sessions per</p>
                <div className={styles.MiniCardDetails}>
                  <div className={styles.MiniCardCount}>{ChartSessionsCount}</div>
                  <div className={styles.MiniCardButtons}>
                  <button className={`${styles.MiniCardBtn} ${ChartSessions === "Week" ? styles.Active : null}`} onClick={() => {
                      ChartSessions === "Week"
                        ? (setChartSessions("All"), setChartSessionsCount(data?.TotalServiceSession?.All??0))
                        : (setChartSessions("Week"), setChartSessionsCount(data?.TotalServiceSession?.Week??0));
                    }}>
                      <div className={styles.MiniCardColor1}></div>Week</button>
                    <button className={`${styles.MiniCardBtn} ${ChartSessions === "Month" ? styles.Active : null}`} onClick={() => {
                      ChartSessions === "Month"
                        ? (setChartSessions("All"), setChartSessionsCount(data?.TotalServiceSession?.All??0))
                        : (setChartSessions("Month"), setChartSessionsCount(data?.TotalServiceSession?.Month??0));
                    }}>
                      <div className={styles.MiniCardColor2}></div>Month</button>
                    <button className={`${styles.MiniCardBtn} ${ChartSessions === "Year" ? styles.Active : null}`} onClick={() => {
                      ChartSessions === "Year"
                        ? (setChartSessions("All"), setChartSessionsCount(data?.TotalServiceSession?.All??0))
                        : (setChartSessions("Year"), setChartSessionsCount(data?.TotalServiceSession?.Year??0));
                    }}>
                      <div className={styles.MiniCardColor3}></div>Year
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>







          <div className={styles.PieChartContainer}>
            {Panel === "Prescription" ? 
              <>
                <div className={styles.PieChartData}>
                  <PieChart data={PrescriptionPieChartData} />
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
                
                <div className={styles.PieChartDataRanking}>
                  <div className={styles.PieChartDataRankingTitle}>
                    {Department === "Medical" ? "Most medicine prescribe by school physicians" 
                    : Department === "Dental" ? "Most Causes of Oral Health Conditions" 
                    : Department === "SDPC" ? "Most cases of Mental Health Issues" 
                    : ""
                    } 
                  </div>
                  {data?.TopPrescriptions?.length > 0 ? (
                    data.TopPrescriptions.map((item, index) => (
                      <div className={styles.RankingRow} key={index}>
                        <div className={styles.RankingName}>{item.Prescription}</div>
                        <div className={styles.RankingProgress}>
                          <progress
                            className={styles.ProgressBar}
                            max={data.TopPrescriptions[0].Count || 0}
                            value={item.Count || 0}
                          ></progress>
                        </div>
                        <div className={styles.RankingValue}>{item.Count}</div>
                      </div>
                    ))
                  ) : (
                    <p className={styles.Notes}>No Records to show...</p>
                  )}

                </div>
              </>
            : 
              <>
                <div className={styles.PieChartData}>
                  <PieChart data={ServicesPieChartData} />
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

                <div className={styles.PieChartDataRanking}>
                  <div className={styles.PieChartDataRankingTitle}>
                    {Department === "Medical" ? "Top service rendered by Medical" 
                    : Department === "Dental" ? "Top service rendered by Medical" 
                    : Department === "SDPC" ? "Top service rendered by Dental" 
                    : ""
                    }
                  </div>
                  {data?.TopServices?.length > 0 ? (
                    data.TopServices.map((item, index) => (
                      <div className={styles.RankingRow} key={index}>
                        <div className={styles.RankingName}>{item.Service}</div>
                        <div className={styles.RankingProgress}>
                          <progress
                            className={styles.ProgressBar}
                            max={Number(data.TopServices[0].Count) || 0}
                            value={Number(item.Count) || 0}
                          ></progress>
                        </div>
                        <div className={styles.RankingValue}>{item.Count}</div>
                      </div>
                    ))
                  ) : (
                    <p className={styles.Notes}>No Records to show...</p>
                  )}
                </div>
              </>
            }
            <div className={styles.PieChartDataButtons}>
              <button className={`${styles.PanelBtn} ${Panel === "Prescription" ? styles.Active : null}`} onClick={() => setPanel("Prescription")}>Prescription</button>
              <button className={`${styles.PanelBtn}  ${Panel === "Services" ? styles.Active : null}`} onClick={() => setPanel("Services")}>Services</button>
            </div>
          </div>
        </div>

      </div>
    );

}

export default Page;