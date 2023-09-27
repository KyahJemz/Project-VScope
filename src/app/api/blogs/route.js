import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Blogs from "@/models/Blogs";

export const GET = async (request) => {
    const url = new URL(request.url);
    const Department = url.searchParams.get("department");

    if (Department === "" || Department === null) {
        return [];
    }

    try {
        await connect();

        let results = await Blogs.find(Department && { Department });

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
        const Image = 'default.jpg';

        if (!Title || !Content || !Department || !Image) {
            return new NextResponse("Empty", { status: 500 });
        } 

        try {
            await connect();

            const newBlogs = new Blogs({
                Title,
                Department,
                Image,
                Content,
                });

            await newBlogs.save();

            return new NextResponse("Blog has been created", { status: 201 });
        } catch (err) {
            return new NextResponse("Database Error", { status: 500 });
        }
    } else {
        return new NextResponse("Method Not Allowed", { status: 405 });
    }
};
