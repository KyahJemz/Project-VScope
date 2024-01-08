import { NextResponse } from "next/server";
import connect from "@/utils/db";
import MedicalAppointment from "@/models/MedicalAppointment";
import DentalAppointment from "@/models/DentalAppointment";
import SDPCAppointment from "@/models/SDPCAppointment";
import { encryptText, decryptText } from "@/utils/cryptojs";
import DirectMessages from "@/models/DirectMessages";

import { writeFile } from 'fs/promises'

export const POST = async (request) => {
    if (request.method === 'POST') {
        const body = await request.formData();

        const Department = body.get("Department");
        const RecordId = body.get("RecordId");
        const Name = body.get("Name");
        const GoogleEmail = body.get("SenderGoogleEmail");
        const Response = body.get("Response");
        const Timestamp = new Date().toISOString();
        const file = body.get('Attachment') ?? null;
        const Type = body.get('Type');


        let AttachmentName = ''; 

        if (file && typeof file.arrayBuffer === 'function') {
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
        
          const randomString = Math.random().toString(36).substring(2, 8);

          AttachmentName = `${randomString}-${file.name}`;
        
          const path = `public/uploads/messages/${AttachmentName}`;
          await writeFile(path, buffer);
        }

        if(AttachmentName==='' && Response === "") {
          return new NextResponse('No response', { status: 404 });
        }

        const newResponse = {
            Name: encryptText(Name),
            GoogleEmail: encryptText(GoogleEmail),
            Response: encryptText(Response),
            Timestamp: encryptText(Timestamp),
            Attachment: AttachmentName, 
            ViewedByDepartment: Department === Name ? true : false,
            ViewedByClient: Department === Name ? false : true,
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
        console.error(err.message);
        return new NextResponse('Database Error:'+ err.message, { status: 500 });
      }
    } else {
      return new NextResponse('Method Not Allowed', { status: 405 });
    }
  };
