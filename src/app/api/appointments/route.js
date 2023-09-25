import { NextResponse } from "next/server";
import connect from "@/utils/db";
import MedicalAppointment from "@/models/MedicalAppointment";
import DentalAppointment from "@/models/DentalAppointment";
import SDPCAppointment from "@/models/SDPCAppointment";
import Accounts from "@/models/Accounts";

export const GET = async (request) => {
    const url = new URL(request.url);
    const GoogleEmail = url.searchParams.get("GoogleEmail");
    const aDepartment = url.searchParams.get("category");

    if (GoogleEmail === "" || GoogleEmail === null) {
        return [];
    }

    try {
        await connect();

        const aAccountId = await Accounts.find(GoogleEmail && { GoogleEmail });
        const aAccount_Id = aAccountId[0]._id;

        let results = null;

        if (aDepartment === 'Medical'){
            results = await MedicalAppointment.find(aAccount_Id && { aAccount_Id });
        } else if (aDepartment === 'Dental') {
            results = await DentalAppointment.find(aAccount_Id && { aAccount_Id });
        } else if (aDepartment === 'SDPC') {
            results = await SDPCAppointment.find(aAccount_Id && { aAccount_Id });
        }

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
        const aDepartment = body.get("aDepartment");
        const GoogleEmail = body.get("GoogleEmail");
        const aStatus = 'pending';

        if (GoogleEmail === "" || GoogleEmail === null) {
            return [];
        }

        const aAccountId = await Accounts.find(GoogleEmail && { GoogleEmail });
        const aAccount_Id = aAccountId[0]._id;

        try {
            await connect();

            let newPost = null;

            if (aDepartment === 'Medical'){
                newPost = new MedicalAppointment({
                    aName,
                    aId,
                    aCategory,
                    aConsern,
                    aDepartment,
                    aStatus,
                    aAccount_Id
                });
            } else if (aDepartment === 'Dental') {
                newPost = new DentalAppointment({
                    aName,
                    aId,
                    aCategory,
                    aConsern,
                    aDepartment,
                    aStatus,
                    aAccount_Id
                });
            } else if (aDepartment === 'SDPC') {
                newPost = new SDPCAppointment({
                    aName,
                    aId,
                    aCategory,
                    aConsern,
                    aDepartment,
                    aStatus,
                    aAccount_Id
                });
            }

            await newPost.save();

            return new NextResponse("Post has been created", { status: 201 });
        } catch (err) {
            return new NextResponse("Database Error", { status: 500 });
        }
    } else {
        return new NextResponse("Method Not Allowed", { status: 405 });
    }
};
