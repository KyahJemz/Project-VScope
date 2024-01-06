import { NextResponse } from "next/server";
import connect from "@/utils/db";
import FAQ from "@/models/FAQ";

export const GET = async (request) => {
  if (request.method === 'GET') {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new NextResponse("Missing ID", { status: 400 });
    }

    try {
      await connect();
      
      const FAQs = await FAQ.findById(id);

      if (!FAQs) {
        return new NextResponse("FAQ not found", { status: 404 });
      }

      return new NextResponse(JSON.stringify(FAQs), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
      console.error(err.message);
      return new NextResponse('Database Error:'+ err.message, { status: 500 });
    }
  } else {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }
};
