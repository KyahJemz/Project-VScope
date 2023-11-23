import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Accounts from "@/models/Accounts";

export const GET = async (request) => {
  try {
    await connect();

    const departmentsToFetch = ['Dental', 'SDPC', 'Medical'];

    const results = await Accounts.find({ Department: { $in: departmentsToFetch } });
    console.log(results.length);
    return new NextResponse(JSON.stringify(results), { status: 200 });
  } catch (err) {
    console.error(err);
    return new NextResponse("Database Error", { status: 500 });
  }
};