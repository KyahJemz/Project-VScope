import { NextResponse } from "next/server";
import connect from "@/utils/db";
import MedicalAppointment from "@/models/MedicalAppointment";
import DentalAppointment from "@/models/DentalAppointment";
import SDPCAppointment from "@/models/SDPCAppointment";

export const POST = async (request) => {
    if (request.method === 'POST') {
        const body = await request.formData();

        const Department = body.get("Department");
        const RecordId = body.get("RecordId");
        const Name = body.get("Name");

    try {
        await connect();

        let appointment = null;

        if (Department === 'Medical'){
            if (Name === Department) {
                appointment = await MedicalAppointment.findByIdAndUpdate(
                  RecordId,
                    { $set: { 'Responses.$[].ViewedByDepartment': true } },
                    { new: true }
                  );
            } else {
                appointment = await MedicalAppointment.findByIdAndUpdate(
                  RecordId,
                    { $set: { 'Responses.$[].ViewedByClient': true } },
                    { new: true }
                  );
            }
        } else if (Department === 'Dental'){
            if (Name === Department) {
                appointment = await DentalAppointment.findByIdAndUpdate(
                  RecordId,
                    { $set: { 'Responses.$[].ViewedByDepartment': true } },
                    { new: true }
                  );
            } else {
                appointment = await DentalAppointment.findByIdAndUpdate(
                  RecordId,
                    { $set: { 'Responses.$[].ViewedByClient': true } },
                    { new: true }
                  );
            }
        } else if (Department === 'SDPC'){
            if (Name === Department) {
                appointment = await SDPCAppointment.findByIdAndUpdate(
                  RecordId,
                    { $set: { 'Responses.$[].ViewedByDepartment': true } },
                    { new: true }
                  );
            } else {
                appointment = await SDPCAppointment.findByIdAndUpdate(
                  RecordId,
                    { $set: { 'Responses.$[].ViewedByClient': true } },
                    { new: true }
                  );
            }
        } 

        if (appointment) {
            return new NextResponse('Success, Updated', { status: 200 });
        } else {
            return new NextResponse('Success, No Updated', { status: 200 });
        }
      } catch (err) {
        console.error(err.message);
        return new NextResponse('Database Error:'+ err.message, { status: 500 });
      }
    } else {
      return new NextResponse('Method Not Allowed', { status: 405 });
    }
  };
