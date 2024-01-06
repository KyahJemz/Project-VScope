import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Notification from "@/models/Notification";

export const POST = async (request) => {
  if (request.method === 'POST') {
    const body = await request.formData();

    const Department = body.get("Department");
    const Title = body.get("Title");
    const Target = body.get("Target");
    const Descriptions = body.get("Descriptions");
    let StartingDate = body.get("StartingDate");
    let EndingDate = body.get("EndingDate");

    if (!Title || !Target || !Descriptions || !StartingDate || !EndingDate || !Department) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    try {
      await connect();
      
      const newNotification = new Notification({
        Department,
        Title,
        Target,
        Descriptions,
        StartingDate,
        EndingDate,
      });

      await newNotification.save();

      return new NextResponse("Notification has been added", { status: 200 });
    } catch (err) {
      console.error(err.message);
      return new NextResponse('Database Error:'+ err.message, { status: 500 });
    }
  } else {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }
};
