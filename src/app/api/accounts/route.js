import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Accounts from "@/models/Accounts"
import { encryptText, decryptText } from "@/utils/cryptojs";


export const GET = async (request) => {
    const url = new URL(request.url);
    const GoogleEmail = url.searchParams.get("GoogleEmail");
  
    try {
      await connect();
  
      const results = await Accounts.findOne(GoogleEmail && { GoogleEmail });
  
      const decryptedResults = results.map((result) => ({
        ...result._doc,
        GoogleId: decryptText(result.GoogleId),
        GoogleEmail: GoogleEmail,
        GoogleImage: decryptText(result.GoogleImage),
        GoogleName: decryptText(result.GoogleName),
        GoogleFirstname: decryptText(result.GoogleFirstname),
        GoogleLastname: decryptText(result.GoogleLastname),
      }));
  
      return new NextResponse(JSON.stringify(decryptedResults), { status: 200 });
    } catch (err) {
      return new NextResponse("Database Error", { status: 500 });
    }
}

export async function getAccountByEmail(GoogleEmail) {

    try {
        await connect(); // Connect to your database
        const results = await AccountModel.findOne(GoogleEmail && { GoogleEmail });
        const decryptedResults = results.map((result) => ({
            ...result._doc,
            GoogleId: decryptText(result.GoogleId),
            GoogleEmail: GoogleEmail,
            GoogleImage: decryptText(result.GoogleImage),
            GoogleName: decryptText(result.GoogleName),
            GoogleFirstname: decryptText(result.GoogleFirstname),
            GoogleLastname: decryptText(result.GoogleLastname),
          }));
        return JSON.stringify(decryptedResults);
    } catch (err) {
        return [];
    }
}