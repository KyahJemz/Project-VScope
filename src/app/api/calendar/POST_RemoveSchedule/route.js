import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Calendar from "@/models/Calendar";

export const POST = async (request) => {
  if (request.method === 'POST') {
    const body = await request.formData();

    const Department = body.get("Department"); 
    const Id = body.get("Id"); 

    if (!Department) {
      return new NextResponse("Missing Department", { status: 400 });
    }

    if (!Id) {
      return new NextResponse("Missing Date", { status: 400 });
    }

    try {
      await connect();
      
      const result = await Calendar.deleteOne({ Department, _id: Id });

      if (result.deletedCount === 0) {
        return new NextResponse("Document not found", { status: 404 });
      }
 
      return new NextResponse("Success", { status: 200 });
 
    } catch (err) {
      console.error(err);
      return new NextResponse("Database Error", { status: 500 });
    }
  } else {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }
};
