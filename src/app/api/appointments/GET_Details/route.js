import { NextResponse } from "next/server";
import connect from "@/utils/db";
import MedicalAppointment from "@/models/MedicalAppointment";
import DentalAppointment from "@/models/DentalAppointment";
import SDPCAppointment from "@/models/SDPCAppointment";

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

        if (Appointment === null) {
            Appointment = [];
        }

        return new NextResponse(JSON.stringify(Appointment), { status: 200 });
    } catch (err) {
        return new NextResponse("Database Error", { status: 500 });
    }
};
