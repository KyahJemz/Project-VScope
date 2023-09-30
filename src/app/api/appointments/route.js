import { NextResponse } from "next/server";
import connect from "@/utils/db";
import MedicalAppointment from "@/models/MedicalAppointment";
import DentalAppointment from "@/models/DentalAppointment";
import SDPCAppointment from "@/models/SDPCAppointment";
import Accounts from "@/models/Accounts";

export const GET = async (request) => {
    const url = new URL(request.url);
    const GoogleEmail = url.searchParams.get("GoogleEmail");
    const Department = url.searchParams.get("Department");

    try {
        await connect();

        let results = [];

        if (GoogleEmail ==="" || GoogleEmail === null) {
            if (Department === 'Medical'){
                results = await MedicalAppointment.find();
            } else if (Department === 'Dental') {
                results = await DentalAppointment.find();
            } else if (Department === 'SDPC') {
                results = await SDPCAppointment.find();
            }
        } else {
            const AccountId = await Accounts.find(GoogleEmail && { GoogleEmail });
            const Account_Id = AccountId[0]._id;

            if (Department === 'Medical'){
                results = await MedicalAppointment.find(Account_Id && { Account_Id });
            } else if (Department === 'Dental') {
                results = await DentalAppointment.find(Account_Id && { Account_Id });
            } else if (Department === 'SDPC') {
                results = await SDPCAppointment.find(Account_Id && { Account_Id });
            }
        }


        return new NextResponse(JSON.stringify(results), { status: 200 });
    } catch (err) {
        return new NextResponse("Database Error", { status: 500 });
    }
};

export const POST = async (request) => {
    if (request.method === 'POST') {
        const body = await request.formData();

        const Name = body.get("Name");
        const Id = body.get("Id");
        const Category = body.get("Category");
        const Consern = body.get("Consern");
        const Department = body.get("Department");
        const Status = 'Pending';
        const AccountId = await Accounts.find(GoogleEmail && { GoogleEmail });
        const Account_Id = AccountId[0]._id;
        const GoogleEmail = body.get("GoogleEmail");

        if (GoogleEmail === "" || GoogleEmail === null) {
            return [];
        }

        try {
            await connect();

            let newPost = null;

            if (Department === 'Medical'){
                newPost = new MedicalAppointment({
                    Name,
                    Id,
                    Category,
                    Consern,
                    Department,
                    Status,
                    Account_Id,
                    GoogleEmail
                });
            } else if (Department === 'Dental') {
                newPost = new DentalAppointment({
                    Name,
                    Id,
                    Category,
                    Consern,
                    Department,
                    Status,
                    Account_Id,
                    GoogleEmail
                });
            } else if (Department === 'SDPC') {
                newPost = new SDPCAppointment({
                    Name,
                    Id,
                    Category,
                    Consern,
                    Department,
                    Status,
                    Account_Id,
                    GoogleEmail
                });
            }

            await newPost.save();

            return new NextResponse("Success", { status: 201 });
        } catch (err) {
            return new NextResponse("Database Error", { status: 500 });
        }
    } else {
        return new NextResponse("Method Not Allowed", { status: 405 });
    }
};
