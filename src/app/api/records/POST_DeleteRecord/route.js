import { NextResponse } from "next/server";
import connect from "@/utils/db";
import MedicalAppointment from "@/models/MedicalAppointment";
import DentalAppointment from "@/models/DentalAppointment";
import SDPCAppointment from "@/models/SDPCAppointment";

export const POST = async (request) => {
  if (request.method === 'POST') {
    const body = await request.formData();

    const RecordId = body.get("RecordId");
    const Department = body.get("Department");

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

      let deletedPost = null;

      deletedPost = await AppointmentModel.findByIdAndDelete(RecordId);

      if (!deletedPost) {
        return new NextResponse("Record not found", { status: 404 });
      }

      return new NextResponse("Success", { status: 200 });
    } catch (err) {
      return new NextResponse("Database Error: " + err.message, { status: 500 });
    }
  } else {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }
};