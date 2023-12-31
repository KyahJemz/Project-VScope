import { NextRequest, NextResponse } from "next/server";
import connect from "@/utils/db";
import Blogs from "@/models/Blogs";

import { writeFile } from 'fs/promises'

const uploadDir = "public/images/uploads/blogs/";

export const GET = async (request) => {
  const url = new URL(request.url);
  const department = url.searchParams.get("department");

  try {
    await connect();

    let query = {};
    if (department) {
      query = { Department: department };
    }

    const results = await Blogs.aggregate([
      { $match: query },
      {
        $addFields: {
          avgRating: { $avg: "$Ratings.Rating" },
          totalRatings: { $size: "$Ratings" }
        }
      }
    ]);

    return new NextResponse(JSON.stringify(results), { status: 200 });
  } catch (err) {
    return new NextResponse("Database Error", { status: 500 });
  }
};

export const POST = async (request) => {
  const data = await request.formData();
  const file = data.get('Image');

  try {
    await connect();

    let imageName = ''; 

    if (file && typeof file.arrayBuffer === 'function') {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const path = `public/uploads/blogs/${file.name}`;
      await writeFile(path, buffer);

      imageName = file.name;
    }

    const newBlogs = new Blogs({
      Title: data.get('Title'),
      Department: data.get('Department'),
      Image: imageName,
      Content: data.get('Content'),
    });

    await newBlogs.save();

    return new NextResponse('Blog has been created', { status: 201 });
  } catch (err) {
    console.error(err.message);
    return new NextResponse('Database Error:'+ err.message, { status: 500 });
  }
};