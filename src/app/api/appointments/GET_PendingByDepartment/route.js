import { NextResponse } from "next/server";
import connect from "@/utils/db";
import MedicalAppointment from "@/models/MedicalAppointment";
import DentalAppointment from "@/models/DentalAppointment";
import SDPCAppointment from "@/models/SDPCAppointment";

export const GET = async (request) => {
    const url = new URL(request.url);
    const Department = url.searchParams.get("Department");

    if (Department === "" || Department === null) {
        return new NextResponse("Invalid Department", { status: 400 });
    }

    try {
        await connect();

        let results = [];

        if (Department === 'Medical'){
            results = await MedicalAppointment.find({ aDepartment: Department, aStatus: 'Pending' });
        } else if (Department === 'Dental') {
            results = await DentalAppointment.find({ aDepartment: Department, aStatus: 'Pending' });
        } else if (Department === 'SDPC') {
            results = await SDPCAppointment.find({ aDepartment: Department, aStatus: 'Pending' });
        }

        return new NextResponse(JSON.stringify(results), { status: 200 });
    } catch (err) {
        return new NextResponse("Database Error", { status: 500 });
    }
};
