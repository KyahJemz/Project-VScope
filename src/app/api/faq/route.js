import { NextResponse } from "next/server";
import connect from "@/utils/db";
import FAQ from "@/models/FAQ";

export const GET = async (request) => {
    const url = new URL(request.url);
    const department = url.searchParams.get("department");

    try {
        await connect();

        let query = {};
        if (department) {
            query = { Department: department };
        }

        const results = await FAQ.find(query);
        return new NextResponse(JSON.stringify(results), { status: 200 });
    } catch (err) {
        return new NextResponse("Database Error", { status: 500 });
    }
};

export const POST = async (request) => {
    if (request.method === 'POST') {
        const body = await request.formData();

        const Title = body.get("Title");
        const Content = body.get("Content");
        const Department = body.get("Department");

        if (!Title || !Content || !Department) {
            return new NextResponse("Empty", { status: 500 });
        } 

        try {
            await connect();

            const newFAQ = new FAQ({
                Title,
                Content,
                Department,
                });

            await newFAQ.save();

            return new NextResponse("FAQ has been created", { status: 201 });
        } catch (err) {
            return new NextResponse("Database Error", { status: 500 });
        }
    } else {
        return new NextResponse("Method Not Allowed", { status: 405 });
    }
};
