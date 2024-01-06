import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Assessments from "@/models/Assessments";

export const GET = async (request) => {
  if (request.method === 'GET') {
    const url = new URL(request.url);
    const Id = url.searchParams.get("Id");

    if (!Id) {
      return new NextResponse("Missing Id", { status: 400 });
    }

    try {
      await connect();
      
      const result = await Assessments.findById(Id);

      return new NextResponse(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } });
      
    } catch (err) {
      console.error(err.message);
      return new NextResponse('Database Error:'+ err.message, { status: 500 });
    }
  } else {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }
};
