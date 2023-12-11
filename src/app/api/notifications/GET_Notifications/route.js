import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Notification from "@/models/Notification";

export const GET = async (request) => {
  if (request.method === 'GET') {
    const url = new URL(request.url);

    const Department = url.searchParams.get("Department");

    if (!Department) {
      return new NextResponse("Missing Department", { status: 400 });
    }

    try {
      await connect();
      
      const notifications = await Notification.find({ Department });

      return new NextResponse(JSON.stringify(notifications), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
      console.error(err);
      return new NextResponse("Database Error", { status: 500 });
    }
  } else {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }
};