import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Accounts from "@/models/Accounts";

export const GET = async (request) => {
  try {
    await connect();

    if (request.method === 'GET') {
      const url = new URL(request.url);
      const email = url.searchParams.get("GoogleEmail");

      if (!email) {
        return new NextResponse("Missing Email", { status: 400 });
      }

      const account = await Accounts.findOne({ GoogleEmail: email });

      if (!account) {
        return new NextResponse("Account not found", { status: 404 });
      }

      return new NextResponse(JSON.stringify(account), { status: 200 });
    }
  } catch (err) {
    console.error(err);
    return new NextResponse("Database Error", { status: 500 });
  }
};
