import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Notification from "@/models/Notification";

export const POST = async (request) => {
  if (request.method === 'POST') {
    const body = await request.formData();

    const Id = body.get("Id");
    const Department = body.get("Department");

    if (!Id) {
      return new NextResponse("Missing Id", { status: 400 });
    }

    if (!Department) {
      return new NextResponse("Missing Department", { status: 400 });
    }

    try {
      await connect();
      
      const deletedNotification = await Notification.findByIdAndDelete({ _id: Id, Department: Department });

      if (!deletedNotification) {
        return new NextResponse("Notification not found", { status: 404 });
      }

      return new NextResponse("Notification has been deleted", { status: 200 });
    } catch (err) {
      console.error(err);
      return new NextResponse("Database Error"+err, { status: 500 });
    }
  } else {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }
};