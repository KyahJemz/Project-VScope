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

    let results = await Accounts.find({});

    if (results) {
	
      const topLevelFieldsToDecrypt = ["GoogleId","GoogleImage","GoogleName","GoogleFirstname","GoogleLastname"];
  
      results = results.map((result) => {
        const decryptedResult = { ...result._doc };
  
        topLevelFieldsToDecrypt.forEach((field) => {
          decryptedResult[field] = decryptText(result._doc[field]);
        });
  
        if (result._doc.Details && Object.keys(result._doc.Details).length > 0) {
          decryptedResult.Details = decryptFields(result._doc.Details);
        }
  
        return decryptedResult;
      });
    }
    
    return new NextResponse(JSON.stringify(results), { status: 200 });
  } catch (err) {
    console.error(err);
    return new NextResponse("Database Error", { status: 500 });
  }
};