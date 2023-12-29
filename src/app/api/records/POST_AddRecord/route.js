import { NextResponse } from "next/server";
import connect from "@/utils/db";
import MedicalAppointment from "@/models/MedicalAppointment";
import DentalAppointment from "@/models/DentalAppointment";
import SDPCAppointment from "@/models/SDPCAppointment";
import { encryptText, decryptText } from "@/utils/cryptojs";
import Defaults from '@/models/Defaults';
import sendMail from '@/app/api/sendMail/route.js';
import Accounts from "@/models/Accounts";
import Calendar from "@/models/Calendar";


async function sendEmail({ to, subject, text }) {
  try {
    await sendMail(to, subject, text);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}

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
          console.log(GoogleEmail)
          const Account = await Accounts.findOne({ GoogleEmail: GoogleEmail });

          Details = {
            LastName: (Account && Account.Details && Account.Details.LastName) ? Account.Details.LastName : "",
            FirstName: (Account && Account.Details && Account.Details.FirstName) ? Account.Details.FirstName : "",
            MiddleName: (Account && Account.Details && Account.Details.MiddleName) ? Account.Details.MiddleName : "",
            Address: (Account && Account.Details && Account.Details.Address) ? Account.Details.Address : "",
            Birthday: (Account && Account.Details && Account.Details.Birthday) ? Account.Details.Birthday : "",
            Age: (Account && Account.Details && Account.Details.Age) ? Account.Details.Age : "",
            Sex: (Account && Account.Details && Account.Details.Sex) ? Account.Details.Sex : "",
            CourseStrand: (Account && Account.Details && Account.Details.CourseStrand) ? Account.Details.CourseStrand : "",
            YearLevel: (Account && Account.Details && Account.Details.YearLevel) ? Account.Details.YearLevel : "",
            SchoolEmail: encryptText(GoogleEmail),
            StudentNumber: (Account && Account.Details && Account.Details.StudentNumber) ? Account.Details.StudentNumber : "",
            ContactNumber: (Account && Account.Details && Account.Details.ContactNumber) ? Account.Details.ContactNumber : "",
            InCaseOfEmergencyPerson: (Account && Account.Details && Account.Details.InCaseOfEmergencyPerson) ? Account.Details.InCaseOfEmergencyPerson : "",
            InCaseOfEmergencyNumber: (Account && Account.Details && Account.Details.InCaseOfEmergencyNumber) ? Account.Details.InCaseOfEmergencyNumber : "",
            Concern: encryptText(body.get("Concern")),
          };
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

        
            const newPost = new AppointmentModel({
              GoogleEmail,
              GoogleImage,
              Department,
              Status,
              Type,
              Category,
              Details,
              DateApproved: Type === "WalkIn" ? new Date() : "",
              DateCleared: "",
              AppointmentDate: Type === "WalkIn" ? "" : body.get("Date"),
              AppointmentTime: Type === "WalkIn" ? "" : body.get("Time"),
            });
    
            await newPost.save();

            const newSchedule = {
              GoogleEmail: GoogleEmail,
              AppointmentId: newPost._id,
            };
            
            // Remove the "-" symbol from the Time string
            const cleanedTime = `${body.get("Time")}`.replace("-", "");
            
            await Calendar.findOneAndUpdate(
              { Date: `${body.get("Date")}` },
              { $push: { [cleanedTime]: newSchedule } },
              { new: true }
            );
  


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
