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
        const RecordId = body.get("RecordId");
        const Name = body.get("Name");
        const GoogleEmail = body.get("SenderGoogleEmail");
        const Response = body.get("Response");
        const Timestamp = new Date().toISOString();

        const newResponse = {
            Name: encryptText(Name),
            GoogleEmail: encryptText(GoogleEmail),
            Response: encryptText(Response),
            Timestamp: encryptText(Timestamp),
            ViewedByDepartment: false,
            ViewedByClient: false,
        };
  
    try {
        await connect();

        let appointment = null;

        if (Department === 'Medical'){
            appointment = await MedicalAppointment.findByIdAndUpdate(RecordId,
                { $push: { Responses: newResponse } },
                { new: true });

        } else if (Department === 'Dental'){

                    appointment = await DentalAppointment.findByIdAndUpdate(RecordId,
                        { $push: { Responses: newResponse }  },
                        { new: true });


        } else if (Department === 'SDPC'){
                appointment = await SDPCAppointment.findByIdAndUpdate(RecordId,
                    { $push: { Responses: newResponse } },
                    { new: true });
        } 
  
        if (!appointment) {
          return new NextResponse('Appointment not found', { status: 404 });
        }

        return new NextResponse('Success', { status: 200 });
      } catch (err) {
        return new NextResponse('Database Error' + err, { status: 500 });
      }
    } else {
      return new NextResponse('Method Not Allowed', { status: 405 });
    }
  };
