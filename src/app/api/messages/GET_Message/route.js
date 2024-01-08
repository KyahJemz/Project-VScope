import { NextResponse } from "next/server";
import connect from "@/utils/db";
import MedicalAppointment from "@/models/MedicalAppointment";
import DentalAppointment from "@/models/DentalAppointment";
import SDPCAppointment from "@/models/SDPCAppointment";
import { encryptText, decryptText } from "@/utils/cryptojs";
import DirectMessages from "@/models/DirectMessages";

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
        // Check if the field is blank or null before decrypting
        decryptedObj[key] = obj[key] ? decryptText(obj[key]) : obj[key];
      }
    }
  }
  return decryptedObj;
};

export const GET = async (request) => {
    const url = new URL(request.url);
    const Department = url.searchParams.get("department");
    const AppointmentId = url.searchParams.get("id");
    const GoogleEmail = url.searchParams.get("GoogleEmail");

    if (Department === "" || Department === null) {
        return new NextResponse("Invalid Department", { status: 400 });
    }

    try {
        await connect();

        let Appointment = null;

        Appointment = await DirectMessages.find({Department,GoogleEmail});

        if (Department === 'Medical'){
            Appointment = await MedicalAppointment.findById(AppointmentId);
        } else if (Department === 'Dental') {
            Appointment = await DentalAppointment.findById(AppointmentId);
        } else if (Department === 'SDPC') {
            Appointment = await SDPCAppointment.findById(AppointmentId);
        }
        if (!Appointment) {
          Appointment = await DirectMessages.findById(AppointmentId);
        }
        if (!Appointment) {
          Appointment = await DirectMessages.findOne({Department, GoogleEmail});
        }

        if (Appointment) {
          const topLevelFieldsToDecrypt = ["GoogleImage"];
        
          topLevelFieldsToDecrypt.forEach((field) => {
            Appointment[field] = Appointment[field] ? decryptText(Appointment[field]) : Appointment[field];
          });
        
          if (Appointment.Details && Object.keys(Appointment.Details).length > 0) {
            Appointment.Details = decryptFields(Appointment.Details);
          }
        
          if (Appointment.Responses && Appointment.Responses.length > 0) {
            const decryptedResponses = Appointment.Responses.map((response) => {
              const decryptedResponse = {
                Name: response.Name ? decryptText(response.Name) : response.Name,
                GoogleEmail: response.GoogleEmail ? decryptText(response.GoogleEmail) : response.GoogleEmail,
                Response: response.Response ? decryptText(response.Response) : response.Response,
                Timestamp: response.Timestamp ? decryptText(response.Timestamp) : response.Timestamp,
                Attachment: response.Attachment,
                ViewedByDepartment: response.ViewedByDepartment,
                ViewedByClient: response.ViewedByClient,
              };
              return decryptedResponse;
            });
            Appointment.Responses = decryptedResponses;
          }
        }

        return new NextResponse(JSON.stringify(Appointment), { status: 200 });
    } catch (err) {
      console.error(err.message);
      return new NextResponse('Database Error:'+ err.message, { status: 500 });
    }
};
