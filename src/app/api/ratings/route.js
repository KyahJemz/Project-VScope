import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Blogs from "@/models/Blogs";

export const POST = async (request) => {
  if (request.method === 'POST') {
    const body = await request.formData();

    const BlogId = body.get("BlogId");
    const Id = body.get("Id");
    const Rating = parseInt(body.get("Rating")); // Convert the string to a number

    try {
      await connect();

      const blog = await Blogs.findOne({ Title: BlogId });

      if (!blog) {
        return new NextResponse("Blog not found", { status: 404 });
      }
      const existingRatingIndex = blog.Ratings.findIndex(Ratings => Ratings.Id === Id);

      if (existingRatingIndex !== -1) {
        blog.Ratings[existingRatingIndex].Rating = Rating;
      } else {
        blog.Ratings.push({ Id, Rating });
      }

      await blog.save();

      return new NextResponse("Rating updated", { status: 200 });
    } catch (err) {
      return new NextResponse("Database Error", { status: 500 });
    }
  } else {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }
};