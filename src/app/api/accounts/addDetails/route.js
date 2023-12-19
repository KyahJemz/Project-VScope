import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Accounts from "@/models/Accounts";
import { encryptText } from "@/utils/cryptojs";

export const POST = async (request) => {
  if (request.method === 'POST') {
    const body = await request.formData();

    const GoogleEmail = body.get("GoogleEmail");
    let updatedDetails = {
      LastName: encryptText(body.get("LastName")),
      FirstName: encryptText(body.get("FirstName")),
      MiddleName: encryptText(body.get("MiddleName")),
      Address: encryptText(body.get("Address")),
      Birthday: encryptText(body.get("Birthday")),
      Age: encryptText(body.get("Age")),
      Sex: encryptText(body.get("Sex")),
      CourseStrand: encryptText(body.get("CourseStrand")),
      YearLevel: encryptText(body.get("YearLevel")),
      SchoolEmail: encryptText(body.get("GoogleEmail")),
      StudentNumber: encryptText(body.get("StudentNumber")),
      ContactNumber: encryptText(body.get("ContactNumber")),
      InCaseOfEmergencyPerson: encryptText(body.get("InCaseOfEmergencyPerson")),
      InCaseOfEmergencyNumber: encryptText(body.get("InCaseOfEmergencyNumber")),
    };

    if (GoogleEmail === "" || GoogleEmail === null) {
      return new NextResponse("Invalid Email", { status: 400 });
    }

    try {
      await connect();

      // Find the existing account by GoogleEmail
      const existingAccount = await Accounts.findOne({ GoogleEmail });

      if (!existingAccount) {
        return new NextResponse("Account not found", { status: 404 });
      }

      // Update the Details field of the existing account
      existingAccount.Details = updatedDetails;

      // Save the changes
      await existingAccount.save();

      return new NextResponse("Success", { status: 201 });
    } catch (err) {
      console.error(err);
      return new NextResponse("Database Error: " + err.message, { status: 500 });
    }
  } else {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }
};
