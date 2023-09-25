import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Notices from "@/models/Notices";
import fs from 'fs'; 
import path from 'path'; 


export const GET = async (request) => {
    const url = new URL(request.url);
    const nDepartment = url.searchParams.get("department");

    try {
        await connect();

        let results = null;

        if (nDepartment === 'Medical'){
            results = await Notices.find(nDepartment && { nDepartment });
        } else if (nDepartment === 'Dental') {
            results = await Notices.find(nDepartment && { nDepartment });
        } else if (nDepartment === 'SDPC') {
            results = await Notices.find(nDepartment && { nDepartment });
        } else {
            results = await Notices.findAll(); 
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

        const nTitle = body.get("nTitle");
        const nDepartment = body.get("nDepartment");
        const nContent = body.get("nContent");

        try {
            await connect();

            // Handle image upload
            const nImage = handleImageUpload(body, 'nImage');

            const newPost = new Notices({
                nTitle,
                nDepartment,
                nImage,
                nContent,
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

const handleImageUpload = (formData, fieldName) => {
    //const file = formData.get(fieldName);

    //console.log('File object:', file); // Log file object

    return 'default.jpg'; // No image provided

    // const uniqueFileName = `${Date.now()}-${file.name}`;
    // const filePath = path.join('/uploads/notices', uniqueFileName);

    // console.log('File path:', filePath); // Log file path

    // return new Promise((resolve, reject) => {
    //     const reader = fs.createReadStream(file.path);
    //     const writer = fs.createWriteStream(filePath);

    //     reader.on('error', (error) => {
    //         reject(error);
    //     });

    //     writer.on('error', (error) => {
    //         reject(error);
    //     });

    //     writer.on('finish', () => {
    //         resolve(filePath);
    //     });

    //     // Pipe the reader to the writer to copy the file
    //     reader.pipe(writer);
    // });
};
