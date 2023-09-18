import { NextResponse } from "next/server";
import connect from "@/utils/db";
import MedicalAppointment from "@/models/MedicalAppointment";
import DentalAppointment from "@/models/DentalAppointment";
import SDPCAppointment from "@/models/SDPCAppointment";

export const GET = async (request) => {
    const url = new URL(request.url);
    const aUsername = url.searchParams.get("username");
    const aDepartment = url.searchParams.get("category");

    try {
        await connect();

        let results = null;

        if (aDepartment === 'Medical'){
            results = await MedicalAppointment.find(aUsername && { aUsername });
        } else if (aDepartment === 'Dental') {
            results = await DentalAppointment.find(aUsername && { aUsername });
        } else if (aDepartment === 'SDPC') {
            results = await SDPCAppointment.find(aUsername && { aUsername });
        }

        console.log(JSON.stringify(results));

        return new NextResponse(JSON.stringify(results), { status: 200 });
    } catch (err) {
        return new NextResponse("Database Error", { status: 500 });
    }
};

export const POST = async (request) => {
    if (request.method === 'POST') {
        const body = await request.formData();

        const aName = body.get("aName");
        const aId = body.get("aId");
        const aCategory = body.get("aCategory");
        const aConsern = body.get("aConsern");
        const aUsername = body.get("aUsername");
        const aDepartment = body.get("aDepartment");
        const aStatus = 'pending';

        try {
            await connect();

            let newPost = null;

            if (aDepartment === 'Medical'){
                newPost = new MedicalAppointment({
                    aName,
                    aId,
                    aCategory,
                    aConsern,
                    aUsername,
                    aDepartment,
                    aStatus,
                });
            } else if (aDepartment === 'Dental') {
                newPost = new DentalAppointment({
                    aName,
                    aId,
                    aCategory,
                    aConsern,
                    aUsername,
                    aDepartment,
                    aStatus,
                });
            } else if (aDepartment === 'SDPC') {
                newPost = new SDPCAppointment({
                    aName,
                    aId,
                    aCategory,
                    aConsern,
                    aUsername,
                    aDepartment,
                    aStatus,
                });
            }

            await newPost.save();

            console.log("success");
            return new NextResponse("Post has been created", { status: 201 });
        } catch (err) {
            console.log("failed");
            return new NextResponse("Database Error", { status: 500 });
        }
    } else {
        return new NextResponse("Method Not Allowed", { status: 405 });
    }
};
