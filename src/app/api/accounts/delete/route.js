// Import necessary modules and model
import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Accounts from "@/models/Accounts";

export const POST = async (request) => {
  if (request.method === 'POST') {
    try {
      const body = await request.formData();
      const accountId = body.get("id");

      if (!accountId) {
        return new NextResponse("Missing ID", { status: 400 });
      }

      await connect();

      // Find and delete the account by id
      const deletedAccount = await Accounts.findByIdAndDelete(accountId);

      if (!deletedAccount) {
        return new NextResponse("Account not found", { status: 404 });
      }

      return new NextResponse("Account has been deleted", { status: 200 });
    } catch (err) {
      console.error(err);
      return new NextResponse('Database Error', { status: 500 });
    }
  } else {
    return new NextResponse('Method Not Allowed', { status: 405 });
  }
};
  