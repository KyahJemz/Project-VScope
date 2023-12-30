import { NextResponse } from "next/server";
import connect from "@/utils/db";
import MedicalAppointment from "@/models/MedicalAppointment";
import DentalAppointment from "@/models/DentalAppointment";
import SDPCAppointment from "@/models/SDPCAppointment";
import { Reports } from "@/models/Reports";

export const GET = async (request) => {
    const url = new URL(request.url);
    const department = url.searchParams.get("department");
    const query = url.searchParams.get("query");
    const option = url.searchParams.get("option");
    const status = url.searchParams.get("status");

    const SDPCReport1Options = Reports["SDPC"]["Options1"];
    const DentalReport1Options = Reports["Dental"]["Options1"];
    const MedicalReport1Options = Reports["Medical"]["Options1"];

    
    if (!department || !query || !option) {
        return new NextResponse("Empty", { status: 500 });
    }

    try {
        await connect();




        
        return new NextResponse("Invalid", { status: 500 });
    } catch (err) {
        return new NextResponse("Database Error"+err, { status: 500 });
    }
}