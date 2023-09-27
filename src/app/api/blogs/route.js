import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Blogs from "@/models/Blogs";
import { createWriteStream } from 'fs';
import { v4 as uuidv4 } from 'uuid';

const saveImage = async (image) => {
    const uniqueFilename = `${uuidv4()}.jpg`; // Generate a unique filename using UUID
    const path = `./public/uploads/blogs/${uniqueFilename}`; // Specify the directory to save the image
  
    return new Promise((resolve, reject) => {
      const writeStream = createWriteStream(path);
  
      image.stream.pipe(writeStream);
      image.on('end', () => resolve({ filename: uniqueFilename, path }));
      image.on('error', (error) => {
        console.log('Error saving image:', error);
        reject(error);
      });
    });
  };

export const GET = async (request) => {
    const url = new URL(request.url);
    const department = url.searchParams.get("department");

    try {
        await connect();

        let query = {};
        if (department) {
            query = { Department: department };
        }

        const results = await Blogs.find(query);
        return new NextResponse(JSON.stringify(results), { status: 200 });
    } catch (err) {
        return new NextResponse("Database Error", { status: 500 });
    }
};

export const POST = async (request) => {
    if (request.method === 'POST') {
      try {
        await connect();
  
        const body = await request.formData();
        const Title = body.get("Title");
        const Content = body.get("Content");
        const Department = body.get("Department");
        const Image = request.files && request.files.Image; // Get the image file
        console.log(Image);
  
        let imageUrl = null;
  
        if (Image) {
          const { filename, path } = await saveImage(Image);
          imageUrl = path; // Use the file path as the image URL
        }
  
        if (!Title || !Content || !Department) {
          return new NextResponse("Missing required data", { status: 400 });
        }
  
        const newBlogs = new Blogs({
          Title,
          Department,
          Image: imageUrl,
          Content,
        });
  
        await newBlogs.save();
  
        return new NextResponse("Blog has been created", { status: 201 });
      } catch (err) {
        console.error(err);
        return new NextResponse("Database Error", { status: 500 });
      }
    } else {
      return new NextResponse("Method Not Allowed", { status: 405 });
    }
  };