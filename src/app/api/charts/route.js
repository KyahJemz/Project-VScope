import { NextResponse } from "next/server";
import connect from "@/utils/db";
import MedicalAppointment from "@/models/MedicalAppointment";
import DentalAppointment from "@/models/DentalAppointment";
import SDPCAppointment from "@/models/SDPCAppointment";
import { Reports } from "@/models/Reports";

export const GET = async (request) => {
    const url = new URL(request.url);
    const department = url.searchParams.get("department");
    const query = url.searchParams.get("query");
    const option = url.searchParams.get("option");
    const status = url.searchParams.get("status");

    const SDPCReport1Options = Reports["SDPC"]["Options1"];
    const DentalReport1Options = Reports["Dental"]["Options1"];
    const MedicalReport1Options = Reports["Medical"]["Options1"];

    if (!department || !query || !option) {
        return new NextResponse("Empty", { status: 500 });
    }

    try {
        await connect();

        switch (option) {
            case 'day':
                const dcountsStudent = [];
                const dcountsLayCollaborators = [];
                const dlabel = [];
                const dReport1 = [];

                const currentDate = new Date();
                const startOfDay = new Date(currentDate);
                startOfDay.setHours(0, 0, 0, 0);
            
                const endOfDay = new Date(currentDate);
                endOfDay.setHours(23, 59, 59, 999);
            
                if (query === 'countSLC'){
                    let countStudent;
                    let countLayColaborators;
                    
                    if (department === 'Medical' || department === 'Dental' || department === 'SDPC') {
                      const AppointmentModel = department === 'Medical' ? MedicalAppointment :
                        department === 'Dental' ? DentalAppointment :
                        department === 'SDPC' ? SDPCAppointment : null;
                    
                        if (AppointmentModel) {
                            countStudent = await AppointmentModel.countDocuments({
                                Department: department,
                                createdAt: { $gte: startOfDay, $lte: endOfDay },
                                Category: 'Student'
                            });
                        
                            countLayColaborators = await AppointmentModel.countDocuments({
                                Department: department,
                                createdAt: { $gte: startOfDay, $lte: endOfDay },
                                Category: 'Lay Collaborator'
                            });

                            const data = { label: ['Student','Lay Collaborator'], counts: [countStudent,countLayColaborators] };  // Modified to properly structure data
                            
                            return new NextResponse(JSON.stringify(data), { status: 200 });

                        }
                    }
                }
            
                if (query === 'countStatus') {


                    for (let i = 0; i < 24; i++) {
                        const hourStart = new Date(startOfDay);
                        hourStart.setHours(i, 0, 0, 0);
                        
                        const hourEnd = new Date(hourStart);
                        hourEnd.setHours(i, 59, 59, 999);
                        
                        let countStudent;
                        let countLayCollaborators;
                        let countReport1;
                        
                        if (department === 'Medical') {
                            countStudent = await MedicalAppointment.countDocuments({
                                Department: 'Medical',
                                Status: status,
                                Category: 'Student',
                                createdAt: { $gte: hourStart, $lte: hourEnd },
                            });

                            countLayCollaborators = await MedicalAppointment.countDocuments({
                                Department: 'Medical',
                                Status: status,
                                Category: 'Lay Collaborator',
                                createdAt: { $gte: hourStart, $lte: hourEnd },
                            });

                            let countReport1Raw = {};
                            MedicalReport1Options.forEach(async option => {
                                const report1Result = await MedicalAppointment.countDocuments({
                                    Report1: option["Option"],
                                    createdAt: { $gte: hourStart, $lte: hourEnd },
                                });
                                countReport1Raw[option["Option"]] = report1Result;
                            });
                            countReport1 = countReport1Raw;
                            
                        } else if (department === 'Dental') {
                            countStudent = await DentalAppointment.countDocuments({
                                Department: 'Dental',
                                Status: status,
                                Category: 'Student',
                                createdAt: { $gte: hourStart, $lte: hourEnd },
                            });
                        
                            countLayCollaborators = await DentalAppointment.countDocuments({
                                Department: 'Dental',
                                Status: status,
                                Category: 'Lay Collaborator',
                                createdAt: { $gte: hourStart, $lte: hourEnd },
                            })

                            let countReport1Raw = {};
                            DentalReport1Options.forEach(async option => {
                                const report1Result = await DentalAppointment.countDocuments({
                                    Report1: option["Option"],
                                    createdAt: { $gte: hourStart, $lte: hourEnd },
                                });
                                countReport1Raw[option["Option"]] = report1Result;
                            });
                            countReport1 = countReport1Raw;

                        } else if (department === 'SDPC') {
                            countStudent = await SDPCAppointment.countDocuments({
                                Department: 'SDPC',
                                Status: status,
                                Category: 'Student',
                                createdAt: { $gte: hourStart, $lte: hourEnd },
                            });
                        
                            countLayCollaborators = await SDPCAppointment.countDocuments({
                                Department: 'SDPC',
                                Status: status,
                                Category: 'Lay Collaborator',
                                createdAt: { $gte: hourStart, $lte: hourEnd },
                            })

                            let countReport1Raw = {};
                            SDPCReport1Options.forEach(async option => {
                                const report1Result = await SDPCAppointment.countDocuments({
                                    Report1: option["Option"],
                                    createdAt: { $gte: hourStart, $lte: hourEnd },
                                });
                                countReport1Raw[option["Option"]] = report1Result;
                            });
                            countReport1 = countReport1Raw;

                        } else {
                            return new NextResponse('Invalid Department', { status: 500 });
                        }
                        
                        const formattedHour = i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`;

                        dlabel.push(formattedHour);
                        dcountsStudent.push(countStudent);
                        dcountsLayCollaborators.push(countLayCollaborators);
                        dReport1.push(countReport1);
                    }
                        
                    const data = {
                        label: dlabel,
                        countsStudent: dcountsStudent,
                        countsLayCollaborator: dcountsLayCollaborators,
                        countsReport1 : dReport1,
                    };
                      
                    return new NextResponse(JSON.stringify(data), { status: 200 });
                }
                break;

            case 'week':
                const countsStudentWeek = [];
                const countsLayCollaboratorsWeek = [];
                const labelWeek = [];
                const Report1Week = [];

                const currentDateWeek = new Date();
                const endDateWeek = new Date(currentDateWeek);
                endDateWeek.setHours(23, 59, 59, 999);

                const startDateWeek = new Date();
                startDateWeek.setDate(startDateWeek.getDate() - 6);
                startDateWeek.setHours(0, 0, 0, 0);

                if (query === 'countSLC'){
                    let countStudent;
                    let countLayColaborators;
                    
                    if (department === 'Medical' || department === 'Dental' || department === 'SDPC') {
                      const AppointmentModel = department === 'Medical' ? MedicalAppointment :
                        department === 'Dental' ? DentalAppointment :
                        department === 'SDPC' ? SDPCAppointment : null;
                    
                        if (AppointmentModel) {
                            countStudent = await AppointmentModel.countDocuments({
                                Department: department,
                                createdAt: { $gte: startDateWeek, $lte: endDateWeek },
                                Category: 'Student'
                            });
                        
                            countLayColaborators = await AppointmentModel.countDocuments({
                                Department: department,
                                createdAt: { $gte: startDateWeek, $lte: endDateWeek },
                                Category: 'Lay Collaborator'
                            });

                            const data = { label: ['Student','Lay Collaborator'], counts: [countStudent,countLayColaborators] };  // Modified to properly structure data
                        
                            return new NextResponse(JSON.stringify(data), { status: 200 });
                        }
                    }
                }
                
                if (query === 'countStatus') {
                    for (let i = 0; i < 7; i++) {
                        const dayStart = new Date(startDateWeek);
                        dayStart.setDate(startDateWeek.getDate() + i);
                        
                        const dayEnd = new Date(dayStart);
                        dayEnd.setHours(23, 59, 59, 999);
                        
                        let countStudent = 0;
                        let countLayCollaborators = 0;
                        let countReport1;
                        
                        if (department === 'Medical') {
                            countStudent = await MedicalAppointment.countDocuments({
                                Department: 'Medical',
                                Status: status,
                                Category: 'Student',  // Count for 'Student'
                                createdAt: { $gte: dayStart, $lte: dayEnd },
                            });
                        
                            countLayCollaborators = await MedicalAppointment.countDocuments({
                                Department: 'Medical',
                                Status: status,
                                Category: 'Lay Collaborator',  // Count for 'Lay Collaborator'
                                createdAt: { $gte: dayStart, $lte: dayEnd },
                            });

                            let countReport1Raw = {};
                            MedicalReport1Options.forEach(async option => {
                                const report1Result = await MedicalAppointment.countDocuments({
                                    Report1: option["Option"],
                                    createdAt: { $gte: dayStart, $lte: dayEnd },
                                });
                                countReport1Raw[option["Option"]] = report1Result;
                            });
                            countReport1 = countReport1Raw;


                        } else if (department === 'Dental') {
                            countStudent = await DentalAppointment.countDocuments({
                                Department: 'Dental',
                                Status: status,
                                Category: 'Student',  // Count for 'Student'
                                createdAt: { $gte: dayStart, $lte: dayEnd },
                            });
                        
                            countLayCollaborators = await DentalAppointment.countDocuments({
                                Department: 'Dental',
                                Status: status,
                                Category: 'Lay Collaborator',  // Count for 'Lay Collaborator'
                                createdAt: { $gte: dayStart, $lte: dayEnd },
                            });

                            let countReport1Raw = {};
                            DentalReport1Options.forEach(async option => {
                                const report1Result = await DentalAppointment.countDocuments({
                                    Report1: option["Option"],
                                    createdAt: { $gte: dayStart, $lte: dayEnd },
                                });
                                countReport1Raw[option["Option"]] = report1Result;
                            });
                            countReport1 = countReport1Raw;

                        } else if (department === 'SDPC') {
                            countStudent = await SDPCAppointment.countDocuments({
                                Department: 'SDPC',
                                Status: status,
                                Category: 'Student',  // Count for 'Student'
                                createdAt: { $gte: dayStart, $lte: dayEnd },
                            });
                        
                            countLayCollaborators = await SDPCAppointment.countDocuments({
                                Department: 'SDPC',
                                Status: status,
                                Category: 'Lay Collaborator',  // Count for 'Lay Collaborator'
                                createdAt: { $gte: dayStart, $lte: dayEnd },
                            });

                            let countReport1Raw = {};
                            SDPCReport1Options.forEach(async option => {
                                const report1Result = await SDPCAppointment.countDocuments({
                                    Report1: option["Option"],
                                    createdAt: { $gte: dayStart, $lte: dayEnd },
                                });
                                countReport1Raw[option["Option"]] = report1Result;
                            });
                            countReport1 = countReport1Raw;

                        } else {
                            return new NextResponse('Invalid Department', { status: 500 });
                        }
                        
                        const dayFormatted = dayStart.toLocaleDateString('en-US', { weekday: 'short' });
                        
                        labelWeek.push(dayFormatted);
                        countsStudentWeek.push(countStudent);
                        countsLayCollaboratorsWeek.push(countLayCollaborators);
                        Report1Week.push(countReport1);
                    }
                        
                    const data = {
                        label: labelWeek,
                        countsStudent: countsStudentWeek,
                        countsLayCollaborator: countsLayCollaboratorsWeek,
                        countsReport1 : Report1Week,
                    };
                        
                    return new NextResponse(JSON.stringify(data), { status: 200 });
                }
                break;
        
            case 'month':
                const countsStudentMonth = [];
                const countsLayCollaboratorsMonth = [];
                const labelMonth = [];
                const Report1Month = [];

                const currentDateMonth = new Date();
                const endDateMonth = new Date(currentDateMonth);
                endDateMonth.setHours(23, 59, 59, 999);

                const startDateMonth = new Date(currentDateMonth);
                startDateMonth.setDate(1);
                startDateMonth.setHours(0, 0, 0, 0);

                const daysInMonth = new Date(
                    currentDateMonth.getFullYear(),
                    currentDateMonth.getMonth() + 1,
                    0
                    ).getDate();

                if (query === 'countSLC'){
                    let countStudent;
                    let countLayColaborators;
                    
                    if (department === 'Medical' || department === 'Dental' || department === 'SDPC') {
                      const AppointmentModel = department === 'Medical' ? MedicalAppointment :
                        department === 'Dental' ? DentalAppointment :
                        department === 'SDPC' ? SDPCAppointment : null;
                    
                        if (AppointmentModel) {
                            countStudent = await AppointmentModel.countDocuments({
                                Department: department,
                                createdAt: { $gte: startDateMonth, $lte: endDateMonth },
                                Category: 'Student'
                            });
                        
                            countLayColaborators = await AppointmentModel.countDocuments({
                                Department: department,
                                createdAt: { $gte: startDateMonth, $lte: endDateMonth },
                                Category: 'Lay Collaborator'
                            });
                            
                            const data = { label: ['Student','Lay Collaborator'], counts: [countStudent,countLayColaborators] };  // Modified to properly structure data
                    
                            return new NextResponse(JSON.stringify(data), { status: 200 });

                        }
                    }
                }

                if (query === 'countStatus') {
                    for (let i = 0; i < daysInMonth; i++) {
                        const dayStart = new Date(startDateMonth);
                        dayStart.setDate(startDateMonth.getDate() + i);
                      
                        const dayEnd = new Date(dayStart);
                        dayEnd.setHours(23, 59, 59, 999);
                      
                        let countStudent = 0;
                        let countLayCollaborators = 0;
                        let countReport1;
                      
                        if (department === 'Medical') {
                            countStudent = await MedicalAppointment.countDocuments({
                                Department: 'Medical',
                                Status: status,
                                Category: 'Student', // Count for 'Student'
                                createdAt: { $gte: dayStart, $lte: dayEnd },
                            });
                        
                            countLayCollaborators = await MedicalAppointment.countDocuments({
                                Department: 'Medical',
                                Status: status,
                                Category: 'Lay Collaborator', // Count for 'Lay Collaborator'
                                createdAt: { $gte: dayStart, $lte: dayEnd },
                            });

                            let countReport1Raw = {};
                            MedicalReport1Options.forEach(async option => {
                                const report1Result = await MedicalAppointment.countDocuments({
                                    Report1: option["Option"],
                                    createdAt: { $gte: dayStart, $lte: dayEnd },
                                });
                                countReport1Raw[option["Option"]] = report1Result;
                            });
                            countReport1 = countReport1Raw;

                        } else if (department === 'Dental') {
                            countStudent = await DentalAppointment.countDocuments({
                                Department: 'Dental',
                                Status: status,
                                Category: 'Student', // Count for 'Student'
                                createdAt: { $gte: dayStart, $lte: dayEnd },
                            });
                        
                            countLayCollaborators = await DentalAppointment.countDocuments({
                                Department: 'Dental',
                                Status: status,
                                Category: 'Lay Collaborator', // Count for 'Lay Collaborator'
                                createdAt: { $gte: dayStart, $lte: dayEnd },
                            });

                            let countReport1Raw = {};
                            DentalReport1Options.forEach(async option => {
                                const report1Result = await DentalAppointment.countDocuments({
                                    Report1: option["Option"],
                                    createdAt: { $gte: dayStart, $lte: dayEnd },
                                });
                                countReport1Raw[option["Option"]] = report1Result;
                            });
                            countReport1 = countReport1Raw;

                        } else if (department === 'SDPC') {
                            countStudent = await SDPCAppointment.countDocuments({
                                Department: 'SDPC',
                                Status: status,
                                Category: 'Student', // Count for 'Student'
                                createdAt: { $gte: dayStart, $lte: dayEnd },
                            });
                        
                            countLayCollaborators = await SDPCAppointment.countDocuments({
                                Department: 'SDPC',
                                Status: status,
                                Category: 'Lay Collaborator', // Count for 'Lay Collaborator'
                                createdAt: { $gte: dayStart, $lte: dayEnd },
                            });

                            let countReport1Raw = {};
                            SDPCReport1Options.forEach(async option => {
                                const report1Result = await SDPCAppointment.countDocuments({
                                    Report1: option["Option"],
                                    createdAt: { $gte: dayStart, $lte: dayEnd },
                                });
                                countReport1Raw[option["Option"]] = report1Result;
                            });
                            countReport1 = countReport1Raw;
                        } else {
                            return new NextResponse('Invalid Department', { status: 500 });
                        }
                      
                        const dayFormatted = (i + 1).toString().padStart(2, '0');
                      
                        labelMonth.push(dayFormatted);
                        countsStudentMonth.push(countStudent);
                        countsLayCollaboratorsMonth.push(countLayCollaborators);
                        Report1Month.push(countReport1);
                    }
                      
                    const data = {
                        label: labelMonth,
                        countsStudent: countsStudentMonth,
                        countsLayCollaborator: countsLayCollaboratorsMonth,
                        countsReport1 : Report1Month,
                    };
                      
                    return new NextResponse(JSON.stringify(data), { status: 200 });
                }
                break;
        
            case 'year':
                const countsYearStudent = [];
                const countsYearLayCollaborators = [];
                const labelYear = [];
                const Report1Year = [];

                const currentDateYear = new Date();
                const endDateYear = new Date(currentDateYear);
                endDateYear.setHours(23, 59, 59, 999);

                const startDateYear = new Date(currentDateYear);
                startDateYear.setMonth(startDateYear.getMonth() - 11);  // Start from 12 months ago
                startDateYear.setHours(0, 0, 0, 0);

                if (query === 'countSLC'){
                    let countStudent;
                    let countLayColaborators;
                    
                    if (department === 'Medical' || department === 'Dental' || department === 'SDPC') {
                        const AppointmentModel = department === 'Medical' ? MedicalAppointment :
                        department === 'Dental' ? DentalAppointment :
                        department === 'SDPC' ? SDPCAppointment : null;
                    
                        if (AppointmentModel) {
                            countStudent = await AppointmentModel.countDocuments({
                                Department: department,
                                createdAt: { $gte: startDateYear, $lte: endDateYear },
                                Category: 'Student'
                            });
                    
                            countLayColaborators = await AppointmentModel.countDocuments({
                                Department: department,
                                createdAt: { $gte: startDateYear, $lte: endDateYear },
                                Category: 'Lay Collaborator'
                            });

                            const data = { label: ['Student','Lay Collaborator'], counts: [countStudent,countLayColaborators] };  // Modified to properly structure data
                    
                            return new NextResponse(JSON.stringify(data), { status: 200 });
                        }
                    }
                }
                
                if (query === 'countStatus') {
                    for (let i = 0; i < 12; i++) {
                        const monthStart = new Date(startDateYear);
                        monthStart.setMonth(startDateYear.getMonth() + i);
                    
                        const nextMonth = new Date(monthStart);
                        nextMonth.setMonth(monthStart.getMonth() + 1);
                    
                        const monthEnd = new Date(nextMonth);
                        monthEnd.setDate(0);
                        monthEnd.setHours(23, 59, 59, 999);
                    
                        let countStudent;
                        let countLayCollaborators;
                        let countReport1;
                    
                        if (department === 'Medical') {
                            countStudent = await MedicalAppointment.countDocuments({
                                Department: 'Medical',
                                Status: status,
                                Category: 'Student',
                                createdAt: { $gte: monthStart, $lte: monthEnd },
                            });
                    
                            countLayCollaborators = await MedicalAppointment.countDocuments({
                                Department: 'Medical',
                                Status: status,
                                Category: 'Lay Collaborator',
                                createdAt: { $gte: monthStart, $lte: monthEnd },
                            });

                            let countReport1Raw = {};
                            MedicalReport1Options.forEach(async option => {
                                const report1Result = await MedicalAppointment.countDocuments({
                                    Report1: option["Option"],
                                    createdAt: { $gte: monthStart, $lte: monthEnd },
                                });
                                countReport1Raw[option["Option"]] = report1Result;
                            });
                            countReport1 = countReport1Raw;

                        } else if (department === 'Dental') {
                            countStudent = await DentalAppointment.countDocuments({
                                Department: 'Dental',
                                Status: status,
                                Category: 'Student',
                                createdAt: { $gte: monthStart, $lte: monthEnd },
                            });
                    
                            countLayCollaborators = await DentalAppointment.countDocuments({
                                Department: 'Dental',
                                Status: status,
                                Category: 'Lay Collaborator',
                                createdAt: { $gte: monthStart, $lte: monthEnd },
                            });

                            let countReport1Raw = {};
                            DentalReport1Options.forEach(async option => {
                                const report1Result = await DentalAppointment.countDocuments({
                                    Report1: option["Option"],
                                    createdAt: { $gte: monthStart, $lte: monthEnd },
                                });
                                countReport1Raw[option["Option"]] = report1Result;
                            });
                            countReport1 = countReport1Raw;

                        } else if (department === 'SDPC') {
                            countStudent = await SDPCAppointment.countDocuments({
                                Department: 'SDPC',
                                Status: status,
                                Category: 'Student',
                                createdAt: { $gte: monthStart, $lte: monthEnd },
                            });
                    
                            countLayCollaborators = await SDPCAppointment.countDocuments({
                                Department: 'SDPC',
                                Status: status,
                                Category: 'Lay Collaborator',
                                createdAt: { $gte: monthStart, $lte: monthEnd },
                            });

                            let countReport1Raw = {};
                            SDPCReport1Options.forEach(async option => {
                                const report1Result = await SDPCAppointment.countDocuments({
                                    Report1: option["Option"],
                                    createdAt: { $gte: monthStart, $lte: monthEnd },
                                });
                                countReport1Raw[option["Option"]] = report1Result;
                            });
                            countReport1 = countReport1Raw;

                        } else {
                            return new NextResponse("Invalid Department", { status: 500 });
                        }
                    
                        const monthFormatted = monthStart.toLocaleString('default', { month: 'short' });
                    
                        labelYear.push(monthFormatted);
                        countsYearStudent.push(countStudent);
                        countsYearLayCollaborators.push(countLayCollaborators);
                        Report1Year.push(countReport1);
                    }
                    
                    const data = {
                        label: labelYear,
                        countsStudent: countsYearStudent,
                        countsLayCollaborator: countsYearLayCollaborators,
                        countsReport1 : Report1Year,
                    };
                    
                    return new NextResponse(JSON.stringify(data), { status: 200 });
                }
                break;
            
            default:
            }


        return new NextResponse("Invalid", { status: 500 });
    } catch (err) {
        return new NextResponse("Database Error"+err, { status: 500 });
    }
};