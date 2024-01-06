import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Assessments from "@/models/Assessments";

export const GET = async (request) => {
  if (request.method === 'GET') {
    const url = new URL(request.url);
    const Department = url.searchParams.get("Department");
    const GoogleEmail = url.searchParams.get("GoogleEmail");

    if (!Department || !GoogleEmail) {
      return new NextResponse("Missing Parameters", { status: 400 });
    }

    try {
      await connect();
      
      const results = await Assessments.find({
        Department,
        GoogleEmail,
      });

      return new NextResponse(JSON.stringify(results), { status: 200, headers: { 'Content-Type': 'application/json' } });
      
    } catch (err) {
      console.error(err.message);
      return new NextResponse('Database Error:'+ err.message, { status: 500 });
    }
  } else {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }
};
