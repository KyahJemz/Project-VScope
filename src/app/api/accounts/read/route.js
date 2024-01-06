import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Accounts from "@/models/Accounts";

export const GET = async (request) => {
  try {
    await connect();

    const results = await Accounts.find({});
    
    return new NextResponse(JSON.stringify(results), { status: 200 });
  } catch (err) {
    console.error(err.message);
    return new NextResponse('Database Error:'+ err.message, { status: 500 });
  }
};