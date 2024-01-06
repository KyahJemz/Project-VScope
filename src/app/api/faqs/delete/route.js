import { NextResponse } from "next/server";
import connect from "@/utils/db";
import FAQ from "@/models/FAQ";

export const POST = async (request) => {
  if (request.method === 'POST') {
    const body = await request.formData();

    const id = body.get("id");

    if (!id) {
      return new NextResponse("Missing ID", { status: 400 });
    }

    try {
      await connect();
      
      const deletedFAQ = await FAQ.findByIdAndDelete(id);

      if (!deletedFAQ) {
        return new NextResponse("FAQ not found", { status: 404 });
      }

      return new NextResponse("FAQ has been deleted", { status: 200 });
    } catch (err) {
      console.error(err.message);
      return new NextResponse('Database Error:'+ err.message, { status: 500 });
    }
  } else {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }
};