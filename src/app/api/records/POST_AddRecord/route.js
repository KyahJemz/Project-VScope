import { NextResponse } from "next/server";
import connect from "@/utils/db";
import MedicalAppointment from "@/models/MedicalAppointment";
import DentalAppointment from "@/models/DentalAppointment";
import SDPCAppointment from "@/models/SDPCAppointment";
import { encryptText, decryptText } from "@/utils/cryptojs";
import Defaults from '@/models/Defaults';
import sendMail from '@/app/api/sendMail/route.js';

async function sendEmail({ to, subject, text }) {
  try {
    await sendMail(to, subject, text);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}

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

export const POST = async (request) => {
    if (request.method === 'POST') {
        const body = await request.formData();

        const GoogleEmail = body.get("GoogleEmail");
        const GoogleImage = encryptText(body.get("GoogleImage"));
        const Department = body.get("Department");
        const Status = body.get("Status");
        const Type = body.get("Type");
        const Category = body.get("Category");
        let Details = {};

        if (Type === "WalkIn") {
          Details = {
            LastName: encryptText(body.get("LastName")),
            FirstName: encryptText(body.get("FirstName")),
            MiddleName: encryptText(body.get("MiddleName")),
            Address: encryptText(body.get("Address")),
            Birthday: encryptText(body.get("Birthday")),
            Age: encryptText(body.get("Age")),
            Sex: encryptText(body.get("Sex")),
            CourseStrand: encryptText(body.get("CourseStrand")),
            YearLevel: encryptText(body.get("YearLevel")),
            SchoolEmail: encryptText(body.get("GoogleEmail")),
            StudentNumber: encryptText(body.get("StudentNumber")),
            ContactNumber: encryptText(body.get("ContactNumber")),
            InCaseOfEmergencyPerson: encryptText(body.get("InCaseOfEmergencyPerson")),
            InCaseOfEmergencyNumber: encryptText(body.get("InCaseOfEmergencyNumber")),
            Concern: encryptText(body.get("Concern")),
          }
        } else if(Type === "Appointment"){
            Details = {
              LastName: encryptText(body.get("LastName")),
              FirstName: encryptText(body.get("FirstName")),
              MiddleName: encryptText(body.get("MiddleName")),
              Address: encryptText(body.get("Address")),
              Birthday: encryptText(body.get("Birthday")),
              Age: encryptText(body.get("Age")),
              Sex: encryptText(body.get("Sex")),
              CourseStrand: encryptText(body.get("CourseStrand")),
              YearLevel: encryptText(body.get("YearLevel")),
              SchoolEmail: encryptText(body.get("GoogleEmail")),
              StudentNumber: encryptText(body.get("StudentNumber")),
              ContactNumber: encryptText(body.get("ContactNumber")),
              InCaseOfEmergencyPerson: encryptText(body.get("InCaseOfEmergencyPerson")),
              InCaseOfEmergencyNumber: encryptText(body.get("InCaseOfEmergencyNumber")),
              Concern: encryptText(body.get("Concern")),
            }
        }

        if (GoogleEmail === "" || GoogleEmail === null) {
            return [];
        }

        let AppointmentModel;
        if (Department === 'Medical') {
          AppointmentModel = MedicalAppointment;
        } else if (Department === 'Dental') {
          AppointmentModel = DentalAppointment;
        } else if (Department === 'SDPC') {
          AppointmentModel = SDPCAppointment;
        }

        try {
          await connect();

          let newPost = null;

          newPost = new AppointmentModel({
            GoogleEmail,
            GoogleImage,
            Department,
            Status,
            Type,
            Category,
            Details,
            DateApproved: Type === "WalkIn" ? new Date() : "",
            DateCleared: "",
          });
              
          await newPost.save();

          if (Type === "WalkIn") {

          } else {
            const to = 
              Department === 'Dental' ? Defaults.DentalEmail : 
              Department === 'Medical' ? Defaults.MedicalEmail : 
              Department === 'SDPC' ? Defaults.SDPCEmail : "" ;
            const subject = "Appointment Request";
            const text = "You have received an appointment request via VScope. The request is now pending at the appointment requests page, and we will be in touch with you soon to confirm the details. ";
            // await sendEmail({to,subject,text});
          }
           
          return new NextResponse("Success", { status: 201 });
        } catch (err) {
          return new NextResponse("Database Error: " + err.message, { status: 500 });
        }
    } else {
        return new NextResponse("Method Not Allowed", { status: 405 });
    }
};
