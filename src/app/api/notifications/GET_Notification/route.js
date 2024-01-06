import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Notification from "@/models/Notification";

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
      
      const notification = await Notification.findOne({ _id: Id, Department: Department });

      return new NextResponse(JSON.stringify(notification), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
      console.error(err.message);
      return new NextResponse('Database Error:'+ err.message, { status: 500 });
    }
  } else {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }
};