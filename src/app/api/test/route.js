import { NextResponse } from "next/server";
import connect from "@/utils/db";
import { encryptText, decryptText } from "@/utils/cryptojs";

export const POST = async (request) => {
  if (request.method === 'POST') {
    const body = await request.formData();

    const text = body.get("text");
    const type = body.get("type");

    try {
      let result = "";

      if (type === "Encrypt") {
        result = encryptText(text);
      } else if (type === "Decrypt") {
        result = decryptText(text);
      } else {
        return new NextResponse("Invalid operation type", { status: 400 });
      }

      if (result !== undefined && result !== null) {
        return new NextResponse(result, { status: 200 });
      } else {
        return new NextResponse("Invalid operation or issue with encryption/decryption", { status: 400 });
      }
    } catch (err) {
      console.error(err.message);
      return new NextResponse('Database Error:'+ err.message, { status: 500 });
    }
  } else {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }
};