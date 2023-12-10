import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Blogs from "@/models/Blogs";

export const POST = async (request) => {
  if (request.method === 'POST') {
    const formData = await request.formData();

    const id = formData.get("id");

    if (!id) {
      return new NextResponse("Missing ID", { status: 400 });
    }

    try {
      await connect();

      const updatedBlogs = await Blogs.findByIdAndUpdate(
        id,
        {
          Title: formData.get("Title"),
          Content: formData.get("Content"),
        },
        { new: true }
      );

      if (!updatedBlogs) {
        return new NextResponse("Blogs not found", { status: 404 });
      }

      return new NextResponse("Blogs has been updated", { status: 200 });
    } catch (err) {
      console.error(err);
      return new NextResponse("Database Error", { status: 500 });
    }
  } else {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }
};