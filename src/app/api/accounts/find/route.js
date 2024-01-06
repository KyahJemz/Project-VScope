import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Accounts from "@/models/Accounts";

export const POST = async (request) => {
  try {
    await connect();
    const formData = await request.formData();
    const id = formData.get("id");

    if (!id) {
      return new NextResponse("Missing ID", { status: 400 });
    }

    const account = await Accounts.findById(id);

    if (!account) {
      return new NextResponse("Account not found", { status: 404 });
    }

    return new NextResponse(JSON.stringify(account), { status: 200 });
  } catch (err) {
    console.error(err.message);
    return new NextResponse('Database Error:'+ err.message, { status: 500 });
  }
};