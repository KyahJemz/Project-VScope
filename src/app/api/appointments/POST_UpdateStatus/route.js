import { NextResponse } from "next/server";
import connect from "@/utils/db";
import MedicalAppointment from "@/models/MedicalAppointment";
import DentalAppointment from "@/models/DentalAppointment";
import SDPCAppointment from "@/models/SDPCAppointment";

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

export const POST = async (request) => {
    if (request.method === 'POST') {
        const body = await request.formData();

        const Department = body.get("Department");
        const AppointmentId = body.get("AppointmentId");
        const Status = body.get("Status");
        const Gmail = body.get("Gmail") ?? "";
  
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

        if (Status === "Completed"){
          const to = Gmail;
          const subject = "Appointment Status marked as Completed";
          const text = "We are pleased to inform you that your appointment status has been marked as complete in the VScope system. You are now clear to proceed to the school and collect your health certificate.\n\nIf you have any questions or need further assistance, please do not hesitate to contact us.\n\n";
          await sendEmail({to,subject,text});

        } else if (Status === "Canceled") {
          const to = Gmail;
          const subject = "Appointment Status marked as Canceled";
          const text = "We regret to inform you that your status status has been marked as cancelled in the VScope system. Kindly contact the service department at your earliest convenience to address any concerns related to your health status. \n\nIf you have any questions or need further assistance, please do not hesitate to reach out. \n\n";
          await sendEmail({to,subject,text});

        } else if (Status === "Advising") {
          const to = Gmail;
          const subject = "Appointment Status marked as Advising";
          const text = "We are pleased to inform you that your appointment status has been marked as for advising in the VScope system. \n\nIf you have any questions or need further assistance, please do not hesitate to contact us.\n\n";
          await sendEmail({to,subject,text});
        }

        return new NextResponse('Success', { status: 200 });
      } catch (err) {
        return new NextResponse('Database Error', { status: 500 });
      }
    } else {
      return new NextResponse('Method Not Allowed', { status: 405 });
    }
  };
