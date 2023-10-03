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
        const Name = body.get("Name");
        const GoogleEmail = body.get("GoogleEmail");
        const Response = body.get("Response");
        const Status = body.get("Status");
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
            if (Response === '' || Response === null) {
                if(Status === '' || Status === null) {
                } else {
                    appointment = await MedicalAppointment.findByIdAndUpdate(AppointmentId,
                        { $set: { Status: Status }  },
                        { new: true }
                    );
                }
            } else {
                if(Status === '' || Status === null) { 
                    appointment = await MedicalAppointment.findByIdAndUpdate(AppointmentId,
                        { $push: { Responses: newResponse } },
                        { new: true }
                    );
                } else {
                    appointment = await MedicalAppointment.findByIdAndUpdate(AppointmentId,
                        { $push: { Responses: newResponse }, $set: { Status: Status }  },
                        { new: true }
                    );
                }
            }

        } else if (Department === 'Dental'){
            if (Response === '' || Response === null) {
                if(Status === '' || Status === null) {
                } else {
                    appointment = await DentalAppointment.findByIdAndUpdate(AppointmentId,
                        { $set: { Status: Status }  },
                        { new: true }
                    );
                }
            } else {
                if(Status === '' || Status === null) { 
                    appointment = await DentalAppointment.findByIdAndUpdate(AppointmentId,
                        { $push: { Responses: newResponse } },
                        { new: true }
                    );
                } else {
                    appointment = await DentalAppointment.findByIdAndUpdate(AppointmentId,
                        { $push: { Responses: newResponse }, $set: { Status: Status }  },
                        { new: true }
                    );
                }
            }

        } else if (Department === 'SDPC'){
            if (Response === '' || Response === null) {
                appointment = await SDPCAppointment.findByIdAndUpdate(AppointmentId,
                    { $set: { Status: Status }  },
                    { new: true }
                );
            } else {
                appointment = await SDPCAppointment.findByIdAndUpdate(AppointmentId,
                    { $push: { Responses: newResponse }, $set: { Status: Status }  },
                    { new: true }
                );
            }
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
