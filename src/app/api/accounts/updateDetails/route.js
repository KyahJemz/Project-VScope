import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Accounts from "@/models/Accounts";
import { encryptText, decryptText } from "@/utils/cryptojs";

export const POST = async (request) => {
  if (request.method === 'POST') {
    try {
      const body = await request.formData();

      const GoogleEmail = body.get("GoogleEmail");
      const Key = body.get("Key");
      let Value = body.get("Value");

      await connect();

      let updatedPost = null;

      const encryptedValue = encryptText(Value);
      updatedPost = await Accounts.findOneAndUpdate(
        { GoogleEmail: GoogleEmail },
        { $set: { [`Details.${Key}`]: encryptedValue } },
        { new: true }
      );
      
      if (!updatedPost) {
        return new NextResponse("Record not found", { status: 404 });
      }

      return new NextResponse("Success", { status: 200 });
    } catch (err) {
      console.error(err.message);
      return new NextResponse('Database Error:'+ err.message, { status: 500 });
    }
  } else {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }
};
