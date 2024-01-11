import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Notification from "@/models/Notification";

export const GET = async (request) => {
  if (request.method === 'GET') {
    const url = new URL(request.url);

    const Department = url.searchParams.get("Department");

    try {
      await connect();

      let notifications;

      if (!Department) {
        notifications = await Notification.find();
      } else {
        notifications = await Notification.find({ Department });
      }


      return new NextResponse(JSON.stringify(notifications), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
      console.error(err.message);
      return new NextResponse('Database Error:'+ err.message, { status: 500 }); 
    }
  } else {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }
};