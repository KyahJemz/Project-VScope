import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Blogs from "@/models/Blogs";

export const POST = async (request) => {
  if (request.method === 'POST') {
    const body = await request.formData();

    const id = body.get("id");

    if (!id) {
      return new NextResponse("Missing ID", { status: 400 });
    }

    try {
      await connect();
      
      const deletedBlogs = await Blogs.findByIdAndDelete(id);

      if (!deletedBlogs) {
        return new NextResponse("Blogs not found", { status: 404 });
      }

      return new NextResponse("Blogs has been deleted", { status: 200 });
    } catch (err) {
      console.error(err);
      return new NextResponse("Database Error", { status: 500 });
    }
  } else {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }
};