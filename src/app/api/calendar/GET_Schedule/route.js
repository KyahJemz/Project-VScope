import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Calendar from "@/models/Calendar";

export const GET = async (request) => {
  if (request.method === 'GET') {
    const url = new URL(request.url);
    const Department = url.searchParams.get("Department");
    const Id = url.searchParams.get("Id");

    if (!Department) {
      return new NextResponse("Missing Department", { status: 400 });
    }

    if (!Id) {
      return new NextResponse("Missing Id", { status: 400 });
    }

    try {
      await connect();
      
      const Date = await Calendar.findOne({ Department, _id: Id });

      return new NextResponse(JSON.stringify(Date), { status: 200, headers: { 'Content-Type': 'application/json' } });
      
    } catch (err) {
      console.error(err.message);
      return new NextResponse('Database Error:'+ err.message, { status: 500 });
    }
  } else {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }
};
