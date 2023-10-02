import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Accounts from "@/models/Accounts"
import { Session } from "next-auth";


export const GET = async (request) => {
    const url = new URL(request.url);
    const GoogleEmail = url.searchParams.get("GoogleEmail");
    console.log("Accounts API GET", GoogleEmail);

    try {
        await connect();
        const results = await Accounts.find(GoogleEmail && { GoogleEmail });
        return new NextResponse(JSON.stringify(results), { status: 200 });
    } catch (err) {
        return new NextResponse("Database Error", { status: 500 });
    }
};

export async function getAccountByEmail(GoogleEmail) {
    console.log("Accounts API GET", GoogleEmail);

    try {
        await connect(); // Connect to your database
        const results = await AccountModel.find(GoogleEmail && { GoogleEmail });
        console.log(results);
        return JSON.stringify(results);
    } catch (err) {
        return [];
    }
}

export const POST = async (request) => {
    if (request.method === 'POST') {
        const body = await request.formData();

        const GoogleId = body.get("GoogleId");
        const GoogleEmail = body.get("GoogleEmail");
        const GoogleImage = body.get("GoogleImage");
        const GoogleName = body.get("GoogleName");
        const GoogleFirstname = body.get("GoogleFirstname");
        const GoogleLastname = body.get("GoogleLastname");

        try {
            await connect();

            let newPost = new Accounts({
                GoogleId,
                GoogleEmail,
                GoogleImage,
                GoogleName,
                GoogleFirstname,
                GoogleLastname,
            });
      
            await newPost.save();

            return new NextResponse("Post has been created", { status: 201 });
        } catch (err) {
            return new NextResponse("Database Error", { status: 500 });
        }
    } else {
        return new NextResponse("Method Not Allowed", { status: 405 });
    }
};
