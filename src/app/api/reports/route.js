import { NextResponse } from "next/server";
import connect from "@/utils/db";
import MedicalAppointment from "@/models/MedicalAppointment";
import DentalAppointment from "@/models/DentalAppointment";
import SDPCAppointment from "@/models/SDPCAppointment";
import { encryptText, decryptText } from "@/utils/cryptojs";

const decryptFields = (obj) => {
	if (typeof obj !== "object" || obj === null) {
		return obj;
	}

	if (Array.isArray(obj)) {
		return obj.map((item) => decryptFields(item));
	}
  
	const decryptedObj = {};
	for (const key in obj) {
		if (obj.hasOwnProperty(key)) {
			if (typeof obj[key] === "object" && obj[key] !== null) {
				decryptedObj[key] = decryptFields(obj[key]);
			} else {
				decryptedObj[key] = decryptText(obj[key]);
			}
		}
	}
	return decryptedObj;
};

export const GET = async (request) => {
    const url = new URL(request.url);

    const Department = url.searchParams.get("Department");
    const Type = url.searchParams.get("Type");
    const GoogleEmail = url.searchParams.get("GoogleEmail");
    const Course = url.searchParams.get("Course") === "All" ? null : url.searchParams.get("Course");
    const YearLevel = url.searchParams.get("YearLevel") === "All" ? null : url.searchParams.get("YearLevel");


    const ProcessDepartment = async () => {
        let RecordsModel = null;
        switch (Department) {
            case "Medical":
                RecordsModel = MedicalAppointment;
                break;
            case "Dental":
                RecordsModel = DentalAppointment;
                break;
            case "SDPC":
                RecordsModel = SDPCAppointment;
                break;
            default:
                return new NextResponse("Invalid Department", { status: 500 });
                break;
        }

        let Records = await RecordsModel.find();

        if (Records) {
	
            const topLevelFieldsToDecrypt = ["GoogleImage"];
    
            Records = Records.map((result) => {
                const decryptedResult = { ...result._doc };
    
                topLevelFieldsToDecrypt.forEach((field) => {
                    decryptedResult[field] = decryptText(result._doc[field]);
                });
    
                if (result._doc.Details && Object.keys(result._doc.Details).length > 0) {
                    decryptedResult.Details = decryptFields(result._doc.Details);
                }
    
                if (result._doc.Responses && result._doc.Responses.length > 0) {
                    const decryptedResponses = result._doc.Responses.map(response => {
                        const decryptedResponse = {
                            Name: decryptText(response.Name),
                            GoogleEmail: decryptText(response.GoogleEmail),
                            Response: decryptText(response.Response),
                            Timestamp: decryptText(response.Timestamp),
                            ViewedByDepartment: response.ViewedByDepartment,
                            ViewedByClient: response.ViewedByClient
                        };
                        return decryptedResponse;
                    });
                    decryptedResult.Responses = decryptedResponses;
                }

                // if (result._doc.Prescriptions && result._doc.Prescriptions.length > 0) {
                //     const decryptedResponses = result._doc.Prescriptions.map(prescriptions => {
                //         const decryptedResponse = {
                //             Prescription: decryptText(prescriptions.Prescription),
                //             Timestamp: decryptText(prescriptions.Timestamp),
                //             UniqueId: prescriptions.UniqueId,
                //         };
                //         return decryptedResponse;
                //     });
                //     decryptedResult.Prescriptions = decryptedResponses;
                // }
    
                // if (result._doc.Diagnosis && result._doc.Diagnosis.length > 0) {
                //     const decryptedResponses = result._doc.Diagnosis.map(diagnosis => {
                //         const decryptedResponse = {
                //             Diagnosis: decryptText(diagnosis.Diagnosis),
                //             Timestamp: decryptText(diagnosis.Timestamp),
                //             UniqueId: diagnosis.UniqueId,
                //         };
                //         return decryptedResponse;
                //     });
                //     decryptedResult.Diagnosis = decryptedResponses;
                // }
    
                return decryptedResult;
            });
        }

        let ReportData = {
            ChartStatus: {
                Approved: 0,
                Canceled: 0,
                Pending: 0,
            },
            ChartSystem: {
                Successful: 0,
                Advised: 0,
                ReScheduled: 0,
            },
            TotalWalkInPatients:{
                Students: 0,
                "Lay Collaborators": 0,
                All: 0,
            },
            TotalSystemPatients:{
                Students: 0,
                "Lay Collaborators": 0,
                All: 0,
            },
            TotalGender: {
                Male: 0,
                Female: 0,
                All: 0,
            },
            TotalServiceSession: {
                Week: 0,
                Month: 0,
                Year: 0,
                All: 0,
            },
            PatientsSummary: {
                Week: {
                    Data: Array.from({ length: 7 }, () => 0),
                    Legend: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                },
                Month: {
                    Data: Array.from({ length: getDaysInMonth(new Date().getFullYear(), new Date().getMonth()) }, () => 0),
                    Legend: Array.from({ length: getDaysInMonth(new Date().getFullYear(), new Date().getMonth()) }, (_, i) => i + 1),
                },
                Year: {
                    Data: Array.from({ length: 12 }, () => 0),
                    Legend: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                },
            },
            TopPrescriptions: [],
            TopDiagnosis: [],
            TopServices: [],
            TableSets: [],
        };

        let Prescriptions = [];
        let Diagnosis = [];
        let Services = [];

        Records.forEach(record => {
        // Chart Status
            if(record.Status === "Approved") {
                ReportData.ChartStatus.Approved += 1;
            } else if (record.Status === "Canceled") {
                ReportData.ChartStatus.Canceled += 1;
            } else if (record.Status === "Pending") {
                ReportData.ChartStatus.Pending += 1;
            }
        // Chart System
            if (record.Status === "Completed") {
                ReportData.ChartSystem.Successful += 1;
            }
            if (record.Status === "Advising") {
                ReportData.ChartSystem.Advised += 1;
            }
            if (record.ReScheduled) {
                ReportData.ChartSystem.ReScheduled += 1;
            }
        // Total System Patients 
            if(record.Type === "Appointment") {
                if(record.Category && record.Category === "Student") {
                    ReportData.TotalSystemPatients.Students += 1;
                    ReportData.TotalSystemPatients.All += 1;
                } else if (record.Category && record.Category === "Lay Collaborator") {
                    ReportData.TotalSystemPatients["Lay Collaborators"] += 1;
                    ReportData.TotalSystemPatients.All += 1;
                }
            }
        // Total WalkIn Patients 
            if(record.Type === "WalkIn") {
                if(record.Category && record.Category === "Student") {
                    ReportData.TotalWalkInPatients.Students += 1;
                    ReportData.TotalWalkInPatients.All += 1;
                } else if (record.Category && record.Category === "Lay Collaborator") {
                    ReportData.TotalWalkInPatients["Lay Collaborators"] += 1;
                    ReportData.TotalWalkInPatients.All += 1;
                }
            }
        // Total Gender
            if(record.Details.Sex && record.Details.Sex === "Male") {
                ReportData.TotalGender.Male += 1;
                ReportData.TotalGender.All += 1;
            } else if (record.Details.Sex && record.Details.Sex === "Female") {
                ReportData.TotalGender.Female += 1;
                ReportData.TotalGender.All += 1;
            } else {
                console.log("Undetected Gender = "+record.Details.Sex )
            }
        // Total Service Session
            const createdAtDate = new Date(record.createdAt);
            const currentDate = new Date();
            const isWithinWeek = createdAtDate >= new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay()) &&
            createdAtDate < currentDate;
            const isWithinMonth = isWithinWeek || (createdAtDate.getMonth() === currentDate.getMonth() &&
            createdAtDate.getFullYear() === currentDate.getFullYear());
            const isWithinYear = isWithinMonth || (createdAtDate.getFullYear() === currentDate.getFullYear());
            if (isWithinWeek) {
                ReportData.TotalServiceSession.Week += 1;
            }
            if (isWithinMonth) {
                ReportData.TotalServiceSession.Month += 1;
            }
            if (isWithinYear) {
                ReportData.TotalServiceSession.Year += 1;
            }
            ReportData.TotalServiceSession.All += 1;
        // Top Prescriptions
            Prescriptions = Prescriptions.concat(record.Prescriptions);
        // Top Diagnosis
            Diagnosis = Diagnosis.concat(record.Diagnosis);
        // Top Services
            Services.push(record.ServiceOffered);
        // Patients Summary
            const createdAtDate1 = new Date(record.createdAt);
            const currentDate1 = new Date();
            const weekDay = getDayName(currentDate1.getDay());
            if (!ReportData.PatientsSummary.Week.Legend.includes(weekDay)) {
                ReportData.PatientsSummary.Week.Legend.push(weekDay);
            }
            const monthDay = createdAtDate1.getDate();
            if (!ReportData.PatientsSummary.Month.Legend.includes(monthDay)) {
                ReportData.PatientsSummary.Month.Legend.push(monthDay);
            }
            const monthIndex = createdAtDate1.getMonth();
            if (!ReportData.PatientsSummary.Year.Legend.includes(monthIndex)) {
                ReportData.PatientsSummary.Year.Legend.push(monthIndex);
            }
            ReportData.PatientsSummary.Week.Data[ReportData.PatientsSummary.Week.Legend.indexOf(weekDay)] += 1;
            ReportData.PatientsSummary.Month.Data[monthDay - 1] += 1;
            ReportData.PatientsSummary.Year.Data[monthIndex] += 1;
        });

        let prescriptionCounts = Prescriptions.reduce((counts, prescription) => {
            counts[prescription.Prescription] = (counts[prescription.Prescription] || 0) + 1;
            return counts;
        }, {});
        let prescriptionCountArray = Object.keys(prescriptionCounts).map(prescription => ({
            Count: prescriptionCounts[prescription],
            Prescription: prescription
        }));
        prescriptionCountArray.sort((a, b) => b.Count - a.Count);
        ReportData.TopPrescriptions = prescriptionCountArray.slice(0, 10);

        let diagnosisCounts = Diagnosis.reduce((counts, diagnosis) => {
            counts[diagnosis.Diagnosis] = (counts[diagnosis.Diagnosis] || 0) + 1;
            return counts;
        }, {});
        let diagnosisCountArray = Object.keys(diagnosisCounts).map(diagnosis => ({
            Count: diagnosisCounts[diagnosis],
            Diagnosis: diagnosis
        }));
        diagnosisCountArray.sort((a, b) => b.Count - a.Count);
        ReportData.TopDiagnosis = diagnosisCountArray.slice(0, 10);

        let serviceCounts = Services.reduce((counts, service) => {
            counts[service] = (counts[service] || 0) + 1;
            return counts;
          }, {});
        let serviceCountArray = Object.keys(serviceCounts).map(service => ({
            Count: serviceCounts[service],
            Service: service
        }));
        serviceCountArray.sort((a, b) => b.Count - a.Count);
        ReportData.TopServices = serviceCountArray.slice(0, 10);

        const filteredRecords = Records.filter((record) => {
            const courseMatches = Course ? record.Details.CourseStrand === Course : true;
            const yearLevelMatches = YearLevel ? record.Details.YearLevel === YearLevel : true;
        
            return (
                courseMatches &&
                yearLevelMatches &&
                record.Department === Department
            );
        });

        const diagnosisList = [];
        filteredRecords.forEach((record) => {
            record.Diagnosis.forEach((diagnosis) => {
                if(record.Prescriptions.length>0) {
                    record.Prescriptions.forEach((prescription) => {
                        const data = {
                            Diagnosis: diagnosis.Diagnosis,
                            Patients: 1,
                            Gender: record.Details.Sex,
                            Service: record.ServiceOffered,
                            Prescriptions: prescription?.Prescription,
                        };
                
                        diagnosisList.push(data);
                    });
                } else {
                    const data = {
                        Diagnosis: diagnosis.Diagnosis,
                        Patients: 1,
                        Gender: record.Details.Sex,
                        Service: record.ServiceOffered,
                        Prescriptions: null,
                    };
            
                    diagnosisList.push(data);
                }
            });
        });

        const diagnosisTable = {};

        filteredRecords.forEach((record) => {
            if (!diagnosisTable[record._id]) {
                diagnosisTable[record._id] = [];
            }

            record.Diagnosis.forEach((diagnosis) => {
                if (record?.Prescriptions?.length > 0) {
                    record.Prescriptions.forEach((prescription) => {
                        const prescriptionName = prescription.Prescription || "";
                        diagnosisTable[record._id].push({
                            Diagnosis: diagnosis.Diagnosis,
                            Prescriptions: prescriptionName,
                            Gender: record.Details.Sex,
                            Service: record.ServiceOffered,
                        });
                    });
                } else {
                    if (record?.ServiceOffered) {
                        diagnosisTable[record._id].push({
                            Diagnosis: diagnosis.Diagnosis,
                            Prescriptions: "",
                            Gender: record.Details.Sex,
                            Service: record.ServiceOffered,
                        });
                    }
                }
            });
        });


        const uniqueDiagnosesArray = [...new Set(Object.values(diagnosisTable)
            .flatMap(record => record.map(entry => entry.Diagnosis)))];

            const DiagnosisTableSets = {};

            uniqueDiagnosesArray.forEach((uniqueDiagnosis) => {
                if (!DiagnosisTableSets[uniqueDiagnosis]) {
                    DiagnosisTableSets[uniqueDiagnosis] = {
                        Genders: [],
                        Prescription: [],
                        ServiceUsed: [],
                        Patients: 0,
                    };
                }
                Object.entries(diagnosisTable).forEach(([patientId, records]) => {
                    DiagnosisTableSets[uniqueDiagnosis].Patients += records.filter(item => item.Diagnosis === uniqueDiagnosis).length;
                    records.forEach((item) => {
                        if (item.Diagnosis === uniqueDiagnosis) {
                            DiagnosisTableSets[uniqueDiagnosis].Genders.push(item.Gender)
                            if (item.Prescriptions !== "") {
                                DiagnosisTableSets[uniqueDiagnosis].Prescription.push(item.Prescriptions)
                            }
                            DiagnosisTableSets[uniqueDiagnosis].ServiceUsed.push(item.Service)
                        }
                    })
                })
            })
            
            const finalDiagnosisArray = [];

            Object.entries(DiagnosisTableSets).forEach(([diagnosis, data]) => {
                const topPrescription = findTopItem(data.Prescription);
                const topGender = findTopItem(data.Genders);
                const topServiceUsed = findTopItem(data.ServiceUsed);
            
                finalDiagnosisArray.push({
                    Diagnosis: diagnosis,
                    Prescriptions: topPrescription,
                    Gender: topGender,
                    Service: topServiceUsed,
                    Patients: data.Patients,
                });
            });
            
            
            function findTopItem(array) {
                const countMap = {};
                let maxCount = 0;
                let topItem = null;
            
                array.forEach((item) => {
                    countMap[item] = (countMap[item] || 0) + 1;
            
                    if (countMap[item] > maxCount) {
                        maxCount = countMap[item];
                        topItem = item;
                    }
                });
            
                return topItem;
            }

        ReportData.TableSets = finalDiagnosisArray;
        
        return ReportData;
    }

    const ProcessClient = async () => {
        let RecordsModel = null;
        switch (Department) {
            case "Medical":
                RecordsModel = MedicalAppointment;
                break;
            case "Dental":
                RecordsModel = DentalAppointment;
                break;
            case "SDPC":
                RecordsModel = SDPCAppointment;
                break;
            default:
                return new NextResponse("Invalid Department", { status: 500 });
                break;
        }

        let Records = await RecordsModel.find({ GoogleEmail: GoogleEmail });

        if (Records) {
	
            const topLevelFieldsToDecrypt = ["GoogleImage"];
    
            Records = Records.map((result) => {
                const decryptedResult = { ...result._doc };
    
                topLevelFieldsToDecrypt.forEach((field) => {
                    decryptedResult[field] = decryptText(result._doc[field]);
                });
    
                if (result._doc.Details && Object.keys(result._doc.Details).length > 0) {
                    decryptedResult.Details = decryptFields(result._doc.Details);
                }
    
                if (result._doc.Responses && result._doc.Responses.length > 0) {
                    const decryptedResponses = result._doc.Responses.map(response => {
                        const decryptedResponse = {
                            Name: decryptText(response.Name),
                            GoogleEmail: decryptText(response.GoogleEmail),
                            Response: decryptText(response.Response),
                            Timestamp: decryptText(response.Timestamp),
                            ViewedByDepartment: response.ViewedByDepartment,
                            ViewedByClient: response.ViewedByClient
                        };
                        return decryptedResponse;
                    });
                    decryptedResult.Responses = decryptedResponses;
                }

                // if (result._doc.Prescriptions && result._doc.Prescriptions.length > 0) {
                //     const decryptedResponses = result._doc.Prescriptions.map(prescriptions => {
                //         const decryptedResponse = {
                //             Prescription: decryptText(prescriptions.Prescription),
                //             Timestamp: decryptText(prescriptions.Timestamp),
                //             UniqueId: prescriptions.UniqueId,
                //         };
                //         return decryptedResponse;
                //     });
                //     decryptedResult.Prescriptions = decryptedResponses;
                // }
    
                // if (result._doc.Diagnosis && result._doc.Diagnosis.length > 0) {
                //     const decryptedResponses = result._doc.Diagnosis.map(diagnosis => {
                //         const decryptedResponse = {
                //             Diagnosis: decryptText(diagnosis.Diagnosis),
                //             Timestamp: decryptText(diagnosis.Timestamp),
                //             UniqueId: diagnosis.UniqueId,
                //         };
                //         return decryptedResponse;
                //     });
                //     decryptedResult.Diagnosis = decryptedResponses;
                // }
    
                return decryptedResult;
            });
        }

        let ReportData = {
            ChartStatus: {
                Approved: 0,
                Canceled: 0,
                Pending: 0,
            },
            ChartSystem: {
                Successful: 0,
                Advised: 0,
                ReScheduled: 0,
            },
            PatientsSummary: {
                Week: {
                    Data: Array.from({ length: 7 }, () => 0),
                    Legend: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                },
                Month: {
                    Data: Array.from({ length: getDaysInMonth(new Date().getFullYear(), new Date().getMonth()) }, () => 0),
                    Legend: Array.from({ length: getDaysInMonth(new Date().getFullYear(), new Date().getMonth()) }, (_, i) => i + 1),
                },
                Year: {
                    Data: Array.from({ length: 12 }, () => 0),
                    Legend: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                },
            },
            TopPrescriptions: [],
            TopDiagnosis: [],
        };

        let Prescriptions = [];
        let Diagnosis = [];

        Records.forEach(record => {
        // Chart Status
            if(record.Status === "Approved") {
                ReportData.ChartStatus.Approved += 1;
            } else if (record.Status === "Canceled") {
                ReportData.ChartStatus.Canceled += 1;
            } else if (record.Status === "Pending") {
                ReportData.ChartStatus.Pending += 1;
            }
        // Chart System
            if (record.Status === "Completed") {
                ReportData.ChartSystem.Successful += 1;
            }
            if (record.Status === "Advising") {
                ReportData.ChartSystem.Advised += 1;
            }
            if (record.ReScheduled) {
                ReportData.ChartSystem.ReScheduled += 1;
            }
        // Top Prescriptions
            Prescriptions = Prescriptions.concat(record.Prescriptions);
        // Top Diagnosis
            Diagnosis = Diagnosis.concat(record.Diagnosis);
        // Patients Summary
            const createdAtDate1 = new Date(record.createdAt);
            const currentDate1 = new Date();
            const weekDay = getDayName(currentDate1.getDay());
            if (!ReportData.PatientsSummary.Week.Legend.includes(weekDay)) {
                ReportData.PatientsSummary.Week.Legend.push(weekDay);
            }
            const monthDay = createdAtDate1.getDate();
            if (!ReportData.PatientsSummary.Month.Legend.includes(monthDay)) {
                ReportData.PatientsSummary.Month.Legend.push(monthDay);
            }
            const monthIndex = createdAtDate1.getMonth();
            const yearMonthKey = `${createdAtDate1.getFullYear()}-${monthIndex}`;
            if (!ReportData.PatientsSummary.Year.Legend.includes(yearMonthKey)) {
                ReportData.PatientsSummary.Year.Legend.push(yearMonthKey);
            }
            ReportData.PatientsSummary.Week.Data[ReportData.PatientsSummary.Week.Legend.indexOf(weekDay)] += 1;
            ReportData.PatientsSummary.Month.Data[monthDay - 1] += 1;
            ReportData.PatientsSummary.Year.Data[ReportData.PatientsSummary.Year.Legend.indexOf(yearMonthKey)] += 1;
        });

        let prescriptionCounts = Prescriptions.reduce((counts, prescription) => {
            counts[prescription.Prescription] = (counts[prescription.Prescription] || 0) + 1;
            return counts;
        }, {});
        let prescriptionCountArray = Object.keys(prescriptionCounts).map(prescription => ({
            Count: prescriptionCounts[prescription],
            Prescription: prescription
        }));
        prescriptionCountArray.sort((a, b) => b.Count - a.Count);
        ReportData.TopPrescriptions = prescriptionCountArray.slice(0, 10);



        let diagnosisCounts = Diagnosis.reduce((counts, diagnosis) => {
            counts[diagnosis.Diagnosis] = (counts[diagnosis.Diagnosis] || 0) + 1;
            return counts;
        }, {});
        let diagnosisCountArray = Object.keys(diagnosisCounts).map(diagnosis => ({
            Count: diagnosisCounts[diagnosis],
            Diagnosis: diagnosis
        }));
        diagnosisCountArray.sort((a, b) => b.Count - a.Count);
        ReportData.TopDiagnosis = diagnosisCountArray.slice(0, 10);

        return ReportData;
    }

    try {
        await connect();
        let Results = null;
        if (Type === "Department") {
            Results = await ProcessDepartment();
        } else if (Type === "Client") {
            Results = await ProcessClient();
        } else {
            return new NextResponse("Invalid Type", { status: 500 });
        }
        
        return new NextResponse(JSON.stringify(Results), { status: 200 });
    } catch (err) {
        console.error(err.message);
        return new NextResponse('Database Error:'+ err.message, { status: 500 });
    }
}



function getDaysInMonth(year, monthIndex) {
    return new Date(year, monthIndex + 1, 0).getDate();
}

function getDayName(dayIndex) {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return daysOfWeek[dayIndex];
}
