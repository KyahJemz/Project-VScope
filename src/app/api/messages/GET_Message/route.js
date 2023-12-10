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

    if (Department === "" || Department === null) {
        return new NextResponse("Invalid Department", { status: 400 });
    }

    console.log(Department,AppointmentId)

    try {
        await connect();

        let Appointment = null;

        if (Department === 'Medical'){
            Appointment = await MedicalAppointment.findById(AppointmentId);
        } else if (Department === 'Dental') {
            Appointment = await DentalAppointment.findById(AppointmentId);
        } else if (Department === 'SDPC') {
            Appointment = await SDPCAppointment.findById(AppointmentId);
        }

        console.log(Appointment);

        if (Appointment) {
          const topLevelFieldsToDecrypt = ["GoogleImage"];
        
          topLevelFieldsToDecrypt.forEach((field) => {
            // Check if the field is not blank or null before decrypting
            Appointment[field] = Appointment[field] ? decryptText(Appointment[field]) : Appointment[field];
          });
        
          if (Appointment.Details && Object.keys(Appointment.Details).length > 0) {
            Appointment.Details = decryptFields(Appointment.Details);
          }
        
          if (Appointment.Responses && Appointment.Responses.length > 0) {
            const decryptedResponses = Appointment.Responses.map((response) => {
              // Check and decrypt each field in the response object
              const decryptedResponse = {
                Name: response.Name ? decryptText(response.Name) : response.Name,
                GoogleEmail: response.GoogleEmail ? decryptText(response.GoogleEmail) : response.GoogleEmail,
                Response: response.Response ? decryptText(response.Response) : response.Response,
                Timestamp: response.Timestamp ? decryptText(response.Timestamp) : response.Timestamp,
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
        return new NextResponse("Database Error " + err, { status: 500 });
    }
};
