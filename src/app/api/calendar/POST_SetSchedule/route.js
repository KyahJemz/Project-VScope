import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Calendar from "@/models/Calendar";

export const POST = async (request) => {
  if (request.method === 'POST') {
    const body = await request.formData();

    const Department = body.get("Department"); 
    const Date = body.get("Date"); 
    const Time = body.get("Time"); 

    if (!Department) {
      return new NextResponse("Missing Department", { status: 400 });
    }

    if (!Date) {
      return new NextResponse("Missing Date", { status: 400 });
    }

    if (!Time) {
      return new NextResponse("Missing Time", { status: 400 });
    }

    try {
      await connect();
      
      const existingRecord = await Calendar.findOne({ Department, Date });

      if (existingRecord) {
        return new NextResponse("Record already exists", { status: 200 });
      }

      const newSchedule = new Calendar({
        Department: Department,
        Date: Date,
        Time: Time
      });
  
      await newSchedule.save();

      return new NextResponse("Success", { status: 200 });
      
    } catch (err) {
      console.error(err.message);
      return new NextResponse('Database Error:'+ err.message, { status: 500 });
    }
  } else {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }
};
