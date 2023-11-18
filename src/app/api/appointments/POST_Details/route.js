import { NextResponse } from "next/server";
import connect from "@/utils/db";
import MedicalAppointment from "@/models/MedicalAppointment";
import DentalAppointment from "@/models/DentalAppointment";
import { encryptText, decryptText } from "@/utils/cryptojs";

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
                  FullName: encryptText(body.get("fullname")),
                  DepartmentCourseYear: encryptText(body.get("departmentcourseyear")),
                  Address: encryptText(body.get("address")),
                  ContactNo: encryptText(body.get("contactnumber")),
                  CivilStatus: encryptText(body.get("civilstatus")),
                  Age: encryptText(body.get("age")),
                  Sex: encryptText(body.get("sex")),
                  EmergencyName: encryptText(body.get("emergency")),
                  EmergencyContactNo: encryptText(body.get("emergencynumber")),
                  Concern: encryptText(body.get("concern")),
                };
                updatedAppointment = await MedicalAppointment.findOneAndUpdate(
                  { _id: AppointmentId },
                  { $set: { 'Details': Data } },
                  { new: true }
                ).exec();
              } else if (Department === 'Dental') {
                const Data = {
                  FirstName: encryptText(body.get("firstname")),
                  MiddleName: encryptText(body.get("middlename")),
                  LastName: encryptText(body.get("lastname")),
                  CivilStatus: encryptText(body.get("civilstatus")),
                  Address: encryptText(body.get("address")),
                  Course: encryptText(body.get("course")),
                  Year: encryptText(body.get("year")),
                  Section: encryptText(body.get("section")),
                  Age: encryptText(body.get("age")),
                  DateofBirth: encryptText(body.get("dateofbirth")),
                  Religion: encryptText(body.get("religion")),
                  ContactNo: encryptText(body.get("contactno")),
                  SpouseName: encryptText(body.get("spousename")),
                  Sex: encryptText(body.get("sex")),
                  MothersName: encryptText(body.get("mothersname")),
                  FathersName: encryptText(body.get("fathersname")),
                  EmergencyName: encryptText(body.get("emergency")),
                  EmergencyContactNo: encryptText(body.get("emergencynumber")),
                  Concern: encryptText(body.get("concern")),
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
                  FirstName: encryptText(body.get("firstname")),
                  MiddleName: encryptText(body.get("middlename")),
                  LastName: encryptText(body.get("lastname")),
                  CivilStatus: encryptText(body.get("civilstatus")),
                  Address: encryptText(body.get("address")),
                  Course: encryptText(body.get("course")),
                  Year: encryptText(body.get("year")),
                  Section: encryptText(body.get("section")),
                  Age: encryptText(body.get("age")),
                  DateofBirth: encryptText(body.get("dateofbirth")),
                  Religion: encryptText(body.get("religion")),
                  ContactNo: encryptText(body.get("contactno")),
                  SpouseName: encryptText(body.get("spousename")),
                  Sex: encryptText(body.get("sex")),
                  MothersName: encryptText(body.get("mothersname")),
                  FathersName: encryptText(body.get("fathersname")),
                  EmergencyName: encryptText(body.get("emergency")),
                  EmergencyContactNo: encryptText(body.get("emergencynumber")),
                  Concern: encryptText(body.get("concern")),
                  dDate: encryptText(body.get("dDate")),
                  dTooth: encryptText(body.get("dTooth")),
                  dServiceOffered: encryptText(body.get("dServiceOffered")),
                  unknown: encryptText(body.get("unknown")),
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