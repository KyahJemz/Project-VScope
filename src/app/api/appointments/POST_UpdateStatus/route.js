import { NextResponse } from "next/server";
import connect from "@/utils/db";
import MedicalAppointment from "@/models/MedicalAppointment";
import DentalAppointment from "@/models/DentalAppointment";
import SDPCAppointment from "@/models/SDPCAppointment";

export const POST = async (request) => {
    if (request.method === 'POST') {
        const body = await request.formData();

        const Department = body.get("Department");
        const AppointmentId = body.get("AppointmentId");
        const Status = body.get("Status");
  
    try {
        await connect();

        let appointment = null;

        if (Department === 'Medical'){
            appointment = await MedicalAppointment.findByIdAndUpdate(AppointmentId,
                { $set: { Status: Status }  },
                { new: true }
            );
        } else if (Department === 'Dental'){
            appointment = await DentalAppointment.findByIdAndUpdate(AppointmentId,
                { $set: { Status: Status }  },
                { new: true }
            );
        } else if (Department === 'SDPC'){
            appointment = await SDPCAppointment.findByIdAndUpdate(AppointmentId,
                { $set: { Status: Status }  },
                { new: true }
            );
        } 
  
        if (!appointment) {
          return new NextResponse('Appointment not found', { status: 404 });
        }

        return new NextResponse('Success', { status: 200 });
      } catch (err) {
        return new NextResponse('Database Error', { status: 500 });
      }
    } else {
      return new NextResponse('Method Not Allowed', { status: 405 });
    }
  };
