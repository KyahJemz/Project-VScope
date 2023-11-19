import { NextResponse } from "next/server";
import connect from "@/utils/db";
import MedicalAppointment from "@/models/MedicalAppointment";
import DentalAppointment from "@/models/DentalAppointment";
import SDPCAppointment from "@/models/SDPCAppointment";
import { encryptText, decryptText } from "@/utils/cryptojs";

export const POST = async (request) => {
    if (request.method === 'POST') {
        const body = await request.formData();

        const Department = body.get("Department"); 
        const AppointmentId = body.get("AppointmentId"); 
        const Value = body.get("Value") ?? ""; 
        const Report = body.get("Report") ?? ""; 

        try {
            await connect();

            var Appointment = null;
            if (Department === "Medical") {
              Appointment = MedicalAppointment;
            } else if (Department === "Dental") {
              Appointment = DentalAppointment;
            } else if (Department === "SDPC") {
              Appointment = SDPCAppointment;
            } else {
              return new NextResponse("No Appointment", { status: 405 });
            }

            if (Report === "1") {
              await Appointment.findByIdAndUpdate(
                AppointmentId,
                {
                  $set: { Report1: Value },
                },
                { new: true }
              );
            } else {
              await Appointment.findByIdAndUpdate(
                AppointmentId,
                {
                  $set: { Report2: Value },
                },
                { new: true }
              );
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