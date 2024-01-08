import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Accounts from "@/models/Accounts";
import { encryptText, decryptText } from "@/utils/cryptojs";

const decryptFields = (obj) => {
	if (typeof obj !== "object" || obj === null) {
		return obj;
	}

	if (Array.isArray(obj)) {
		return obj.map((item) => decryptFields(item));
	}
  
	const decryptedObj = {};
	for (const key in obj) {
		if (obj.hasOwnProperty(key)) {
			if (typeof obj[key] === "object" && obj[key] !== null) {
				decryptedObj[key] = decryptFields(obj[key]);
			} else {
				decryptedObj[key] = decryptText(obj[key]);
			}
		}
	}
	return decryptedObj;
};

export const GET = async (request) => {
  try {
    await connect();

    if (request.method === 'GET') {
      const url = new URL(request.url);
      const GoogleEmail = url.searchParams.get("GoogleEmail");

      if (!GoogleEmail) {
        return new NextResponse("Missing Email", { status: 400 });
      }

      let results = await Accounts.findOne({ GoogleEmail: GoogleEmail });

      if (!results) {
        return new NextResponse("Account not found", { status: 404 });
      }

      if (results) {
		
        const topLevelFieldsToDecrypt = ["GoogleImage", "GoogleName","GoogleId","GoogleFirstname","GoogleLastname"];
  
        const decryptedResult = { ...results._doc };
  
        topLevelFieldsToDecrypt.forEach((field) => {
          decryptedResult[field] = decryptText(results._doc[field]);
        });
  
        if (results._doc.Details && Object.keys(results._doc.Details).length > 0) {
          decryptedResult.Details = decryptFields(results._doc.Details);
        }

        if (results._doc.MedicalDetails && Object.keys(results._doc.MedicalDetails).length > 0) {
          decryptedResult.MedicalDetails = decryptFields(results._doc.MedicalDetails);
          decryptedResult.MedicalDetails.Files = results._doc.MedicalDetails.Files;
        }

        if (results._doc.DentalDetails && Object.keys(results._doc.DentalDetails).length > 0) {
          decryptedResult.DentalDetails = decryptFields(results._doc.DentalDetails);
          decryptedResult.DentalDetails.Files = results._doc.DentalDetails.Files;
        }

        if (results._doc.SDPCDetails && Object.keys(results._doc.SDPCDetails).length > 0) {
          decryptedResult.SDPCDetails = decryptFields(results._doc.SDPCDetails);
          decryptedResult.SDPCDetails.Files = results._doc.SDPCDetails.Files;
        }
  
        results = decryptedResult;
      }

      return new NextResponse(JSON.stringify(results), { status: 200 });
    }
  } catch (err) {
    console.error(err.message);
    return new NextResponse('Database Error:'+ err.message, { status: 500 });
  }
};
