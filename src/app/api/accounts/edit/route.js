import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Accounts from "@/models/Accounts";

export const PUT = async (request) => {
  if (request.method === 'PUT') {
    try {
      const body = await request.formData();
      const id = body.get("id");

      if (!id) {
        return new NextResponse("Missing ID", { status: 400 });
      }

      await connect();

      const updatedAccount = await Accounts.findByIdAndUpdate(
        id,
        {
          GoogleEmail: body.get("Gmail"),
          Role: body.get("Role"),
          Department: body.get("Department"),
        },
        { new: true } // Return the modified document
      );

      if (!updatedAccount) {
        return new NextResponse("Account not found", { status: 404 });
      }

      return new NextResponse("Account has been updated", { status: 200 });
    } catch (err) {
      console.error(err);
      return new NextResponse('Database Error', { status: 500 });
    }
  } else {
    return new NextResponse('Method Not Allowed', { status: 405 });
  }
};
