import { NextResponse } from "next/server";
import connect from "@/utils/db";
import MedicalAppointment from "@/models/MedicalAppointment";
import DentalAppointment from "@/models/DentalAppointment";

export const POST = async (request) => {
    if (request.method === 'POST') {
        const body = await request.formData();

        const Department = body.get("Department"); 
        const AppointmentId = body.get("AppointmentId"); 

        const dDate = body.get("dDate"); 

        try {
            await connect();

            let updatedAppointment = null;

            if (dDate === "" || dDate === null) {
              if (Department === 'Medical'){
                const Data = {
                  FullName: body.get("fullname"),
                  DepartmentCourseYear: body.get("departmentcourseyear"),
                  Address: body.get("address"),
                  ContactNo: body.get("contactnumber"),
                  CivilStatus: body.get("civilstatus"),
                  Age: body.get("age"),
                  Sex: body.get("sex"),
                  EmergencyName: body.get("emergency"),
                  EmergencyContactNo: body.get("emergencynumber"),
                  Concern: body.get("concern"),
                };
                updatedAppointment = await MedicalAppointment.findOneAndUpdate(
                  { _id: AppointmentId },
                  { $set: { 'Details': Data } },
                  { new: true }
                ).exec();
              } else if (Department === 'Dental') {
                const Data = {
                  FirstName: body.get("firstname"),
                  MiddleName: body.get("middlename"),
                  LastName: body.get("lastname"),
                  CivilStatus: body.get("civilstatus"),
                  Address: body.get("address"),
                  Course: body.get("course"),
                  Year: body.get("year"),
                  Section: body.get("section"),
                  Age: body.get("age"),
                  DateofBirth: body.get("dateofbirth"),
                  Religion: body.get("religion"),
                  ContactNo: body.get("contactno"),
                  SpouseName: body.get("spousename"),
                  Sex: body.get("sex"),
                  MothersName: body.get("mothersname"),
                  FathersName: body.get("fathersname"),
                  EmergencyName: body.get("emergency"),
                  EmergencyContactNo: body.get("emergencynumber"),
                  Concern: body.get("concern"),
                };
                updatedAppointment = await DentalAppointment.findOneAndUpdate(
                  { _id: AppointmentId },
                  { $set: { 'Details': Data } },
                  { new: true }
                ).exec();
              }
            } else {
              if (Department === 'Dental') {
                const Data = {
                  FirstName: body.get("firstname"),
                  MiddleName: body.get("middlename"),
                  LastName: body.get("lastname"),
                  CivilStatus: body.get("civilstatus"),
                  Address: body.get("address"),
                  Course: body.get("course"),
                  Year: body.get("year"),
                  Section: body.get("section"),
                  Age: body.get("age"),
                  DateofBirth: body.get("dateofbirth"),
                  Religion: body.get("religion"),
                  ContactNo: body.get("contactno"),
                  SpouseName: body.get("spousename"),
                  Sex: body.get("sex"),
                  MothersName: body.get("mothersname"),
                  FathersName: body.get("fathersname"),
                  EmergencyName: body.get("emergency"),
                  EmergencyContactNo: body.get("emergencynumber"),
                  Concern: body.get("concern"),
                  dDate: body.get("dDate"),
                  dTooth: body.get("dTooth"),
                  dServiceOffered: body.get("dServiceOffered"),
                  unknown: body.get("unknown"),
                };
                updatedAppointment = await DentalAppointment.findOneAndUpdate(
                  { _id: AppointmentId },
                  { $set: { 'Details': Data } },
                  { new: true }
                ).exec();
              }
            }
            
            if (!updatedAppointment) {
                return new NextResponse("Appointment not found", { status: 404 });
              }
        
              return new NextResponse("Success", { status: 200 });
            } catch (err) {
              console.error("Database Error:", err);
              return new NextResponse("Database Error", { status: 500 });
            }
          } else {
            return new NextResponse("Method Not Allowed", { status: 405 });
          }
        };